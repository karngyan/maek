package auth

import (
	"context"
	"strings"

	"github.com/karngyan/maek/db"
)

func UpdateUser(ctx context.Context, id int64, name string) error {
	name = strings.TrimSpace(name)

	return db.Q.UpdateUserName(ctx, db.UpdateUserNameParams{
		Name: name,
		ID:   id,
	})
}
