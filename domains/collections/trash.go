package collections

import (
	"context"
	"errors"

	"github.com/bluele/go-timecop"
	"github.com/jackc/pgx/v5"

	"github.com/karngyan/maek/db"
)

func TrashCollection(ctx context.Context, wid, cid, userID int64) error {
	err := db.Q.TrashCollection(ctx, db.TrashCollectionParams{
		UpdatedByID: userID,
		Updated:     timecop.Now().Unix(),
		ID:          cid,
		WorkspaceID: wid,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrCollectionNotFound
		}

		return err
	}

	return nil
}

func TrashCollectionMulti(ctx context.Context, cids []int64, wid, userID int64) error {
	return db.Q.TrashCollectionsByIDs(ctx, db.TrashCollectionsByIDsParams{
		UpdatedByID: userID,
		Updated:     timecop.Now().Unix(),
		Ids:         cids,
		WorkspaceID: wid,
	})
}
