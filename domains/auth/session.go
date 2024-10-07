package auth

import (
	"time"

	"github.com/bluele/go-timecop"
)

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
