package notes

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/gob"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/karngyan/maek/db"
)

var ErrNoteNotFound = errors.New("note not found")
var ErrLimitTooHigh = errors.New("limit too high")
var ErrInvalidCursor = errors.New("invalid cursor")
var ErrFailedToDecodeCursor = errors.New("failed to decode cursor")

const (
	DefaultLimit = 100
)

type SortKey string

const (
	SortKeyCreatedAsc SortKey = "created_asc"
	SortKeyUpdatedAsc SortKey = "updated_asc"
	SortKeyCreatedDsc SortKey = "created_dsc"
	SortKeyUpdatedDsc SortKey = "updated_dsc"
)

func FromSortString(sort string) SortKey {
	switch sort {
	case "created_asc":
		return SortKeyCreatedAsc
	case "updated_asc":
		return SortKeyUpdatedAsc
	case "created_dsc":
		return SortKeyCreatedDsc
	case "updated_dsc":
		return SortKeyUpdatedDsc
	default:
		return SortKeyUpdatedDsc
	}
}

func decodeCursor(cursor string) (int64, int64, error) {
	if cursor == "" {
		return 0, 0, nil
	}

	decodedBytes, err := base64.StdEncoding.DecodeString(cursor)
	if err != nil {
		return 0, 0, ErrInvalidCursor
	}

	var sortValue, id int64
	n, err := fmt.Sscanf(string(decodedBytes), "%d:%d", &sortValue, &id)
	if err != nil {
		return 0, 0, ErrFailedToDecodeCursor
	}

	if n != 2 {
		return 0, 0, ErrFailedToDecodeCursor
	}

	return sortValue, id, nil
}

func encodeCursor(sortValue int64, id int64) string {
	rawCursor := fmt.Sprintf("%d:%d", sortValue, id)
	return base64.StdEncoding.EncodeToString([]byte(rawCursor))
}

type Bundle struct {
	Notes      []*Note
	NextCursor string
}

func FindNotesForWorkspace(ctx context.Context, wid int64, cursor string, limit int, sortKey SortKey) (*Bundle, error) {
	if limit > DefaultLimit {
		return nil, ErrLimitTooHigh
	}

	if limit < 1 {
		limit = DefaultLimit
	}

	lastSortValue, lastNoteId, err := decodeCursor(cursor)
	if err != nil {
		lastNoteId = 0
		lastSortValue = 0
	}

	var dbNotes []db.Note
	if lastSortValue > 0 {
		switch sortKey {
		case SortKeyCreatedAsc:
			dbNotes, err = db.Q.GetNotesCreatedAsc(ctx, db.GetNotesCreatedAscParams{
				WorkspaceID:   wid,
				Limit:         int64(limit + 1),
				LastSortValue: lastSortValue,
				LastNoteID:    lastNoteId,
			})
		case SortKeyUpdatedAsc:
			dbNotes, err = db.Q.GetNotesUpdatedAsc(ctx, db.GetNotesUpdatedAscParams{
				WorkspaceID:   wid,
				Limit:         int64(limit + 1),
				LastSortValue: lastSortValue,
				LastNoteID:    lastNoteId,
			})
		case SortKeyCreatedDsc:
			dbNotes, err = db.Q.GetNotesCreatedDesc(ctx, db.GetNotesCreatedDescParams{
				WorkspaceID:   wid,
				Limit:         int64(limit + 1),
				LastSortValue: lastSortValue,
				LastNoteID:    lastNoteId,
			})
		case SortKeyUpdatedDsc:
			dbNotes, err = db.Q.GetNotesUpdatedDesc(ctx, db.GetNotesUpdatedDescParams{
				WorkspaceID:   wid,
				Limit:         int64(limit + 1),
				LastSortValue: lastSortValue,
				LastNoteID:    lastNoteId,
			})
		}
	} else {
		switch sortKey {
		case SortKeyCreatedAsc:
			dbNotes, err = db.Q.GetInitialNotesCreatedAsc(ctx, db.GetInitialNotesCreatedAscParams{
				WorkspaceID: wid,
				Limit:       int64(limit + 1),
			})
		case SortKeyUpdatedAsc:
			dbNotes, err = db.Q.GetInitialNotesUpdatedAsc(ctx, db.GetInitialNotesUpdatedAscParams{
				WorkspaceID: wid,
				Limit:       int64(limit + 1),
			})
		case SortKeyCreatedDsc:
			dbNotes, err = db.Q.GetInitialNotesCreatedDesc(ctx, db.GetInitialNotesCreatedDescParams{
				WorkspaceID: wid,
				Limit:       int64(limit + 1),
			})
		case SortKeyUpdatedDsc:
			dbNotes, err = db.Q.GetInitialNotesUpdatedDesc(ctx, db.GetInitialNotesUpdatedDescParams{
				WorkspaceID: wid,
				Limit:       int64(limit + 1),
			})
		}
	}
	if err != nil {
		return nil, err
	}

	if len(dbNotes) == 0 {
		return &Bundle{}, nil
	}

	hasNextPage := len(dbNotes) > limit
	if hasNextPage {
		dbNotes = dbNotes[:limit] // Trim to the requested limit
	}

	var notes []*Note
	for _, dbNote := range dbNotes {
		notes = append(notes, noteFromDB(dbNote))
	}

	var nextCursor string
	if hasNextPage {
		lastNote := notes[len(notes)-1]
		nextCursor = encodeCursor(lastNote.SortValue(sortKey), lastNote.ID)
	}

	return &Bundle{
		Notes:      notes,
		NextCursor: nextCursor,
	}, nil
}

