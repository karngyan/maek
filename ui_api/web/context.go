package web

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/bluele/go-timecop"

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

func (c Context) Unauthorized() error {
	c.SetCookie(&http.Cookie{
		Name:     "session_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})

	return c.JSON(http.StatusUnauthorized, map[string]any{
		"error": "Unauthorized",
	})
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

func WrapAuthenticated(h HandlerFunc, l *zap.Logger) echo.HandlerFunc {
	return authenticated(h, l, false, false, false)
}

func WrapAuthenticatedWithUser(h HandlerFunc, l *zap.Logger) echo.HandlerFunc {
	return authenticated(h, l, true, false, false)
}

func WrapAuthenticatedWithCurrentWorkspace(h HandlerFunc, l *zap.Logger) echo.HandlerFunc {
	return authenticated(h, l, false, true, false)
}

func WrapAuthenticatedWithUserAllWorkspaces(h HandlerFunc, l *zap.Logger) echo.HandlerFunc {
	return authenticated(h, l, true, false, true)
}

func authenticated(h HandlerFunc, l *zap.Logger, withUser, withCurrentWorkspace, withAllWorkspaces bool) echo.HandlerFunc {
	return func(c echo.Context) error {
		rid := c.Response().Header().Get(echo.HeaderXRequestID)

		ctx := Context{
			Context: c,
			L:       l.With(zap.String("request_id", rid)),
		}

		now := timecop.Now().Unix()

		tkCookie, err := c.Request().Cookie("session_token")
		if err != nil && errors.Is(err, http.ErrNoCookie) {
			return ctx.Unauthorized()
		}

		rctx := c.Request().Context()
		session, err := auth.FetchSessionByToken(rctx, tkCookie.Value)

		if err != nil || session.Expires < now {
			return ctx.Unauthorized()
		}

		ctx.Session = session

		if withUser {
			ctx.User, err = auth.FetchUserByID(rctx, session.UserID)
			if err != nil {
				if errors.Is(err, auth.ErrUserNotFound) {
					return ctx.Unauthorized()
				}

				return ctx.InternalError(err)
			}
		}

		if withAllWorkspaces {
			ctx.AllWorkspaces, err = auth.FetchWorkspacesForUser(rctx, ctx.Session.UserID)
			if err != nil {
				return ctx.InternalError(err)
			}
		}

		var wid int64
		echo.PathParamsBinder(c).Int64("workspace_id", &wid)
		if wid > 0 {
			ctx.WorkspaceID = wid

			if withAllWorkspaces {
				ctx.AllWorkspaces, err = auth.FetchWorkspacesForUser(rctx, ctx.Session.UserID)
				if err != nil {
					return ctx.InternalError(err)
				}
			}

			// make sure user id part of the ws
			var found bool
			for _, ws := range ctx.AllWorkspaces {
				if ws.ID == wid {
					found = true
					ctx.Workspace = ws
					break
				}
			}

			if withCurrentWorkspace && ctx.Workspace == nil {
				ctx.Workspace, err = auth.FetchWorkspaceByID(rctx, wid)
				if err != nil {
					if errors.Is(err, auth.ErrWorkspaceNotFound) {
						return ctx.JSON(http.StatusNotFound, map[string]any{
							"error": "Workspace not found",
						})
					}

					return ctx.InternalError(err)
				}
			}

			if !found {
				return ctx.Unauthorized()
			}
		}

		return h(ctx)
	}
}
