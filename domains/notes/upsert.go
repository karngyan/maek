package notes

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"

	"github.com/karngyan/maek/db"
)

type UpsertNoteRequest struct {
	UUID           string
	Content        []byte
	Favorite       bool
	Created        int64
	Updated        int64
	HasContent     bool
	HasImages      bool
	HasVideos      bool
	HasOpenTasks   bool
	HasClosedTasks bool
	HasCode        bool
	HasAudios      bool
	HasLinks       bool
	HasFiles       bool
	HasQuotes      bool
	HasTables      bool
	WorkspaceID    int64
	CreatedByID    int64
	UpdatedByID    int64
}

func UpsertNote(ctx context.Context, req *UpsertNoteRequest) (*Note, error) {
	nuuid := req.UUID
	if nuuid == "" {
		return nil, errors.New("uuid is required")
	}

	if len(req.Content) == 0 {
		return nil, errors.New("content is required")
	}

	if req.WorkspaceID == 0 {
		return nil, errors.New("workspace is required")
	}

	if req.UpdatedByID == 0 {
		return nil, errors.New("updated by is required")
	}

	note := &Note{
		UUID:           nuuid,
		Content:        req.Content,
		Favorite:       req.Favorite,
		Trashed:        false,
		WorkspaceID:    req.WorkspaceID,
		Updated:        req.Updated,
		Created:        req.Created,
		UpdatedByID:    req.UpdatedByID,
		CreatedByID:    req.CreatedByID,
		HasContent:     req.HasContent,
		HasImages:      req.HasImages,
		HasVideos:      req.HasVideos,
		HasOpenTasks:   req.HasOpenTasks,
		HasClosedTasks: req.HasClosedTasks,
		HasCode:        req.HasCode,
		HasAudios:      req.HasAudios,
		HasLinks:       req.HasLinks,
		HasFiles:       req.HasFiles,
		HasQuotes:      req.HasQuotes,
		HasTables:      req.HasTables,
	}

	err := db.Tx(ctx, func(ctx context.Context, q *db.Queries) (err error) {
		note.ID, err = q.CheckNoteExists(ctx, db.CheckNoteExistsParams{
			UUID:        nuuid,
			WorkspaceID: req.WorkspaceID,
		})
		if err != nil {
			if !errors.Is(err, pgx.ErrNoRows) {
				return err
			}

			note.ID, err = q.InsertNote(ctx, db.InsertNoteParams{
				UUID:           nuuid,
				Content:        string(note.Content),
				Favorite:       note.Favorite,
				Deleted:        false,
				Trashed:        false,
				HasContent:     note.HasContent,
				HasImages:      note.HasImages,
				HasVideos:      note.HasVideos,
				HasOpenTasks:   note.HasOpenTasks,
				HasClosedTasks: note.HasClosedTasks,
				HasCode:        note.HasCode,
				HasAudios:      note.HasAudios,
				HasLinks:       note.HasLinks,
				HasFiles:       note.HasFiles,
				HasQuotes:      note.HasQuotes,
				HasTables:      note.HasTables,
				WorkspaceID:    note.WorkspaceID,
				Created:        note.Created,
				Updated:        note.Updated,
				CreatedByID:    note.CreatedByID,
				UpdatedByID:    note.UpdatedByID,
			})

			return err
		}

		// exists; time to do an update
		return q.UpdateNote(ctx, db.UpdateNoteParams{
			Content:        string(req.Content),
			Favorite:       note.Favorite,
			HasContent:     note.HasContent,
			HasImages:      note.HasImages,
			HasVideos:      note.HasVideos,
			HasOpenTasks:   note.HasOpenTasks,
			UpdatedByID:    note.UpdatedByID,
			HasClosedTasks: note.HasClosedTasks,
			HasCode:        note.HasCode,
			HasAudios:      note.HasAudios,
			HasLinks:       note.HasLinks,
			HasFiles:       note.HasFiles,
			HasQuotes:      note.HasQuotes,
			HasTables:      note.HasTables,
			WorkspaceID:    note.WorkspaceID,
			Updated:        note.Updated,
		})
	})
	if err != nil {
		return nil, err
	}

	return note, nil
}
