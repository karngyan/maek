package favorites

import (
	"context"

	"github.com/karngyan/maek/db"
)

func UpdateOrder(ctx context.Context, fid, uid int64, order int32) error {
	return db.Q.UpdateFavoriteOrder(ctx, db.UpdateFavoriteOrderParams{
		OrderIdx: order,
		ID:       fid,
		UserID:   uid,
	})
}
