package collections

import (
	"errors"

	"github.com/karngyan/maek/db"
)

var ErrCollectionNotFound = errors.New("collection not found")

type Collection struct {
	ID          int64
	Name        string
	Description string
	Created     int64
	Updated     int64
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
		Trashed:     dbCollection.Trashed,
		Deleted:     dbCollection.Deleted,
		WorkspaceID: dbCollection.WorkspaceID,
		CreatedByID: dbCollection.CreatedByID,
		UpdatedByID: dbCollection.UpdatedByID,
	}
}
