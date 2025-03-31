package favorites

import (
	"context"

	"github.com/bluele/go-timecop"
	"github.com/karngyan/maek/db"
)

func UpdateOrder(ctx context.Context, fid, uid int64, order int32) error {
	// need to make sure the updated order doesn't collide with anyone else
	// if it does it should reindex?
	// but may be the frontend should handle that?
	// think about it a bit and solve it tonight

	return db.Q.UpdateFavoriteOrder(ctx, db.UpdateFavoriteOrderParams{
		OrderIdx: order,
		Updated:  timecop.Now().Unix(),
		ID:       fid,
	})
}
