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

func UpdateWorkspace(ctx context.Context, wid int64, name, description string) error {
	name = strings.TrimSpace(name)
	description = strings.TrimSpace(description)

	return db.Q.UpdateWorkspaceNameDescription(ctx, db.UpdateWorkspaceNameDescriptionParams{
		Name:        name,
		Description: description,
		ID:          wid,
	})
}
