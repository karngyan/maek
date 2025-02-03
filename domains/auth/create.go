package auth

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/bluele/go-timecop"

	"github.com/karngyan/maek/db"
	"github.com/karngyan/maek/libs/randstr"
)

var ErrUserAlreadyExists = errors.New("user already exists")

func CreateDefaultWorkspaceWithUser(ctx context.Context, name, email, passwd, ip, ua string) (*Bundle, error) {
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
		return nil, err
	}

	session := &Session{
		UA:      ua,
		IP:      ip,
		Expires: timecop.Now().Add(30 * 24 * time.Hour).Unix(),
		Created: now,
		Updated: now,
	}

	err = db.Tx(ctx, func(ctx context.Context, q *db.Queries) error {
		_, err := q.GetUserByEmail(ctx, email)
		if err == nil {
			return ErrUserAlreadyExists
		}

		wid, err := q.InsertWorkspace(ctx, db.InsertWorkspaceParams{
			Name:        workspace.Name,
			Description: workspace.Description,
			Created:     workspace.Created,
			Updated:     workspace.Updated,
		})
		if err != nil {
			return err
		}

		workspace.ID = wid
		user.DefaultWorkspaceID = wid

		uid, err := q.InsertUser(ctx, db.InsertUserParams{
			DefaultWorkspaceID: user.DefaultWorkspaceID,
			Name:               user.Name,
			Email:              user.Email,
			Role:               string(user.Role),
			Password:           user.Password,
			Verified:           user.Verified,
			Created:            user.Created,
			Updated:            user.Updated,
		})
		if err != nil {
			return err
		}
		user.ID = uid

		// insert user workspace
		_, err = q.InsertUserWorkspace(ctx, db.InsertUserWorkspaceParams{
			UserID:      user.ID,
			WorkspaceID: workspace.ID,
		})
		if err != nil {
			return err
		}

		session.UserID = user.ID
		session.Token = GenerateToken(user)

		sid, err := q.InsertSession(ctx, db.InsertSessionParams{
			UA:      session.UA,
			IP:      session.IP,
			UserID:  session.UserID,
			Token:   session.Token,
			Expires: session.Expires,
			Created: session.Created,
			Updated: session.Updated,
		})
		if err != nil {
			return err
		}

		session.ID = sid
		return nil
	})

	if err != nil {
		return nil, err
	}

	return &Bundle{
		User:       user,
		Session:    session,
		Workspaces: []*Workspace{workspace},
	}, nil
}

func GenerateToken(user *User) string {
	return fmt.Sprintf("%d:%d:%d:%s", user.DefaultWorkspaceID, user.ID, timecop.Now().Unix(), randstr.Base62(16))
}

func AddNewWorkspace(ctx context.Context, uid int64, name, description string) (*Workspace, error) {
	now := timecop.Now().Unix()

	name = strings.TrimSpace(name)
	description = strings.TrimSpace(description)

	workspace := &Workspace{
		Name:        name,
		Description: description,
		Created:     now,
		Updated:     now,
	}

	err := db.Tx(ctx, func(ctx context.Context, q *db.Queries) error {
		wid, err := q.InsertWorkspace(ctx, db.InsertWorkspaceParams{
			Name:        workspace.Name,
			Description: workspace.Description,
			Created:     workspace.Created,
			Updated:     workspace.Updated,
		})
		if err != nil {
			return err
		}

		workspace.ID = wid
		_, err = q.InsertUserWorkspace(ctx, db.InsertUserWorkspaceParams{
			UserID:      uid,
			WorkspaceID: wid,
		})
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return workspace, nil
}
