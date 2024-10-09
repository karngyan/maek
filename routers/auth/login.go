package auth

import (
	"errors"
	"net/http"
	"net/mail"
	"strings"

	"github.com/karngyan/maek/domains/auth"

	"github.com/karngyan/maek/routers/base"
)

func Login(ctx *base.WebContext) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := ctx.DecodeJSON(&req); err != nil {
		base.UnprocessableEntity(ctx, err)
		return
	}

	req.Email = strings.TrimSpace(req.Email)

	_, err := mail.ParseAddress(req.Email)
	if err != nil {
		base.BadRequestStr(ctx, "Invalid email", err.Error())
		return
	}

	user, session, err := auth.Login(ctx.Request.Context(), req.Email, req.Password, ctx.Input.IP(), ctx.Input.UserAgent())

	if err != nil {
		if errors.Is(err, auth.ErrInvalidPassword) {
			base.BadRequestStr(ctx, "Invalid password", "Please check your password and try again.")
			return
		}
		base.InternalError(ctx, err)
		return
	}

	base.RespondCookie(ctx, map[string]interface{}{
		"user":     user,
		"accounts": user.Accounts,
	}, http.StatusOK, &http.Cookie{
		Name:     "session_token",
		Value:    session.Token,
		Path:     "/",
		MaxAge:   int(session.Age().Seconds()),
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	})
}
