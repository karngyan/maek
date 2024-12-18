package auth

import (
	"context"
	"errors"
	"time"

	"github.com/beego/beego/v2/client/orm"
	"github.com/bluele/go-timecop"
	"github.com/karngyan/maek/db"
)

var ErrSessionNotFound = errors.New("session not found")

type Session struct {
	Id      uint64 `json:"id"`
	Ua      string `json:"ua"`
	Ip      string `json:"ip"`
	User    *User  `json:"user" orm:"rel(fk)"`
	Token   string `json:"token"`
	Expires int64  `json:"expires"`
	Created int64  `json:"created"`
	Updated int64  `json:"updated"`
}

func (s *Session) ExpiresTime() time.Time {
	return time.Unix(s.Expires, 0)
}

func (s *Session) Age() time.Duration {
	return time.Unix(s.Expires, 0).Sub(timecop.Now())
}

func (s *Session) Delete(ctx context.Context) error {
	return db.WithOrmerCtx(ctx, func(ctx context.Context, ormer orm.Ormer) error {
		err := sessionCache.Delete(ctx, s.Token)
		if err != nil {
			return err
		}

		_, err = ormer.DeleteWithCtx(ctx, s)
		return err
	})
}
