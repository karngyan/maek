package favorites

import (
	"context"

	"github.com/bluele/go-timecop"
	"github.com/karngyan/maek/db"
)

func Create(ctx context.Context, etype EntityType, eid, uid, wid int64, order int32) (*Favorite, error) {
	now := timecop.Now().Unix()
	var dbFavorite db.Favorite

	err := db.Tx(ctx, func(ctx context.Context, q *db.Queries) error {
		maxOrder, err := q.GetMaxOrderIndexFavorite(ctx, uid)
		if err != nil {
			return err
		}

		orderVal := order
		if maxOrder.Valid && maxOrder.Int32 > orderVal {
			orderVal = maxOrder.Int32
		}

		dbFavorite, err = q.CreateFavorite(ctx, db.CreateFavoriteParams{
			UserID:      uid,
			EntityType:  int32(etype),
			EntityID:    eid,
			WorkspaceID: wid,
			Created:     now,
			Updated:     now,
			OrderIdx:    orderVal,
		})
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return favoriteFromDB(dbFavorite), nil
}
