package auth

import (
	"net/http"

	"github.com/karngyan/maek/routers/base"
)

func Logout(ctx *base.WebContext) {
	rctx := ctx.Request.Context()
	err := ctx.Session.Delete(rctx)
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
