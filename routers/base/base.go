package base

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/beego/beego/v2/core/logs"
	"github.com/beego/beego/v2/server/web"
	beectx "github.com/beego/beego/v2/server/web/context"
	"github.com/bluele/go-timecop"
	"github.com/google/uuid"
	"github.com/pkg/errors"

	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/libs/randstr"
)

type WebContext struct {
	*beectx.Context
	Session   *auth.Session
	User      *auth.User
	Workspace *auth.Workspace
	l         *logs.BeeLogger
	requestId string
}

func (c *WebContext) Info(msg string, v ...any) {
	prefix := fmt.Sprintf("[request_id=%s] ", c.requestId)
	c.l.Info(prefix+msg, v...)
}

func (c *WebContext) Error(msg string, v ...any) {
	prefix := fmt.Sprintf("[request_id=%s] ", c.requestId)
	c.l.Error(prefix+msg, v...)
}

func (c *WebContext) Warn(msg string, v ...any) {
	prefix := fmt.Sprintf("[request_id=%s] ", c.requestId)
	c.l.Warn(prefix+msg, v...)
}

func (c *WebContext) Debug(msg string, v ...any) {
	prefix := fmt.Sprintf("[request_id=%s] ", c.requestId)
	c.l.Debug(prefix+msg, v...)
}

func (c *WebContext) DecodeJSON(v any) error {
	return json.NewDecoder(c.Request.Body).Decode(v)
}

func JSON(c *WebContext, v any, indent, encoding bool) {
	_ = c.Output.JSON(v, indent, encoding)
}

func Respond(c *WebContext, v any, status int) {
	c.Output.SetStatus(status)
	JSON(c, v, false, false)
}

func RespondCookie(c *WebContext, v any, status int, cookie *http.Cookie) {
	c.Output.SetStatus(status)
	c.Output.Context.ResponseWriter.Header().Add("Set-Cookie", cookie.String())
	JSON(c, v, false, false)
}

func Unauth(c *WebContext) {
	c.Output.SetStatus(http.StatusUnauthorized)
	RespondCookie(c, nil, http.StatusUnauthorized, &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})
}

func UnprocessableEntity(c *WebContext, err error) {
	var resp = map[string]any{
		"error": err.Error(),
	}

	Respond(c, resp, http.StatusUnprocessableEntity)
}

func BadRequest(c *WebContext, v any) {
	Respond(c, v, http.StatusBadRequest)
}

func NotFound(c *WebContext, err error) {
	if err != nil {
		c.Info("not found err: %+v", err)
	}
	Respond(c, nil, http.StatusNotFound)
}

func InternalError(c *WebContext, err error) {
	ref := randstr.Hex(16)
	resp := map[string]any{
		"title":  fmt.Sprintf("Internal error reference #%s", ref),
		"detail": "Please try connecting again. If the issue keeps on happening, contact us.",
		"type":   "alert",
	}

	c.Error("internal error ref: %s err: %+v", ref, errors.WithStack(err))
	Respond(c, resp, http.StatusInternalServerError)
}

type HandleFunc func(c *WebContext)

func WrapPublicRoute(h HandleFunc, l *logs.BeeLogger) web.HandleFunc {
	return Public(h, l)
}

func WrapAuthenticated(h HandleFunc, l *logs.BeeLogger) web.HandleFunc {
	return Authenticated(h, l)
}

func Public(h HandleFunc, l *logs.BeeLogger) web.HandleFunc {
	return func(bctx *beectx.Context) {
		start := timecop.Now()

		rid := uuid.NewString()

		c := &WebContext{
			Context:   bctx,
			l:         l,
			requestId: rid,
		}

		h(c)
		c.Info(fmt.Sprintf("[method=%s] [path=%s] [status=%d] [duration=%s]", c.Request.Method, c.Request.URL.Path, c.ResponseWriter.Status, timecop.Now().Sub(start)))
	}
}

func Authenticated(h HandleFunc, l *logs.BeeLogger) web.HandleFunc {
	return func(bctx *beectx.Context) {
		start := timecop.Now()

		rid := uuid.NewString()

		c := &WebContext{
			Context:   bctx,
			l:         l,
			requestId: rid,
		}

		now := timecop.Now().Unix()

		token := c.GetCookie("session_token")
		rctx := c.Request.Context()
		session, err := auth.FetchSessionByToken(rctx, token)

		if err != nil || session.Expires < now {
			Unauth(c)
			return
		}

		c.Session = session
		c.User = session.User

		// try checking :workspace_id param if present
		workspaceId := bctx.Input.Param(":workspace_id")
		if workspaceId != "" {
			wid, err := strconv.ParseUint(workspaceId, 10, 64)
			if err != nil {
				BadRequest(c, nil)
				return
			}

			// check if the user is part of the workspace
			var found bool
			for _, ws := range c.User.Workspaces {
				if ws.Id == wid {
					found = true
					c.Workspace = ws
					break
				}
			}

			if !found {
				Unauth(c)
				return
			}
		}

		h(c)
		c.Info(fmt.Sprintf("[method=%s] [path=%s] [status=%d] [duration=%s]", c.Request.Method, c.Request.URL.Path, c.ResponseWriter.Status, timecop.Now().Sub(start)))
	}
}
