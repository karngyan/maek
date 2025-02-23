package auth

import (
	"net/http"

	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/ui_api/web"
)

func updateUser(ctx web.Context) error {
	var req struct {
		Name       string `json:"name"`
		Email      string `json:"email"`
		UpdateType string `json:"update_type"`
	}

	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusUnprocessableEntity, map[string]any{
			"error": err.Error(),
		})
	}

	if req.Email != "" || req.UpdateType == "email" || req.UpdateType == "both" {
		// update email not supported yet
		return ctx.JSON(http.StatusBadRequest, map[string]any{
			"error": "email update not supported yet",
		})
	}

	rctx := ctx.Request().Context()
	err := auth.UpdateUser(rctx, ctx.Session.UserID, req.Name)
	if err != nil {
		return ctx.InternalError(err)
	}

	return ctx.JSON(http.StatusOK, nil)
}
