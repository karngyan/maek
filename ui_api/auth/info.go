package auth

import (
	"net/http"

	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/ui_api/models"
	"github.com/karngyan/maek/ui_api/web"
)

func info(ctx web.Context) error {
	return ctx.JSON(http.StatusOK, models.ModelForAuthBundle(&auth.Bundle{
		User:       ctx.User,
		Session:    ctx.Session,
		Workspaces: ctx.AllWorkspaces,
	}))
}
