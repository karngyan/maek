package notes

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"strconv"
	"strings"

	mapset "github.com/deckarep/golang-set/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"

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

	parts := strings.Split(string(decodedBytes), ":")
	if len(parts) != 2 {
		return 0, 0, ErrInvalidCursor
	}

	sortValue, err := strconv.ParseInt(parts[0], 10, 64)
	if err != nil {
		return 0, 0, ErrFailedToDecodeCursor
	}

	id, err := strconv.ParseInt(parts[1], 10, 64)
	if err != nil {
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

	dbNotes, err := db.Q.GetNotesWithSortingAndPagination(ctx, db.GetNotesWithSortingAndPaginationParams{
		WorkspaceID:   wid,
		Limit:         int64(limit + 1),
		LastSortValue: lastSortValue,
		SortKey: pgtype.Text{
			String: string(sortKey),
			Valid:  true,
		},
		LastNoteID: lastNoteId,
	})
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
		notes = append(notes, noteFromDB(&dbNote))

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

// FindNoteByUUUID finds a note by its UUID, workspace ID and returns the note if found
// When the note is not found or deleted, it returns ErrNoteNotFound
func FindNoteByUUUID(ctx context.Context, nuuid string, wid int64) (*Note, error) {
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

	return noteFromDB(&dbNote), nil
}
