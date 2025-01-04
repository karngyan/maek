package auth

import (
	"context"
	"errors"

	"github.com/bluele/go-timecop"
	"github.com/jackc/pgx/v5"

	"github.com/karngyan/maek/db"
)

func FetchSessionByToken(ctx context.Context, token string) (*Session, error) {
	var session Session
	if entry, err := sessionCache.Get(token); err == nil {
		if err := session.UnmarshalGOB(entry); err == nil {
			return &session, nil
		}
	}

	now := timecop.Now().Unix()
	ds, err := db.Q.GetNonExpiredSessionByToken(ctx, db.GetNonExpiredSessionByTokenParams{
		Token:   token,
		Expires: now,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrSessionNotFound
		}

		return nil, err
	}

	session = Session{
		ID:      ds.ID,
		UA:      ds.UA,
		IP:      ds.IP,
		UserID:  ds.UserID,
		Token:   ds.Token,
		Expires: ds.Expires,
		Created: ds.Created,
		Updated: ds.Updated,
	}

	sessionBytes, err := session.MarshalGOB()
	if err != nil {
		return nil, err
	}

	if err := sessionCache.Set(token, sessionBytes); err != nil {
		return nil, err
	}

	return &session, nil
}

func FetchUserByEmail(ctx context.Context, email string) (*User, error) {
	du, err := db.Q.GetUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}

		return nil, err
	}

	return UserFromDBUser(&du), nil
}

func FetchUserByID(ctx context.Context, id int64) (*User, error) {
	du, err := db.Q.GetUserByID(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}

		return nil, err
	}

	return UserFromDBUser(&du), nil
}

func FetchWorkspaceByID(ctx context.Context, id int64) (*Workspace, error) {
	dw, err := db.Q.GetWorkspaceByID(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrWorkspaceNotFound
		}

		return nil, err
	}

	return WorkspaceFromDB(&dw), nil
}

// FetchWorkspacesForUser fetches all workspaces for a user
// if no workspaces are found, it returns an empty slice
// if an error occurs with db query, it returns the error
func FetchWorkspacesForUser(ctx context.Context, userID int64) ([]*Workspace, error) {
	dws, err := db.Q.GetWorkspacesForUser(ctx, userID)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
	}

	wss := make([]*Workspace, 0, len(dws))
	for _, dw := range dws {
		wss = append(wss, &Workspace{
			ID:          dw.ID,
			Name:        dw.Name,
			Description: dw.Description,
			Created:     dw.Created,
			Updated:     dw.Updated,
		})
	}

	return wss, nil
}

func FindUsersByIDs(ctx context.Context, ids []int64) ([]*User, error) {
	dbUsers, err := db.Q.GetUsersByIDs(ctx, ids)
	if err != nil {
		return nil, err
	}

	users := make([]*User, 0, len(dbUsers))
	for _, dbUser := range dbUsers {
		users = append(users, UserFromDBUser(&dbUser))
	}

	return users, nil
}
