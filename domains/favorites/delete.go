package favorites

import (
	"context"

	"github.com/karngyan/maek/db"
)

func DeleteFavorite(ctx context.Context, fid, uid, wid int64) error {
	return db.Q.DeleteFavorite(ctx, db.DeleteFavoriteParams{
		ID:          fid,
		UserID:      uid,
		WorkspaceID: wid,
	})
}
