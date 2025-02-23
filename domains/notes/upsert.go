package notes

import (
	"context"
	"errors"

	"github.com/karngyan/maek/db"
)

type UpsertNoteRequest struct {
	UUID           string
	Content        []byte
	MdContent      string
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
		MdContent:      req.MdContent,
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

	err := db.Tx(ctx, func(ctx context.Context, q *db.Queries) error {
		ni, err := FindNoteInfo(ctx, nuuid)
		if err != nil {
			if !errors.Is(err, ErrNoteNotFound) {
				return err
			}

			note.ID, err = q.InsertNote(ctx, db.InsertNoteParams{
				UUID:           nuuid,
				Content:        note.Content,
				MdContent:      note.MdContent,
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

		// note exists in the db, lets make sure it's for the same workspace
		if ni.WorkspaceID != req.WorkspaceID {
			return ErrNoteNotFound
		}

		note.ID = ni.ID
		// exists; time to do an update
		return q.UpdateNote(ctx, db.UpdateNoteParams{
			UUID:           nuuid,
			MdContent:      req.MdContent,
			Content:        req.Content,
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
