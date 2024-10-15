package models

type Note struct {
	Id        uint64         `json:"id"`
	Content   map[string]any `json:"content"`
	Favorite  bool           `json:"favorite"`
	Created   int64          `json:"created"`
	Updated   int64          `json:"updated"`
	CreatedBy *User          `json:"createdBy"`
	UpdatedBy *User          `json:"updatedBy"`
}
