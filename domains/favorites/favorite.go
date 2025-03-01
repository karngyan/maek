package favorites

import "github.com/karngyan/maek/db"

type EntityType int

const (
	EntityNotes EntityType = iota + 1
	EntityCollections
)

type Favorite struct {
	ID          int64
	UserID      int64
	EntityType  EntityType
	EntityID    int64
	WorkspaceID int64
	Created     int64
	Updated     int64
	Order       int32
}

func favoriteFromDB(dbFavorite db.Favorite) *Favorite {
	return &Favorite{
		ID:          dbFavorite.ID,
		UserID:      dbFavorite.UserID,
		EntityType:  EntityType(dbFavorite.EntityType),
		EntityID:    dbFavorite.EntityID,
		WorkspaceID: dbFavorite.WorkspaceID,
		Created:     dbFavorite.Created,
		Updated:     dbFavorite.Updated,
		Order:       dbFavorite.OrderIdx,
	}
}
