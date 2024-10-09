package auth

import (
	"net/http"
	"net/mail"
	"strings"

	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/routers/base"
)

const (
	minPasswordLength = 6
	maxPasswordLength = 64
	maxNameLength     = 200
)

func Register(ctx *base.WebContext) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Name     string `json:"name"`
	}

	if err := ctx.DecodeJSON(&req); err != nil {
		base.UnprocessableEntity(ctx, err)
		return
	}

	req.Email = strings.TrimSpace(req.Email)
	req.Password = strings.TrimSpace(req.Password)
	req.Name = strings.TrimSpace(req.Name)

	_, err := mail.ParseAddress(req.Email)
	if err != nil {
		base.BadRequestStr(ctx, "Invalid email", err.Error())
		return
	}

	if len(req.Password) < minPasswordLength {
		base.BadRequestStr(ctx, "Invalid password", "Password must be at least 6 characters long")
		return
	}

	if len(req.Password) > maxPasswordLength {
		base.BadRequestStr(ctx, "Invalid password", "Password must be at most 64 characters long")
		return
	}

	if len(req.Name) > maxNameLength {
		base.BadRequestStr(ctx, "Invalid name", "Name must be at most 200 characters long")
		return
	}

	rctx := ctx.Request.Context()

	user, session, err := auth.CreateDefaultAccountWithUser(rctx, req.Name, req.Email, req.Password, ctx.Input.IP(), ctx.Input.UserAgent())

	if err != nil {
		base.InternalError(ctx, err)
		return
	}

	base.RespondCookie(ctx, map[string]any{
		"user":     user,
		"accounts": user.Accounts,
	}, http.StatusCreated, &http.Cookie{
		Name:     "session_token",
		Value:    session.Token,
		Path:     "/",
		MaxAge:   int(session.Age().Seconds()), // less error prone than Expires
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	})
}
