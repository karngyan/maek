package models

import (
	"encoding/json"

	"github.com/karngyan/maek/domains/notes"
)

type Note struct {
	ID             int64          `json:"id"`
	UUID           string         `json:"uuid"`
	Content        map[string]any `json:"content"`
	Trashed        bool           `json:"trashed"`
	HasContent     bool           `json:"hasContent"`
	HasImages      bool           `json:"hasImages"`
	HasVideos      bool           `json:"hasVideos"`
	HasOpenTasks   bool           `json:"hasOpenTasks"`
	HasClosedTasks bool           `json:"hasClosedTasks"`
	HasCode        bool           `json:"hasCode"`
	HasAudios      bool           `json:"hasAudios"`
	HasLinks       bool           `json:"hasLinks"`
	HasFiles       bool           `json:"hasFiles"`
	HasQuotes      bool           `json:"hasQuotes"`
	HasTables      bool           `json:"hasTables"`
	Created        int64          `json:"created"`
	Updated        int64          `json:"updated"`
	WorkspaceID    int64          `json:"workspaceId"`
	CreatedByID    int64          `json:"createdById"`
	UpdatedByID    int64          `json:"updatedById"`
}

func ModelForNote(note *notes.Note) (*Note, error) {
	var content map[string]any
	if err := json.Unmarshal(note.Content, &content); err != nil {
		return nil, err
	}

	return &Note{
		ID:             note.ID,
		UUID:           note.UUID,
		Content:        content,
		Trashed:        note.Trashed,
		HasContent:     note.HasContent,
		HasImages:      note.HasImages,
		HasVideos:      note.HasVideos,
		HasOpenTasks:   note.HasOpenTasks,
		HasClosedTasks: note.HasClosedTasks,
		HasCode:        note.HasCode,
		HasAudios:      note.HasAudios,
		HasLinks:       note.HasLinks,
		HasFiles:       note.HasFiles,
		HasQuotes:      note.HasQuotes,
		HasTables:      note.HasTables,
		Created:        note.Created,
		Updated:        note.Updated,
		WorkspaceID:    note.WorkspaceID,
		CreatedByID:    note.CreatedByID,
		UpdatedByID:    note.UpdatedByID,
	}, nil
}
