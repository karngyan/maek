package models

import (
	"github.com/karngyan/maek/domains/collections"
)

type Collection struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Created     int64  `json:"created"`
	Updated     int64  `json:"updated"`
	Trashed     bool   `json:"trashed"`
	WorkspaceID int64  `json:"workspaceId"`
	CreatedByID int64  `json:"createdById"`
	UpdatedByID int64  `json:"updatedById"`
}

func ModelForCollection(collection *collections.Collection) *Collection {
	return &Collection{
		ID:          collection.ID,
		Name:        collection.Name,
		Description: collection.Description,
		Created:     collection.Created,
		Updated:     collection.Updated,
		Trashed:     collection.Trashed,
		WorkspaceID: collection.WorkspaceID,
		CreatedByID: collection.CreatedByID,
		UpdatedByID: collection.UpdatedByID,
	}
}

func ModelForCollections(collections []*collections.Collection) []*Collection {
	uiCollections := make([]*Collection, 0, len(collections))
	for _, c := range collections {
		uiCollections = append(uiCollections, ModelForCollection(c))
	}

	return uiCollections
}
