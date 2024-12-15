package models

import "github.com/karngyan/maek/domains/notes"

type Collection struct {
	Id          uint64  `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Created     int64   `json:"created"`
	Updated     int64   `json:"updated"`
	Trashed     bool    `json:"trashed"`
	Notes       []*Note `json:"notes"`
	WorkspaceId uint64  `json:"workspaceId"`
	CreatedBy   *User   `json:"createdBy"`
	UpdatedBy   *User   `json:"updatedBy"`
}

func ModelForCollection(collection *notes.Collection) *Collection {
	notes := make([]*Note, 0, len(collection.Notes))
	for _, note := range collection.Notes {
		n, err := ModelForNote(note)
		if err != nil {
			// meh
			continue
		}

		notes = append(notes, n)
	}

	return &Collection{
		Id:          collection.Id,
		Name:        collection.Name,
		Description: collection.Description,
		Created:     collection.Created,
		Updated:     collection.Updated,
		Trashed:     collection.Trashed,
		Notes:       notes,
		WorkspaceId: collection.Workspace.Id,
		CreatedBy:   ModelForUser(collection.CreatedBy),
		UpdatedBy:   ModelForUser(collection.UpdatedBy),
	}
}
