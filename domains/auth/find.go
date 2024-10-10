package auth

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/beego/beego/v2/client/cache"
	"github.com/beego/beego/v2/client/orm"
	"github.com/bluele/go-timecop"
	"github.com/karngyan/maek/db"
)

var (
	userCache    = cache.NewMemoryCache()
	sessionCache = cache.NewMemoryCache()
)

func InitCache() error {
	var err error

	// read through cache for session
	if sessionCache, err = cache.NewReadThroughCache(sessionCache, 5*time.Minute, func(ctx context.Context, token string) (any, error) {
		var session Session
		if err := db.WithOrmerCtx(ctx, func(ctx context.Context, ormer orm.Ormer) error {
			now := timecop.Now().Unix()
			err := ormer.QueryTable("session").Filter("token", token).Filter("expires__gt", now).One(&session)
			if err != nil {
				return err
			}

			return nil
		}); err != nil {
			return nil, err
		}

		return &session, nil
	}); err != nil {
		return err
	}

	// read through cache for user
	if userCache, err = cache.NewReadThroughCache(userCache, 5*time.Minute, func(ctx context.Context, id string) (any, error) {
		var user User
		if err := db.WithOrmerCtx(ctx, func(ctx context.Context, ormer orm.Ormer) error {
			err := ormer.QueryTable("user").Filter("id", id).One(&user)
			if err != nil {
				return err
			}

			return nil
		}); err != nil {
			return nil, err
		}

		return &user, nil
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

func FetchUserById(ctx context.Context, id uint64) (*User, error) {
	key := fmt.Sprintf("%d", id)
	if user, err := userCache.Get(ctx, key); err == nil {
		return user.(*User), nil
	}

	// cache is read through so if Get failed user doesn't exist in db
	return nil, ErrUserNotFound
}

func FetchUserByEmail(ctx context.Context, email string) (*User, error) {
	var user User
	if err := db.WithOrmerCtx(ctx, func(ctx context.Context, ormer orm.Ormer) error {
		err := ormer.QueryTable("user").Filter("email", email).One(&user)
		if err != nil {
			if errors.Is(err, orm.ErrNoRows) {
				return ErrUserNotFound
			}
			return err
		}

		_, err = ormer.LoadRelatedWithCtx(ctx, &user, "accounts")
		if err != nil {
			return err
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return &user, nil
}
