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

type mpa map[string]any

func login(ctx web.Context) error {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Remember bool   `json:"remember"`
	}

	if err := ctx.Bind(&req); err != nil {
		return ctx.JSON(http.StatusUnprocessableEntity, mpa{
			"error": err.Error(),
		})
	}

	req.Email = strings.TrimSpace(req.Email)

	_, err := mail.ParseAddress(req.Email)
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, mpa{
			"email": "Invalid email address",
		})
	}

	bundle, err := auth.Login(ctx.Request().Context(), req.Email, req.Password, req.Remember, ctx.RealIP(), ctx.Request().Header.Get("User-Agent"))
	if err != nil {
		if errors.Is(err, auth.ErrUserNotFound) {
			return ctx.JSON(http.StatusBadRequest, mpa{
				"email": "User not found with this email",
			})
		}

		if errors.Is(err, auth.ErrInvalidPassword) {
			return ctx.JSON(http.StatusBadRequest, mpa{
				"password": "Password is incorrect",
			})
		}

		return ctx.InternalError(err)
	}

	cookie := &http.Cookie{
		Name:     "session_token",
		Value:    bundle.Session.Token,
		Path:     "/",
		MaxAge:   int(bundle.Session.Age().Seconds()), // less error-prone than Expires
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	}
	ctx.SetCookie(cookie)

	return ctx.JSON(http.StatusOK, models.ModelForAuthBundle(bundle))
}
