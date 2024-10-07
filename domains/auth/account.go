package auth

import (
	"context"
	"time"

	"github.com/beego/beego/v2/client/orm"
	"github.com/bluele/go-timecop"
	"golang.org/x/crypto/bcrypt"

	"github.com/karngyan/maek/db"
	"github.com/karngyan/maek/libs/randstr"
)

type Account struct {
	Id          uint64 `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description" orm:"type(text)"`
	Created     int64  `json:"created"`
	Updated     int64  `json:"updated"`
}

func (u *Account) TableEngine() string {
	return "InnoDB"
}

func CreateDefaultAccountWithUser(ctx context.Context, name, email, passwd, ip, ua string) (*User, *Session, error) {
	now := timecop.Now().Unix()

	hp, err := hashPassword(passwd)
	if err != nil {
		return nil, nil, err
	}

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
		Password: hp,
		Created:  now,
		Updated:  now,
	}

	session := &Session{
		Ua:      ua,
		Ip:      ip,
		Token:   randstr.Base62(32),
		Expires: timecop.Now().Add(30 * 24 * time.Hour).Unix(),
	}

	err = db.WithTxOrmerCtx(ctx, func(ctx context.Context, txOrmer orm.TxOrmer) error {
		if _, err := txOrmer.Insert(acc); err != nil {
			return err
		}

		user.Accounts = []*Account{acc}
		if _, err := txOrmer.Insert(user); err != nil {
			return err
		}

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

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}
