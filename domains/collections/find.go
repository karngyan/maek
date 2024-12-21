package collections

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"

	"github.com/karngyan/maek/db"
)

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
