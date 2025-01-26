// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package db

import (
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/pgvector/pgvector-go"
)

type Collection struct {
	ID          int64
	Name        string
	Description string
	Created     int64
	Updated     int64
	Trashed     bool
	Deleted     bool
	WorkspaceID int64
	CreatedByID int64
	UpdatedByID int64
}

type CollectionNote struct {
	ID           int64
	CollectionID int64
	NoteID       int64
	Trashed      pgtype.Bool
}

type Embedding struct {
	ID              int64
	NoteID          int32
	WorkspaceID     int32
	Chunk           pgtype.Text
	ChunkID         pgtype.Int4
	EmbeddingVector pgvector.Vector
	Created         int64
	Updated         int64
}

type EmbeddingJob struct {
	ID          int64
	NoteID      int32
	WorkspaceID int32
	Content     string
	Status      pgtype.Int4
	Attempts    pgtype.Int4
	Created     int64
	Updated     int64
}

type Note struct {
	ID             int64
	UUID           string
	Content        []byte
	MdContent      string
	Favorite       bool
	Deleted        bool
	Trashed        bool
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

type Session struct {
	ID      int64
	UA      string
	IP      string
	UserID  int64
	Token   string
	Expires int64
	Created int64
	Updated int64
}

type User struct {
	ID                 int64
	DefaultWorkspaceID int64
	Name               string
	Email              string
	Role               string
	Password           string
	Verified           bool
	Created            int64
	Updated            int64
}

type UserWorkspace struct {
	ID          int64
	UserID      int64
	WorkspaceID int64
}

type Workspace struct {
	ID          int64
	Name        string
	Description string
	Created     int64
	Updated     int64
}
