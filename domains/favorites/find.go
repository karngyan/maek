package favorites

import (
	"context"

	"github.com/karngyan/maek/db"
)

const (
	defaultLimit = 100
	maxLimit     = 500
)

func FindAll(ctx context.Context, wid, uid, lim int64) ([]*Favorite, error) {
	if lim == 0 {
		lim = defaultLimit
	}

	if lim > maxLimit {
		lim = maxLimit
	}

	dbFavorites, err := db.Q.GetFavoritesForUser(ctx, db.GetFavoritesForUserParams{
		UserID:      uid,
		WorkspaceID: wid,
		Limit:       lim,
	})
	if err != nil {
		return nil, err
	}

	favorites := make([]*Favorite, len(dbFavorites))
	for i, dbFavorite := range dbFavorites {
		favorites[i] = favoriteFromDB(dbFavorite)
	}

	return favorites, nil
}