// FindNoteByUUID finds a note by its UUID, workspace ID and returns the note if found
// When the note is not found or deleted, it returns ErrNoteNotFound
func FindNoteByUUID(ctx context.Context, nuuid string, wid int64) (*Note, error) {
	dbNote, err := db.Q.GetNoteByUUIDAndWorkspace(ctx, db.GetNoteByUUIDAndWorkspaceParams{
		UUID:        nuuid,
		WorkspaceID: wid,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNoteNotFound
		}
		return nil, err
	}

	if dbNote.Deleted {
		return nil, ErrNoteNotFound
	}

	return noteFromDB(dbNote), nil
}

func FindNotesForCollection(ctx context.Context, wid, cid int64) ([]*Note, error) {
	dbNotes, err := db.Q.GetNotesByCollectionID(ctx, db.GetNotesByCollectionIDParams{
		CollectionID: cid,
		WorkspaceID:  wid,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return []*Note{}, nil
		}
		return nil, err
	}

	var notes []*Note
	for _, dbNote := range dbNotes {
		notes = append(notes, noteFromDB(dbNote))
	}

	return notes, nil
}

func FindNoteInfo(ctx context.Context, nuuid string) (*NoteInfo, error) {
	var ni NoteInfo
	if v, err := noteUUIDCache.Get(nuuid); err == nil {
		if err := ni.UnmarshalGOB(v); err == nil {
			return &ni, nil
		}

		// If there is an error, we will fetch the note info from the database
	}

	dbNi, err := db.Q.CheckNoteExists(ctx, nuuid)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNoteNotFound
		}
		return nil, err
	}

	ni = NoteInfo{CheckNoteExistsRow: dbNi}
	nib, err := ni.MarshalGOB()
	if err != nil {
		return nil, err
	}

	if err := noteUUIDCache.Set(nuuid, nib); err != nil {
		return nil, err
	}

	return &ni, nil
}

type NoteInfo struct {
	db.CheckNoteExistsRow
}

func (n *NoteInfo) MarshalGOB() ([]byte, error) {
	var buf bytes.Buffer
	err := gob.NewEncoder(&buf).Encode(n)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

func (n *NoteInfo) UnmarshalGOB(data []byte) error {
	return gob.NewDecoder(bytes.NewReader(data)).Decode(n)
}
