package auth

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/karngyan/maek/libs/randstr"

	"github.com/beego/beego/v2/client/orm"
	"github.com/bluele/go-timecop"
	"github.com/karngyan/maek/db"
)

var ErrUserAlreadyExists = errors.New("user already exists")

func CreateDefaultWorkspaceWithUser(ctx context.Context, name, email, passwd, ip, ua string) (*User, *Session, error) {
	now := timecop.Now().Unix()

	workspace := &Workspace{
		Name:        "default",
		Description: "default workspace",
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
		Expires: timecop.Now().Add(30 * 24 * time.Hour).Unix(),
		Created: now,
		Updated: now,
	}

	err = db.WithTxOrmerCtx(ctx, func(ctx context.Context, txOrmer orm.TxOrmer) error {
		var u User
		err := txOrmer.QueryTable("user").Filter("email", email).One(&u, "id")
		if err == nil {
			return ErrUserAlreadyExists
		}

		if _, err = txOrmer.Insert(workspace); err != nil {
			return err
		}

		user.DefaultWorkspaceId = workspace.Id
		if _, err = txOrmer.Insert(user); err != nil {
			return err
		}

		// Add the workspace to the user
		m2m := txOrmer.QueryM2M(user, "workspaces")
		if _, err := m2m.AddWithCtx(ctx, workspace); err != nil {
			return err
		}

		user.Workspaces = []*Workspace{workspace}

		session.User = user
		session.Token = GenerateToken(user)
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

func GenerateToken(user *User) string {
	return fmt.Sprintf("%d:%d:%d:%s", user.DefaultWorkspaceId, user.Id, timecop.Now().Unix(), randstr.Base62(16))
}
