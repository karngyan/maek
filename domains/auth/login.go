package auth

import (
	"context"
	"errors"
	"time"

	"github.com/karngyan/maek/db"

	"github.com/bluele/go-timecop"
)

var ErrInvalidPassword = errors.New("invalid password")

func Login(ctx context.Context, email, password string, remember bool, ip, ua string) (*Bundle, error) {
	user, err := FetchUserByEmail(ctx, email)
	if err != nil {
		return nil, err
	}

	if !user.verifyPassword(password) {
		return nil, ErrInvalidPassword
	}

	workspaces, err := FetchWorkspacesForUser(ctx, user.ID)
	if err != nil {
		return nil, err
	}

	now := timecop.Now()
	expires := now.Add(30 * 24 * time.Hour)

	if remember {
		expires = now.Add(365 * 24 * time.Hour)
	}

	session := &Session{
		UA:      ua,
		IP:      ip,
		UserID:  user.ID,
		Token:   GenerateToken(user),
		Expires: expires.Unix(),
		Created: now.Unix(),
		Updated: now.Unix(),
	}

	session.ID, err = db.Q.InsertSession(ctx, db.InsertSessionParams{
		UA:      session.UA,
		IP:      session.IP,
		UserID:  session.UserID,
		Token:   session.Token,
		Expires: session.Expires,
		Created: session.Created,
		Updated: session.Updated,
	})
	if err != nil {
		return nil, err
	}

	return &Bundle{
		User:       user,
		Session:    session,
		Workspaces: workspaces,
	}, nil
}
