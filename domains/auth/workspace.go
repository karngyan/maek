package auth

import (
	"errors"

	"github.com/karngyan/maek/db"
)

var (
	ErrWorkspaceNotFound = errors.New("workspace not found")
)

type Workspace struct {
	ID          int64
	Name        string
	Description string
	Created     int64
	Updated     int64
}

func WorkspaceFromDB(dw *db.Workspace) *Workspace {
	return &Workspace{
		ID:          dw.ID,
		Name:        dw.Name,
		Description: dw.Description,
		Created:     dw.Created,
		Updated:     dw.Updated,
	}
}
