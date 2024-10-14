package models

type User struct {
	Id                 uint64 `json:"id"`
	Name               string `json:"name"`
	Email              string `json:"email"`
	Verified           bool   `json:"verified"`
	Role               string `json:"role"`
	DefaultWorkspaceId uint64 `json:"defaultWorkspaceId"`
	Created            int64  `json:"created"`
	Updated            int64  `json:"updated"`
}
