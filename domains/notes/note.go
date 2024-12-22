package notes

import "github.com/karngyan/maek/db"

type Note struct {
	ID             int64
	UUID           string
	Content        []byte
	Favorite       bool
	Trashed        bool
	Deleted        bool
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
	Created        int64
	Updated        int64
	CreatedByID    int64
	UpdatedByID    int64
}

func (note *Note) SortValue(sortKey SortKey) int64 {
	switch sortKey {
	case SortKeyCreatedAsc, SortKeyCreatedDsc:
		return note.Created
	case SortKeyUpdatedAsc, SortKeyUpdatedDsc:
		return note.Updated
	default:
		return 0
	}
}

// noteFromDB converts a db.Note to a notes.Note
func noteFromDB(dbNote db.Note) *Note {
	return &Note{
		ID:             dbNote.ID,
		UUID:           dbNote.UUID,
		Content:        dbNote.Content,
		Favorite:       dbNote.Favorite,
		Trashed:        dbNote.Trashed,
		Deleted:        dbNote.Deleted,
		HasContent:     dbNote.HasContent,
		HasImages:      dbNote.HasImages,
		HasVideos:      dbNote.HasVideos,
		HasOpenTasks:   dbNote.HasOpenTasks,
		HasClosedTasks: dbNote.HasClosedTasks,
		HasCode:        dbNote.HasCode,
		HasAudios:      dbNote.HasAudios,
		HasLinks:       dbNote.HasLinks,
		HasFiles:       dbNote.HasFiles,
		HasQuotes:      dbNote.HasQuotes,
		HasTables:      dbNote.HasTables,
		WorkspaceID:    dbNote.WorkspaceID,
		Created:        dbNote.Created,
		Updated:        dbNote.Updated,
		CreatedByID:    dbNote.CreatedByID,
		UpdatedByID:    dbNote.UpdatedByID,
	}
}
