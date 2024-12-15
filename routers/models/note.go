package models

import (
	"encoding/json"

	"github.com/karngyan/maek/domains/notes"
)

type Note struct {
	Id             uint64         `json:"id"`
	Uuid           string         `json:"uuid"`
	Content        map[string]any `json:"content"`
	Favorite       bool           `json:"favorite"`
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
	WorkspaceId    uint64         `json:"workspaceId"`
	CreatedBy      *User          `json:"createdBy"`
	UpdatedBy      *User          `json:"updatedBy"`
}

func ModelForNote(note *notes.Note) (*Note, error) {
	var content map[string]any
	if err := json.Unmarshal([]byte(note.Content), &content); err != nil {
		return nil, err
	}

	return &Note{
		Id:             note.Id,
		Uuid:           note.Uuid,
		Content:        content,
		Favorite:       note.Favorite,
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
		WorkspaceId:    note.Workspace.Id,
		CreatedBy:      ModelForUser(note.CreatedBy),
		UpdatedBy:      ModelForUser(note.UpdatedBy),
	}, nil
}
