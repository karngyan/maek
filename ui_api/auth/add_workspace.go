package auth

import (
	"net/http"

	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/ui_api/models"
	"github.com/karngyan/maek/ui_api/web"
)

func addNewWorkspaceForUser(ctx web.Context) error {
	var req struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusUnprocessableEntity, map[string]any{
			"error": err.Error(),
		})
	}

	rctx := ctx.Request().Context()
	ws, err := auth.AddNewWorkspace(rctx, ctx.Session.UserID, req.Name, req.Description)
	if err != nil {
		return ctx.InternalError(err)
	}

	uiWs := models.ModelForWorkspace(ws)

	return ctx.JSON(http.StatusCreated, map[string]any{
		"workspace": uiWs,
	})
}
