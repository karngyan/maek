package notes

import (
	"context"
	"errors"

	"github.com/beego/beego/v2/client/orm"
	"github.com/karngyan/maek/db"
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

type UpsertNoteRequest struct {
	Uuid      string
	Content   string
	Favorite  bool
	Created   int64
	Updated   int64
	Workspace *auth.Workspace
	CreatedBy *auth.User
	UpdatedBy *auth.User
}

func UpsertNoteCtx(ctx context.Context, req *UpsertNoteRequest) (*Note, error) {
	nuuid := req.Uuid
	if nuuid == "" {
		return nil, errors.New("uuid is required")
	}

	if req.Content == "" {
		return nil, errors.New("content is required")
	}

	if req.Workspace == nil {
		return nil, errors.New("workspace is required")
	}

	if req.UpdatedBy == nil {
		return nil, errors.New("updated by is required")
	}

	// check if note already exists
	existingNote, err := FindNoteByUuid(ctx, nuuid, req.Workspace.Id)
	if err != nil {
		if !errors.Is(err, orm.ErrNoRows) {
			return nil, err
		}
	}

	note := &Note{
		Uuid:      nuuid,
		Content:   req.Content,
		Favorite:  req.Favorite,
		Trashed:   false,
		Workspace: req.Workspace,
		Updated:   req.Updated,
		Created:   req.Created,
		UpdatedBy: req.UpdatedBy,
		CreatedBy: req.CreatedBy,
	}

	if existingNote != nil {
		note.Id = existingNote.Id
		note.Trashed = existingNote.Trashed
		// don't let client change created and created by once created
		note.Created = existingNote.Created
		note.CreatedBy = existingNote.CreatedBy
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
