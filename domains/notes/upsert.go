package notes

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"

	"github.com/karngyan/maek/db"
)

type UpsertNoteRequest struct {
	UUID           string
	Content        string
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

	if req.Content == "" {
		return nil, errors.New("content is required")
	}

	if req.WorkspaceID == 0 {
		return nil, errors.New("workspace is required")
	}

	if req.UpdatedByID == 0 {
		return nil, errors.New("updated by is required")
	}

	// check if note already exists
	existingDBNote, err := db.Q.GetNoteByUUIDAndWorkspace(ctx, db.GetNoteByUUIDAndWorkspaceParams{
		UUID:        nuuid,
		WorkspaceID: req.WorkspaceID,
	})
	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			return nil, err
		}
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

	if existingDBNote.ID > 0 {
		note.ID = existingDBNote.ID
		note.Trashed = existingDBNote.Trashed
		// don't let client change created and created by once created
		note.Created = existingDBNote.Created
		note.CreatedByID = existingDBNote.CreatedByID
	}

	id, err := db.Q.UpsertNote(ctx, db.UpsertNoteParams{
		ID:             note.ID,
		UUID:           note.UUID,
		Content:        note.Content,
		Favorite:       note.Favorite,
		Deleted:        note.Deleted,
		Trashed:        note.Trashed,
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
	if err != nil {
		return nil, err
	}

	note.ID = id
	return note, nil
}
