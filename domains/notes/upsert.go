package notes

import (
	"context"
	"errors"

	"github.com/beego/beego/v2/client/orm"
	"github.com/karngyan/maek/db"

	"github.com/bluele/go-timecop"
	"github.com/karngyan/maek/domains/auth"
)

type UpsertOpt func(note *Note)

func WithContent(content string) UpsertOpt {
	return func(note *Note) {
		note.Content = content
	}
}

func WithUuid(uuid string) UpsertOpt {
	return func(note *Note) {
		note.Uuid = uuid
	}
}

func WithFavorite(favorite bool) UpsertOpt {
	return func(note *Note) {
		note.Favorite = favorite
	}
}

func WithWorkspace(workspace *auth.Workspace) UpsertOpt {
	return func(note *Note) {
		note.Workspace = workspace
	}
}

func WithUpdatedBy(user *auth.User) UpsertOpt {
	return func(note *Note) {
		note.UpdatedBy = user
	}
}

func UpsertNoteCtx(ctx context.Context, opts ...UpsertOpt) (*Note, error) {

	note := &Note{}
	for _, opt := range opts {
		opt(note)
	}

	nuuid := note.Uuid
	if nuuid == "" {
		return nil, errors.New("uuid is required")
	}

	if note.Content == "" {
		return nil, errors.New("content is required")
	}

	if note.Workspace == nil {
		return nil, errors.New("workspace is required")
	}

	if note.UpdatedBy == nil {
		return nil, errors.New("updated by is required")
	}

	// check if note already exists
	existingNote, err := FindNoteByUuid(ctx, nuuid, note.Workspace.Id)
	if err != nil {
		if !errors.Is(err, orm.ErrNoRows) {
			return nil, err
		}
	}

	now := timecop.Now().Unix()

	if existingNote != nil {
		// update existing note
		note.Id = existingNote.Id
		note.Created = existingNote.Created
		note.CreatedBy = existingNote.CreatedBy
		note.Updated = now
	} else {
		note.Created = now
		note.Updated = now
	}

	if note.CreatedBy == nil {
		note.CreatedBy = note.UpdatedBy
	}

	if err := db.WithOrmerCtx(ctx, func(ctx context.Context, ormer orm.Ormer) error {
		_, err := ormer.InsertOrUpdateWithCtx(ctx, note)
		if err != nil {
			return err
		}
		return nil
	}); err != nil {
		return nil, err
	}

	return note, nil
}
