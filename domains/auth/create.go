package auth

import (
	"context"
	"time"

	"github.com/beego/beego/v2/client/orm"
	"github.com/bluele/go-timecop"
	"github.com/karngyan/maek/db"
	"github.com/karngyan/maek/libs/randstr"
)

func CreateDefaultAccountWithUser(ctx context.Context, name, email, passwd, ip, ua string) (*User, *Session, error) {
	now := timecop.Now().Unix()

	acc := &Account{
		Name:        "Default",
		Description: "Default account",
		Created:     now,
		Updated:     now,
	}

	user := &User{
		Name:     name,
		Email:    email,
		Verified: false,
		Role:     RoleAdmin,
		Password: passwd,
		Created:  now,
		Updated:  now,
	}

	err := user.hashPassword()
	if err != nil {
		return nil, nil, err
	}

	session := &Session{
		Ua:      ua,
		Ip:      ip,
		Token:   randstr.Base62(32),
		Expires: timecop.Now().Add(30 * 24 * time.Hour).Unix(),
		Created: now,
		Updated: now,
	}

	err = db.WithTxOrmerCtx(ctx, func(ctx context.Context, txOrmer orm.TxOrmer) error {
		if _, err := txOrmer.Insert(user); err != nil {
			return err
		}

		if _, err := txOrmer.Insert(acc); err != nil {
			return err
		}

		// Add the account to the user
		m2m := txOrmer.QueryM2M(user, "accounts")
		if _, err := m2m.AddWithCtx(ctx, acc); err != nil {
			return err
		}

		user.Accounts = []*Account{acc}

		session.User = user
		if _, err := txOrmer.Insert(session); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, nil, err
	}

	return user, session, nil
}
