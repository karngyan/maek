package auth

import (
	"net/http"

	"github.com/karngyan/maek/routers/base"
)

func Info(ctx *base.WebContext) {
	base.Respond(ctx, modelsForAuthInfo(ctx.User), http.StatusOK)
}
