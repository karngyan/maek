package auth

import (
	"net/http"

	"github.com/karngyan/maek/domains/auth"

	"github.com/karngyan/maek/routers/base"
)

func Logout(ctx *base.WebContext) {
	rctx := ctx.Request.Context()

	err := auth.DeleteSession(rctx, ctx.Session.Token)
	if err != nil {
		base.InternalError(ctx, err)
		return
	}

	base.RespondCookie(ctx, nil, http.StatusOK, &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})
}
