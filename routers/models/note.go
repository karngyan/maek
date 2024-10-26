package models

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
