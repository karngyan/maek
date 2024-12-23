package web

import (
	"fmt"
	"net/http"

	"github.com/karngyan/maek/libs/randstr"

	"github.com/labstack/echo/v4"
	"go.uber.org/zap"

	"github.com/karngyan/maek/domains/auth"
)

type Context struct {
	echo.Context

	L             *zap.Logger
	Session       *auth.Session
	WorkspaceID   int64
	User          *auth.User
	Workspace     *auth.Workspace
	AllWorkspaces []*auth.Workspace
}

func (c Context) InternalError(err error) error {
	ref := fmt.Sprintf("#%s", randstr.Hex(16))
	resp := map[string]any{
		"title":  fmt.Sprintf("Internal error reference: %s", ref),
		"detail": "Please try connecting again. If the issue keeps on happening, contact us with the reference number.",
		"type":   "alert",
	}

	c.L.Error("internal error", zap.String("ref", ref), zap.Error(err))
	return c.JSON(http.StatusInternalServerError, resp)
}

type HandlerFunc func(ctx Context) error

func WrapPublicRoute(h HandlerFunc, l *zap.Logger) echo.HandlerFunc {
	return public(h, l)
}

func public(h HandlerFunc, l *zap.Logger) echo.HandlerFunc {
	return func(c echo.Context) error {
		rid := c.Response().Header().Get(echo.HeaderXRequestID)

		ctx := Context{
			Context: c,
			L:       l.With(zap.String("request_id", rid)),
		}

		return h(ctx)
	}
}
