package auth

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"

	"github.com/beego/beego/v2/client/cache"
	"github.com/bluele/go-timecop"
	"github.com/karngyan/maek/db"
)

var (
	sessionCache = cache.NewMemoryCache()
)

func InitCache() error {
	var err error

	// read through cache for session
	if sessionCache, err = cache.NewReadThroughCache(sessionCache, 10*time.Minute, func(ctx context.Context, token string) (any, error) {
		now := timecop.Now().Unix()

		ds, err := db.Q.GetNonExpiredSessionByToken(ctx, db.GetNonExpiredSessionByTokenParams{
			Token:   token,
			Expires: now,
		})
		if err != nil {
			return nil, err
		}

		return &Session{
			ID:      ds.ID,
			UA:      ds.UA,
			IP:      ds.IP,
			UserID:  ds.UserID,
			Token:   ds.Token,
			Expires: ds.Expires,
			Created: ds.Created,
			Updated: ds.Updated,
		}, err
	}); err != nil {
		return err
	}

	return nil
}

func FetchSessionByToken(ctx context.Context, token string) (*Session, error) {
	if session, err := sessionCache.Get(ctx, token); err == nil {
		return session.(*Session), nil
	}

	// cache is read through so if Get failed session doesn't exist in db
	return nil, ErrSessionNotFound
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
