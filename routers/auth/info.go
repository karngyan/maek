package auth

import (
	"net/http"

	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/routers/base"
)

func Info(ctx *base.WebContext) {
	base.Respond(ctx, modelForAuthBundle(&auth.Bundle{
		User:       ctx.User,
		Session:    ctx.Session,
		Workspaces: ctx.AllWorkspaces,
	}), http.StatusOK)
}
