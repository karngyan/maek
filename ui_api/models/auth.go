package models

import (
	"github.com/karngyan/maek/domains/auth"
)

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

type Workspace struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Created     int64  `json:"created"`
	Updated     int64  `json:"updated"`
}

func ModelForWorkspace(workspace *auth.Workspace) *Workspace {
	return &Workspace{
		ID:          workspace.ID,
		Name:        workspace.Name,
		Description: workspace.Description,
		Created:     workspace.Created,
		Updated:     workspace.Updated,
	}
}

func ModelForAuthBundle(bundle *auth.Bundle) map[string]any {
	u := ModelForUser(bundle.User)
	wss := make([]*Workspace, 0, len(bundle.Workspaces))
	for _, ws := range bundle.Workspaces {
		wss = append(wss, ModelForWorkspace(ws))
	}

	return map[string]any{
		"user":       u,
		"workspaces": wss,
	}
}
