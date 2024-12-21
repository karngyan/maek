package auth

import (
	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/routers/models"
)

func modelForWorkspace(workspace *auth.Workspace) *models.Workspace {
	return &models.Workspace{
		ID:          workspace.ID,
		Name:        workspace.Name,
		Description: workspace.Description,
		Created:     workspace.Created,
		Updated:     workspace.Updated,
	}
}

func modelForAuthBundle(bundle *auth.Bundle) map[string]any {
	u := models.ModelForUser(bundle.User)
	wss := make([]*models.Workspace, 0, len(bundle.Workspaces))
	for _, ws := range bundle.Workspaces {
		wss = append(wss, modelForWorkspace(ws))
	}

	return map[string]any{
		"user":       u,
		"workspaces": wss,
	}
}
