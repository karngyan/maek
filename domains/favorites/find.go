package favorites

import (
	"context"

	"github.com/karngyan/maek/db"
)

const (
	defaultLimit = 20
	maxLimit     = 100
)

func FindAll(ctx context.Context, uid, lim int64) ([]*Favorite, error) {
	if lim == 0 {
		lim = defaultLimit
	}

	if lim > maxLimit {
		lim = maxLimit
	}

	dbFavorites, err := db.Q.GetFavoritesByUser(ctx, db.GetFavoritesByUserParams{
		UserID: uid,
		Limit:  lim,
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
