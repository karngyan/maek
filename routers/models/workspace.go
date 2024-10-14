package models

type Workspace struct {
	Id          uint64 `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Created     int64  `json:"created"`
	Updated     int64  `json:"updated"`
}
