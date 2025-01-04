package notes

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"

	mapset "github.com/deckarep/golang-set/v2"
	"github.com/jackc/pgx/v5"
	"github.com/karngyan/maek/db"
	"github.com/karngyan/maek/domains/auth"
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
	Authors    []*auth.User
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

	relatedUserIDs := mapset.NewSet[int64]()

	var notes []*Note
	for _, dbNote := range dbNotes {
		notes = append(notes, noteFromDB(dbNote))

		relatedUserIDs.Add(dbNote.CreatedByID)
		relatedUserIDs.Add(dbNote.UpdatedByID)
	}

	var nextCursor string
	if hasNextPage {
		lastNote := notes[len(notes)-1]
		nextCursor = encodeCursor(lastNote.SortValue(sortKey), lastNote.ID)
	}

	dbUsers, err := db.Q.GetUsersByIDs(ctx, relatedUserIDs.ToSlice())
	if err != nil {
		return nil, err
	}

	var users []*auth.User
	for _, dbUser := range dbUsers {
		users = append(users, auth.UserFromDBUser(&dbUser))
	}

	return &Bundle{
		Notes:      notes,
		Authors:    users,
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

func FindNotesForCollection(ctx context.Context, wid, cid int64) ([]*Note, []*auth.User, error) {
	dbNotes, err := db.Q.GetNotesByCollectionID(ctx, db.GetNotesByCollectionIDParams{
		CollectionID: cid,
		WorkspaceID:  wid,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return []*Note{}, []*auth.User{}, nil
		}
		return nil, nil, err
	}

	var notes []*Note
	for _, dbNote := range dbNotes {
		notes = append(notes, noteFromDB(dbNote))
	}

	relatedUserIDs := mapset.NewSet[int64]()
	for _, dbNote := range dbNotes {
		relatedUserIDs.Add(dbNote.CreatedByID)
		relatedUserIDs.Add(dbNote.UpdatedByID)
	}

	dbUsers, err := db.Q.GetUsersByIDs(ctx, relatedUserIDs.ToSlice())
	if err != nil {
		return nil, nil, err
	}

	var users []*auth.User
	for _, dbUser := range dbUsers {
		users = append(users, auth.UserFromDBUser(&dbUser))
	}

	return notes, users, nil
}
