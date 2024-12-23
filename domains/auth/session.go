package auth

import (
	"bytes"
	"encoding/gob"
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

func (s *Session) MarshalGOB() ([]byte, error) {
	var buf bytes.Buffer
	err := gob.NewEncoder(&buf).Encode(s)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

func (s *Session) UnmarshalGOB(data []byte) error {
	return gob.NewDecoder(bytes.NewReader(data)).Decode(s)
}
