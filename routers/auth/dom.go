package auth

import (
	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/routers/models"
)

func modelForWorkspace(workspace *auth.Workspace) *models.Workspace {
	return &models.Workspace{
		Id:          workspace.Id,
		Name:        workspace.Name,
		Description: workspace.Description,
		Created:     workspace.Created,
		Updated:     workspace.Updated,
	}
}

func modelsForAuthInfo(user *auth.User) map[string]any {
	u := models.ModelForUser(user)
	wss := make([]*models.Workspace, 0, len(user.Workspaces))
	for _, ws := range user.Workspaces {
		wss = append(wss, modelForWorkspace(ws))
	}

	return map[string]any{
		"user":       u,
		"workspaces": wss,
	}
}
