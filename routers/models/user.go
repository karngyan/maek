package models

import "github.com/karngyan/maek/domains/auth"

type User struct {
	Id                 int64  `json:"id"`
	Name               string `json:"name"`
	Email              string `json:"email"`
	Verified           bool   `json:"verified"`
	Role               string `json:"role"`
	DefaultWorkspaceId int64  `json:"defaultWorkspaceId"`
	Created            int64  `json:"created"`
	Updated            int64  `json:"updated"`
}

func ModelForUser(user *auth.User) *User {
	return &User{
		Id:                 user.ID,
		Name:               user.Name,
		Email:              user.Email,
		Verified:           user.Verified,
		Role:               string(user.Role),
		DefaultWorkspaceId: user.DefaultWorkspaceID,
		Created:            user.Created,
		Updated:            user.Updated,
	}
}
