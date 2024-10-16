package models

type Note struct {
	Id          uint64         `json:"id"`
	Uuid        string         `json:"uuid"`
	Content     map[string]any `json:"content"`
	Favorite    bool           `json:"favorite"`
	Trashed     bool           `json:"trashed"`
	Created     int64          `json:"created"`
	Updated     int64          `json:"updated"`
	WorkspaceId uint64         `json:"workspaceId"`
	CreatedBy   *User          `json:"createdBy"`
	UpdatedBy   *User          `json:"updatedBy"`
}
