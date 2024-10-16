package tests

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"

	"github.com/karngyan/maek/domains/auth"

	"github.com/bluele/go-timecop"

	"github.com/beego/beego/v2/client/orm"

	"github.com/beego/beego/v2/core/logs"
	"github.com/beego/beego/v2/server/web"
	"github.com/karngyan/maek/conf"
	"github.com/karngyan/maek/db"
	"github.com/karngyan/maek/domains"
	"github.com/karngyan/maek/routers"
)

var frozenTime = time.Unix(1234567890, 0)
var initOnce sync.Once

type CleanupFn func()

func InitApp() (CleanupFn, error) {
	var cleanupDB CleanupFn

	initFn := func() error {
		log := logs.NewLogger()
		defer log.Flush()

		cwd, err := os.Getwd()
		if err != nil {
			return err
		}

		root := os.Getenv("ROOT")
		web.TestBeegoInit(root)

		// beego changes dir internally after TestBeegoInit
		// we'd like it back for approvals to work
		err = os.Chdir(cwd)
		if err != nil {
			return err
		}

		if err := routers.Init(log); err != nil {
			return err
		}

		if err := conf.Init(); err != nil {
			return err
		}

		cleanupDB, err = db.InitTest()
		if err != nil {
			panic(err)
		}

		if err := domains.InitTest(); err != nil {
			return err
		}

		return nil
	}

	var initErr error

	initOnce.Do(func() {
		initErr = initFn()
	})

	return func() {
		cleanupDB()
	}, initErr
}

func FreezeTime() {
	timecop.Freeze(frozenTime)
}

func CleanDBRows() {
	// force would drop the tables and recreate them
	_ = orm.RunSyncdb("default", true, false)
}

type ClientState struct {
	User      *auth.User
	Session   *auth.Session
	Workspace *auth.Workspace
}

func NewClientState() *ClientState {
	return &ClientState{}
}

func NewClientStateWithUser(t *testing.T) *ClientState {
	return NewClientStateWithUserEmail(t, "karn@maek.ai")
}

func NewClientStateWithUserEmail(t *testing.T, email string) *ClientState {
	c := NewClientState()

	user, session, err := auth.CreateDefaultWorkspaceWithUser(context.Background(), "Karn", email, "test-password", "1.2.3.4", "Mozilla/5.0")
	assert.Nil(t, err)
	assert.NotNil(t, user)
	assert.NotNil(t, session)

	c.User = user
	c.Session = session
	c.Workspace = user.Workspaces[0]

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

	web.BeeApp.Handlers.ServeHTTP(rr, req)

	return rr, nil
}
