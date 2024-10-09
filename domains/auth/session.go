package auth

import (
	"context"
	"errors"
	"time"

	"github.com/bluele/go-timecop"
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

func (s *Session) TableEngine() string {
	return "InnoDB"
}

func (s *Session) ExpiresTime() time.Time {
	return time.Unix(s.Expires, 0)
}

func (s *Session) Age() time.Duration {
	return time.Unix(s.Expires, 0).Sub(timecop.Now())
}

func FetchSessionByToken(ctx context.Context, token string) (Session, error) {
	if session, err := sessionCache.Get(ctx, token); err == nil {
		return session.(Session), nil
	}

	// cache is read through so if Get failed session doesn't exist in db
	return Session{}, ErrSessionNotFound
}
