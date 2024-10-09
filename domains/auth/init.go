package auth

import (
	"context"
	"time"

	"github.com/bluele/go-timecop"

	"github.com/beego/beego/v2/client/orm"
	"github.com/karngyan/maek/db"

	"github.com/beego/beego/v2/client/cache"
)

var (
	userCache    = cache.NewMemoryCache()
	sessionCache = cache.NewMemoryCache()
)

func CacheInit() error {
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

		return session, nil
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

		return user, nil
	}); err != nil {
		return err
	}

	return nil
}
