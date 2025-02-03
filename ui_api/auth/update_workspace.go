package auth

import (
	"net/http"

	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/ui_api/web"
)

func updateWorkspace(ctx web.Context) error {
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
	err := auth.UpdateWorkspace(rctx, ctx.WorkspaceID, req.Name, req.Description)
	if err != nil {
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, nil)
}
