package auth

import (
	"errors"
	"net/http"
	"net/mail"
	"strings"

	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/ui_api/models"
	"github.com/karngyan/maek/ui_api/web"
)

const (
	minPasswordLength = 6
	maxPasswordLength = 64
	maxNameLength     = 200
)

func register(ctx web.Context) error {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Name     string `json:"name"`
	}

	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusUnprocessableEntity, mpa{
			"error": err.Error(),
		})
	}

	req.Email = strings.TrimSpace(req.Email)
	req.Password = strings.TrimSpace(req.Password)
	req.Name = strings.TrimSpace(req.Name)

	_, err := mail.ParseAddress(req.Email)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, mpa{
			"email": "Invalid email address",
		})
	}

	if len(req.Password) < minPasswordLength {
		return ctx.JSON(http.StatusBadRequest, mpa{
			"password": "Must be at least 6 characters long",
		})
	}

	if len(req.Password) > maxPasswordLength {
		return ctx.JSON(http.StatusBadRequest, mpa{
			"password": "Must be at most 64 characters long",
		})
	}

	if len(req.Name) > maxNameLength {
		return ctx.JSON(http.StatusBadRequest, mpa{
			"name": "Must be at most 200 characters long",
		})
	}

	rctx := ctx.Request().Context()

	bundle, err := auth.CreateDefaultWorkspaceWithUser(rctx, req.Name, req.Email, req.Password, ctx.RealIP(), ctx.Request().Header.Get("User-Agent"))

	if err != nil {
		if errors.Is(err, auth.ErrUserAlreadyExists) {
			return ctx.JSON(http.StatusBadRequest, mpa{
				"email": "User already exists with this email",
			})
		}

		return ctx.InternalError(err)
	}

	ctx.SetCookie(&http.Cookie{
		Name:     "session_token",
		Value:    bundle.Session.Token,
		Path:     "/",
		MaxAge:   int(bundle.Session.Age().Seconds()), // less error prone than Expires
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	})

	return ctx.JSON(http.StatusCreated, models.ModelForAuthBundle(bundle))
}
