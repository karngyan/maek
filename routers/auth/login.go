package auth

import (
	"errors"
	"net/http"
	"net/mail"
	"strings"

	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/routers/base"
)

type mpa map[string]any

func Login(ctx *base.WebContext) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Remember bool   `json:"remember"`
	}

	if err := ctx.DecodeJSON(&req); err != nil {
		base.UnprocessableEntity(ctx, err)
		return
	}

	req.Email = strings.TrimSpace(req.Email)

	_, err := mail.ParseAddress(req.Email)
	if err != nil {
		base.BadRequest(ctx, mpa{
			"email": "Invalid email address",
		})
		return
	}

	bundle, err := auth.Login(ctx.Request.Context(), req.Email, req.Password, req.Remember, ctx.Input.IP(), ctx.Input.UserAgent())
	if err != nil {
		if errors.Is(err, auth.ErrUserNotFound) {
			base.BadRequest(ctx, mpa{
				"email": "User not found with this email",
			})
			return
		}

		if errors.Is(err, auth.ErrInvalidPassword) {
			base.BadRequest(ctx, mpa{
				"password": "Password is incorrect",
			})
			return
		}

		base.InternalError(ctx, err)
		return
	}

	base.RespondCookie(ctx, modelForAuthBundle(bundle), http.StatusOK, &http.Cookie{
		Name:     "session_token",
		Value:    bundle.Session.Token,
		Path:     "/",
		MaxAge:   int(bundle.Session.Age().Seconds()), // less error prone than Expires
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	})
}
