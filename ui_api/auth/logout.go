package auth

import (
	"net/http"

	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/ui_api/web"
)

func logout(ctx web.Context) error {
	rctx := ctx.Request().Context()

	err := auth.DeleteSession(rctx, ctx.Session.Token)
	if err != nil {
		return ctx.InternalError(err)
	}

	ctx.SetCookie(&http.Cookie{
		Name:     "session_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})

	return ctx.NoContent(http.StatusOK)
}
