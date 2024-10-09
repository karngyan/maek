package auth

import (
	"context"
	"errors"
	"time"

	"github.com/beego/beego/v2/client/orm"
	"github.com/karngyan/maek/db"

	"github.com/bluele/go-timecop"
	"github.com/karngyan/maek/libs/randstr"
)

var ErrInvalidPassword = errors.New("invalid password")

func Login(ctx context.Context, email, password, ip, ua string) (*User, *Session, error) {
	user, err := FetchUserByEmail(ctx, email)
	if err != nil {
		return nil, nil, err
	}

	if !user.verifyPassword(password) {
		return nil, nil, ErrInvalidPassword
	}

	now := timecop.Now()

	session := &Session{
		Ua:      ua,
		Ip:      ip,
		User:    user,
		Token:   randstr.Base62(32),
		Expires: now.Add(30 * 24 * time.Hour).Unix(),
		Created: now.Unix(),
		Updated: now.Unix(),
	}

	err = db.WithOrmerCtx(ctx, func(ctx context.Context, ormer orm.Ormer) error {
		if _, err := ormer.Insert(session); err != nil {
			return err
		}
		return nil
	})

	return user, session, nil
}
