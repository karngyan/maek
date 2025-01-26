package collections

import (
	"github.com/karngyan/maek/db"
)

type Collection struct {
	ID          int64
	Name        string
	Description string
	Created     int64
	Updated     int64
	Favorite    bool
	Trashed     bool
	Deleted     bool
	WorkspaceID int64
	CreatedByID int64
	UpdatedByID int64
}

func CollectionFromDB(dbCollection db.Collection) *Collection {
	return &Collection{
		ID:          dbCollection.ID,
		Name:        dbCollection.Name,
		Description: dbCollection.Description,
		Created:     dbCollection.Created,
		Updated:     dbCollection.Updated,
		Favorite:    dbCollection.Favorite,
		Trashed:     dbCollection.Trashed,
		Deleted:     dbCollection.Deleted,
		WorkspaceID: dbCollection.WorkspaceID,
		CreatedByID: dbCollection.CreatedByID,
		UpdatedByID: dbCollection.UpdatedByID,
	}
}
