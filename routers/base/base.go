package base

import (
	"encoding/json"
	"fmt"
	"net/http"

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
	User *auth.User

	l         *logs.BeeLogger
	requestId string
}

func (c *WebContext) Info(msg string, v ...any) {
	prefix := fmt.Sprintf("[request_id=%s]", c.requestId)
	c.l.Info(prefix+msg, v...)
}

func (c *WebContext) Error(msg string, v ...any) {
	prefix := fmt.Sprintf("[request_id=%s]", c.requestId)
	c.l.Error(prefix+msg, v...)
}

func (c *WebContext) Warn(msg string, v ...any) {
	prefix := fmt.Sprintf("[request_id=%s]", c.requestId)
	c.l.Warn(prefix+msg, v...)
}

func (c *WebContext) Debug(msg string, v ...any) {
	prefix := fmt.Sprintf("[request_id=%s]", c.requestId)
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
	v := Response{Error: &ResponseError{
		Title:  "Logged out?",
		Detail: "Please sign in to continue.",
		Type:   ResponseErrorInfo,
	}}
	c.Output.SetStatus(http.StatusUnauthorized)
	JSON(c, v, false, false)
}

func UnauthWithError(c *WebContext, err error) {
	v := Response{Error: &ResponseError{Title: "Logged out?", Detail: "Please sign in to continue."}}
	c.Output.SetStatus(http.StatusUnauthorized)
	JSON(c, v, false, false)
}

func UnprocessableEntity(c *WebContext, err error) {
	var resp = Response{
		Error: &ResponseError{Title: "Unprocessable request", Detail: err.Error()},
	}

	Respond(c, resp, http.StatusUnprocessableEntity)
}

func BadRequest(c *WebContext, err *ResponseError) {
	var resp = Response{
		Error: err,
	}

	Respond(c, resp, http.StatusBadRequest)
}

func BadRequestStr(c *WebContext, title, detail string) {
	BadRequest(c, &ResponseError{Title: title, Detail: detail, Type: ResponseErrorWarning})
}

func InternalError(c *WebContext, err error) {
	ref := randstr.Hex(8)
	e := &ResponseError{
		Title:  fmt.Sprintf("Internal error reference #%s", ref),
		Detail: "Please try connecting again. If the issue keeps on happening, contact us.",
	}
	var resp = Response{
		Error: e,
	}

	c.Error("internal error ref: %s err: %+v", ref, errors.WithStack(err))
	Respond(c, resp, http.StatusInternalServerError)
}

type HandleFunc func(c *WebContext)

func WrapPublicRoute(h HandleFunc, l *logs.BeeLogger) web.HandleFunc {
	return Public(h, l)
}

func WrapAuthenticated(h HandleFunc, l *logs.BeeLogger) web.HandleFunc {
	return Authenticated(h, l, false)
}

func WrapAuthenticatedWithUser(h HandleFunc, l *logs.BeeLogger) web.HandleFunc {
	return Authenticated(h, l, true)
}

func Public(h HandleFunc, l *logs.BeeLogger) web.HandleFunc {
	return func(bctx *beectx.Context) {
		rid := uuid.NewString()

		c := &WebContext{
			Context:   bctx,
			l:         l,
			requestId: rid,
		}

		h(c)
	}
}

func Authenticated(h HandleFunc, l *logs.BeeLogger, withUser bool) web.HandleFunc {
	return func(bctx *beectx.Context) {
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

		if withUser {
			user, err := auth.FetchUserById(rctx, session.User.Id)
			if err != nil {
				UnauthWithError(c, err)
				return
			}

			c.User = &user
		}

		h(c)
	}
}
