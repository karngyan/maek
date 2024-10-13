package auth

import (
	"net/http"

	"github.com/karngyan/maek/routers/base"
)

func Me(ctx *base.WebContext) {
	base.Respond(ctx, map[string]any{
		"user":     ctx.User,
		"accounts": ctx.User.Accounts,
	}, http.StatusOK)
}
