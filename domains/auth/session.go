package auth

import (
	"errors"
	"time"

	"github.com/bluele/go-timecop"
)

var ErrSessionNotFound = errors.New("session not found")

type Session struct {
	ID      int64
	UA      string
	IP      string
	UserID  int64
	Token   string
	Expires int64
	Created int64
	Updated int64
}

func (s *Session) ExpiresTime() time.Time {
	return time.Unix(s.Expires, 0)
}

func (s *Session) Age() time.Duration {
	return time.Unix(s.Expires, 0).Sub(timecop.Now())
}
