package notes

import (
	"encoding/json"

	"github.com/karngyan/maek/domains/notes"
	"github.com/karngyan/maek/routers/models"
)

func modelForNote(note *notes.Note) (*models.Note, error) {
	var content map[string]any
	if err := json.Unmarshal([]byte(note.Content), &content); err != nil {
		return nil, err
	}

	return &models.Note{
		Id:          note.Id,
		Uuid:        note.Uuid,
		Content:     content,
		Favorite:    note.Favorite,
		Trashed:     note.Trashed,
		Created:     note.Created,
		Updated:     note.Updated,
		WorkspaceId: note.Workspace.Id,
		CreatedBy:   models.ModelForUser(note.CreatedBy),
		UpdatedBy:   models.ModelForUser(note.UpdatedBy),
	}, nil
}
