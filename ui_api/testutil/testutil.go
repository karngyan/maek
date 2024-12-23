package testutil

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/bluele/go-timecop"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"go.uber.org/fx"
	"go.uber.org/fx/fxevent"
	"go.uber.org/zap"

	"github.com/karngyan/maek/config"
	"github.com/karngyan/maek/db"
	"github.com/karngyan/maek/domains"
	"github.com/karngyan/maek/domains/auth"
	"github.com/karngyan/maek/libs/logger"
	"github.com/karngyan/maek/ui_api"
)

var frozenTime = time.Unix(1234567890, 0)

type TestApp struct {
	Stop func() error
}

func StartTestApp() (*TestApp, error) {
	ta := &TestApp{}

	fxApp := fx.New(
		fx.Provide(
			config.New,
			logger.NewNop,
		),
		fx.Invoke(
			db.InitTest,
			domains.Init,
		),
		fx.WithLogger(func(l *zap.Logger) fxevent.Logger {
			return &fxevent.ZapLogger{Logger: l}
		}),
	)

	if err := fxApp.Start(context.Background()); err != nil {
		return nil, err
	}

	ta.Stop = func() error {
		ctx, cancel := context.WithTimeout(context.Background(), fx.DefaultTimeout)
		defer cancel()
		return fxApp.Stop(ctx)
	}

	return ta, nil
}

func FreezeTime() {
	timecop.Freeze(frozenTime)
}

func TruncateTables() {
	err := db.Q.TruncateAllTables(context.Background())
	if err != nil {
		zap.L().Error("error truncate tables", zap.Error(err))
	}
}

type ClientState struct {
	e *echo.Echo

	User      *auth.User
	Session   *auth.Session
	Workspace *auth.Workspace
}

func NewClientState() *ClientState {
	e := echo.New()
	l := logger.NewNop()

	ui_api.ConfigureRoutes(e, l)

	return &ClientState{e: e}
}

func NewClientStateWithUser(t *testing.T) *ClientState {
	return NewClientStateWithUserEmail(t, "karn@maek.ai")
}

func NewClientStateWithUserEmail(t *testing.T, email string) *ClientState {
	c := NewClientState()

	bundle, err := auth.CreateDefaultWorkspaceWithUser(context.Background(), "Karn", email, "test-password", "1.2.3.4", "Mozilla/5.0")
	assert.Nil(t, err)
	assert.NotNil(t, bundle.User)
	assert.NotNil(t, bundle.Session)
	assert.NotNil(t, bundle.Workspaces)

	c.User = bundle.User
	c.Session = bundle.Session
	c.Workspace = bundle.Workspaces[0]

	return c
}

func (c *ClientState) Post(path string, body any) (*httptest.ResponseRecorder, error) {
	return c.request(http.MethodPost, path, body)
}

func (c *ClientState) Get(path string) (*httptest.ResponseRecorder, error) {
	return c.request(http.MethodGet, path, nil)
}

func (c *ClientState) Put(path string, body any) (*httptest.ResponseRecorder, error) {
	return c.request(http.MethodPut, path, body)
}

func (c *ClientState) Delete(path string) (*httptest.ResponseRecorder, error) {
	return c.request(http.MethodDelete, path, nil)
}

func (c *ClientState) Patch(path string, body any) (*httptest.ResponseRecorder, error) {
	return c.request(http.MethodPatch, path, body)
}

func (c *ClientState) request(method string, path string, body any) (*httptest.ResponseRecorder, error) {
	buf := bytes.NewBuffer([]byte{})
	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		buf.Write(b)
	}

	req, err := http.NewRequest(method, path, buf)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	if c.Session != nil {
		req.AddCookie(&http.Cookie{
			Name:     "session_token",
			Value:    c.Session.Token,
			Path:     "/",
			MaxAge:   int(c.Session.Age().Seconds()),
			Secure:   true,
			HttpOnly: true,
			SameSite: http.SameSiteStrictMode,
		})
	}

	rr := httptest.NewRecorder()

	c.e.ServeHTTP(rr, req)

	return rr, nil
}
