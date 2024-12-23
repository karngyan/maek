package auth

import (
	"context"

	"github.com/karngyan/maek/db"
)

func DeleteSession(ctx context.Context, token string) error {
	err := sessionCache.Delete(token)
	if err != nil {
		return err
	}

	return db.Q.DeleteSessionByToken(ctx, token)
}
