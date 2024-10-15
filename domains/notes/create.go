package notes

import (
	"context"
	"errors"

	"github.com/beego/beego/v2/client/orm"
	"github.com/karngyan/maek/db"

	"github.com/bluele/go-timecop"
	"github.com/karngyan/maek/domains/auth"
)

type CreateOpt func(note *Note)

func WithContent(content string) CreateOpt {
	return func(note *Note) {
		note.Content = content
	}
}

func WithFavorite(favorite bool) CreateOpt {
	return func(note *Note) {
		note.Favorite = favorite
	}
}

func WithWorkspace(workspace *auth.Workspace) CreateOpt {
	return func(note *Note) {
		note.Workspace = workspace
	}
}

func WithCreatedBy(user *auth.User) CreateOpt {
	return func(note *Note) {
		note.CreatedBy = user
	}
}

func CreateNoteCtx(ctx context.Context, opts ...CreateOpt) (*Note, error) {
	note := &Note{}
	for _, opt := range opts {
		opt(note)
	}

	now := timecop.Now().Unix()
	note.Created = now
	note.Updated = now
	note.UpdatedBy = note.CreatedBy

	if note.Workspace == nil {
		return nil, errors.New("workspace is required")
	}

	if note.CreatedBy == nil {
		return nil, errors.New("created by is required")
	}

	if err := db.WithOrmerCtx(ctx, func(ctx context.Context, ormer orm.Ormer) error {
		_, err := ormer.Insert(note)
		if err != nil {
			return err
		}
		return nil
	}); err != nil {
		return nil, err
	}

	return note, nil
}
