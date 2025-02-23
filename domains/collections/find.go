package collections

import (
	"context"
	"encoding/base64"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5/pgtype"

	mapset "github.com/deckarep/golang-set/v2"
	"github.com/jackc/pgx/v5"

	"github.com/karngyan/maek/db"
	"github.com/karngyan/maek/domains/auth"
)

const (
	DefaultLimit = 200
)

type SortKey string

const (
	SortKeyUpdatedAsc SortKey = "updated_asc"
	SortKeyUpdatedDsc SortKey = "updated_dsc"
	SortKeyNameAsc    SortKey = "name_asc"
	SortKeyNameDsc    SortKey = "name_dsc"
)

var (
	ErrLimitTooHigh       = errors.New("limit too high")
	ErrCollectionNotFound = errors.New("collection not found")
)

func FromSortString(sort string) SortKey {
	switch sort {
	case "updated_asc":
		return SortKeyUpdatedAsc
	case "updated_dsc":
		return SortKeyUpdatedDsc
	case "name_asc":
		return SortKeyNameAsc
	case "name_dsc":
		return SortKeyNameDsc
	default:
		return SortKeyUpdatedDsc
	}
}

func FindCollectionByID(ctx context.Context, wid int64, id int64) (*Collection, error) {
	dbCollection, err := db.Q.GetCollectionByIDAndWorkspace(ctx, db.GetCollectionByIDAndWorkspaceParams{
		ID:          id,
		WorkspaceID: wid,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrCollectionNotFound
		}
		return nil, err
	}

	if dbCollection.Deleted {
		return nil, ErrCollectionNotFound
	}

	return CollectionFromDB(dbCollection), nil
}

func FindCollectionsForNoteUUID(ctx context.Context, wid int64, nuuid string) ([]*Collection, error) {
	dbCollections, err := db.Q.GetCollectionsByNoteUUIDAndWorkspace(ctx, db.GetCollectionsByNoteUUIDAndWorkspaceParams{
		UUID:        nuuid,
		WorkspaceID: wid,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return []*Collection{}, nil
		}
		return nil, err
	}

	collections := make([]*Collection, 0, len(dbCollections))
	for _, dbCollection := range dbCollections {
		collections = append(collections, CollectionFromDB(dbCollection))
	}

	return collections, nil
}

type Bundle struct {
	Collections []*Collection
	Authors     []*auth.User
	NextCursor  string
}

func FindCollectionsForWorkspace(ctx context.Context, wid int64, cursor string, limit int, sortKey SortKey) (*Bundle, error) {
	if limit > DefaultLimit {
		return nil, ErrLimitTooHigh
	}

	if limit < 1 {
		limit = DefaultLimit
	}

	lastSortValue, lastCollectionID, err := decodeCursor(cursor)
	if err != nil {
		lastSortValue = ""
		lastCollectionID = 0
	}

	lastSortValueInt, _ := strconv.ParseInt(lastSortValue, 10, 64)

	var sortBy, sortOrder pgtype.Text
	if strings.HasPrefix(string(sortKey), "updated") {
		sortBy = pgtype.Text{
			String: "updated",
			Valid:  true,
		}
	} else {
		sortBy = pgtype.Text{
			String: "name",
			Valid:  true,
		}
	}

	if strings.HasSuffix(string(sortKey), "asc") {
		sortOrder = pgtype.Text{
			String: "asc",
			Valid:  true,
		}
	} else {
		sortOrder = pgtype.Text{
			String: "desc",
			Valid:  true,
		}
	}

	dbCollections, err := db.Q.ListCollections(ctx, db.ListCollectionsParams{
		WorkspaceID:   wid,
		Limit:         int64(limit + 1),
		SortBy:        sortBy,
		SortOrder:     sortOrder,
		CursorUpdated: lastSortValueInt,
		CursorID:      lastCollectionID,
		CursorName:    lastSortValue,
	})

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return &Bundle{}, nil
		}

		return nil, err
	}

	if len(dbCollections) == 0 {
		return &Bundle{}, nil
	}

	hasNextPage := len(dbCollections) > limit
	if hasNextPage {
		dbCollections = dbCollections[:limit]
	}

	relatedUserIDs := mapset.NewSet[int64]()
	collections := make([]*Collection, 0, len(dbCollections))

	for _, collection := range dbCollections {
		collections = append(collections, CollectionFromDB(collection))

		relatedUserIDs.Add(collection.CreatedByID)
		relatedUserIDs.Add(collection.UpdatedByID)
	}

	var nextCursor string
	if hasNextPage {
		lastCollection := dbCollections[len(dbCollections)-1]
		if strings.HasPrefix(string(sortKey), "updated") {
			nextCursor = encodeCursor(fmt.Sprintf("%d", lastCollection.Updated), lastCollection.ID)
		} else {
			nextCursor = encodeCursor(fmt.Sprintf("%s", lastCollection.Name), lastCollection.ID)
		}
	}

	dbUsers, err := db.Q.GetUsersByIDs(ctx, relatedUserIDs.ToSlice())
	if err != nil {
		return nil, err
	}

	authors := make([]*auth.User, 0, len(dbUsers))
	for _, dbUser := range dbUsers {
		authors = append(authors, auth.UserFromDBUser(&dbUser))
	}

	return &Bundle{
		Collections: collections,
		Authors:     authors,
		NextCursor:  nextCursor,
	}, nil
}

func encodeCursor(sortValue string, collectionID int64) string {
	rawValue := fmt.Sprintf("%s:%d", sortValue, collectionID)
	return base64.StdEncoding.EncodeToString([]byte(rawValue))
}

func decodeCursor(cursor string) (string, int64, error) {
	if cursor == "" {
		return "", 0, nil
	}

	rawValue, err := base64.StdEncoding.DecodeString(cursor)
	if err != nil {
		return "", 0, err
	}

	var sortValue string
	var id int64

	parts := strings.Split(string(rawValue), ":")
	if len(parts) != 2 {
		return "", 0, errors.New("invalid cursor")
	}

	sortValue = parts[0]
	id, err = strconv.ParseInt(parts[1], 10, 64)
	if err != nil {
		return "", 0, errors.New("invalid cursor")
	}

	return sortValue, id, nil
}
