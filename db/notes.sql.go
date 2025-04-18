// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: notes.sql

package db

import (
	"context"
)

const checkNoteExists = `-- name: CheckNoteExists :one
SELECT id, workspace_id
FROM note
WHERE uuid = $1
`

type CheckNoteExistsRow struct {
	ID          int64
	WorkspaceID int64
}

func (q *Queries) CheckNoteExists(ctx context.Context, uuid string) (CheckNoteExistsRow, error) {
	row := q.db.QueryRow(ctx, checkNoteExists, uuid)
	var i CheckNoteExistsRow
	err := row.Scan(&i.ID, &i.WorkspaceID)
	return i, err
}

const getInitialNotesCreatedAsc = `-- name: GetInitialNotesCreatedAsc :many
SELECT id,
       uuid,
       content,
       md_content,
       deleted,
       trashed,
       has_content,
       has_images,
       has_videos,
       has_open_tasks,
       has_closed_tasks,
       has_code,
       has_audios,
       has_links,
       has_files,
       has_quotes,
       has_tables,
       workspace_id,
       created,
       updated,
       created_by_id,
       updated_by_id
FROM note
WHERE workspace_id = $1
  AND deleted = FALSE
  AND trashed = FALSE
  AND has_content = TRUE
ORDER BY created ASC,
         id ASC
LIMIT $2
`

type GetInitialNotesCreatedAscParams struct {
	WorkspaceID int64
	Limit       int64
}

type GetInitialNotesCreatedAscRow struct {
	ID             int64
	UUID           string
	Content        []byte
	MdContent      string
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

func (q *Queries) GetInitialNotesCreatedAsc(ctx context.Context, arg GetInitialNotesCreatedAscParams) ([]GetInitialNotesCreatedAscRow, error) {
	rows, err := q.db.Query(ctx, getInitialNotesCreatedAsc, arg.WorkspaceID, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetInitialNotesCreatedAscRow
	for rows.Next() {
		var i GetInitialNotesCreatedAscRow
		if err := rows.Scan(
			&i.ID,
			&i.UUID,
			&i.Content,
			&i.MdContent,
			&i.Deleted,
			&i.Trashed,
			&i.HasContent,
			&i.HasImages,
			&i.HasVideos,
			&i.HasOpenTasks,
			&i.HasClosedTasks,
			&i.HasCode,
			&i.HasAudios,
			&i.HasLinks,
			&i.HasFiles,
			&i.HasQuotes,
			&i.HasTables,
			&i.WorkspaceID,
			&i.Created,
			&i.Updated,
			&i.CreatedByID,
			&i.UpdatedByID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getInitialNotesCreatedDesc = `-- name: GetInitialNotesCreatedDesc :many
SELECT id,
       uuid,
       content,
       md_content,
       deleted,
       trashed,
       has_content,
       has_images,
       has_videos,
       has_open_tasks,
       has_closed_tasks,
       has_code,
       has_audios,
       has_links,
       has_files,
       has_quotes,
       has_tables,
       workspace_id,
       created,
       updated,
       created_by_id,
       updated_by_id
FROM note
WHERE workspace_id = $1
  AND deleted = FALSE
  AND trashed = FALSE
  AND has_content = TRUE
ORDER BY created DESC,
         id DESC
LIMIT $2
`

type GetInitialNotesCreatedDescParams struct {
	WorkspaceID int64
	Limit       int64
}

type GetInitialNotesCreatedDescRow struct {
	ID             int64
	UUID           string
	Content        []byte
	MdContent      string
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

func (q *Queries) GetInitialNotesCreatedDesc(ctx context.Context, arg GetInitialNotesCreatedDescParams) ([]GetInitialNotesCreatedDescRow, error) {
	rows, err := q.db.Query(ctx, getInitialNotesCreatedDesc, arg.WorkspaceID, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetInitialNotesCreatedDescRow
	for rows.Next() {
		var i GetInitialNotesCreatedDescRow
		if err := rows.Scan(
			&i.ID,
			&i.UUID,
			&i.Content,
			&i.MdContent,
			&i.Deleted,
			&i.Trashed,
			&i.HasContent,
			&i.HasImages,
			&i.HasVideos,
			&i.HasOpenTasks,
			&i.HasClosedTasks,
			&i.HasCode,
			&i.HasAudios,
			&i.HasLinks,
			&i.HasFiles,
			&i.HasQuotes,
			&i.HasTables,
			&i.WorkspaceID,
			&i.Created,
			&i.Updated,
			&i.CreatedByID,
			&i.UpdatedByID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getInitialNotesUpdatedAsc = `-- name: GetInitialNotesUpdatedAsc :many
SELECT id,
       uuid,
       content,
       md_content,
       deleted,
       trashed,
       has_content,
       has_images,
       has_videos,
       has_open_tasks,
       has_closed_tasks,
       has_code,
       has_audios,
       has_links,
       has_files,
       has_quotes,
       has_tables,
       workspace_id,
       created,
       updated,
       created_by_id,
       updated_by_id
FROM note
WHERE workspace_id = $1
  AND deleted = FALSE
  AND trashed = FALSE
  AND has_content = TRUE
ORDER BY updated ASC,
         id ASC
LIMIT $2
`

type GetInitialNotesUpdatedAscParams struct {
	WorkspaceID int64
	Limit       int64
}

type GetInitialNotesUpdatedAscRow struct {
	ID             int64
	UUID           string
	Content        []byte
	MdContent      string
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

func (q *Queries) GetInitialNotesUpdatedAsc(ctx context.Context, arg GetInitialNotesUpdatedAscParams) ([]GetInitialNotesUpdatedAscRow, error) {
	rows, err := q.db.Query(ctx, getInitialNotesUpdatedAsc, arg.WorkspaceID, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetInitialNotesUpdatedAscRow
	for rows.Next() {
		var i GetInitialNotesUpdatedAscRow
		if err := rows.Scan(
			&i.ID,
			&i.UUID,
			&i.Content,
			&i.MdContent,
			&i.Deleted,
			&i.Trashed,
			&i.HasContent,
			&i.HasImages,
			&i.HasVideos,
			&i.HasOpenTasks,
			&i.HasClosedTasks,
			&i.HasCode,
			&i.HasAudios,
			&i.HasLinks,
			&i.HasFiles,
			&i.HasQuotes,
			&i.HasTables,
			&i.WorkspaceID,
			&i.Created,
			&i.Updated,
			&i.CreatedByID,
			&i.UpdatedByID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getInitialNotesUpdatedDesc = `-- name: GetInitialNotesUpdatedDesc :many
SELECT id,
       uuid,
       content,
       md_content,
       deleted,
       trashed,
       has_content,
       has_images,
       has_videos,
       has_open_tasks,
       has_closed_tasks,
       has_code,
       has_audios,
       has_links,
       has_files,
       has_quotes,
       has_tables,
       workspace_id,
       created,
       updated,
       created_by_id,
       updated_by_id
FROM note
WHERE workspace_id = $1
  AND deleted = FALSE
  AND trashed = FALSE
  AND has_content = TRUE
ORDER BY updated DESC,
         id DESC
LIMIT $2
`

type GetInitialNotesUpdatedDescParams struct {
	WorkspaceID int64
	Limit       int64
}

type GetInitialNotesUpdatedDescRow struct {
	ID             int64
	UUID           string
	Content        []byte
	MdContent      string
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

func (q *Queries) GetInitialNotesUpdatedDesc(ctx context.Context, arg GetInitialNotesUpdatedDescParams) ([]GetInitialNotesUpdatedDescRow, error) {
	rows, err := q.db.Query(ctx, getInitialNotesUpdatedDesc, arg.WorkspaceID, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetInitialNotesUpdatedDescRow
	for rows.Next() {
		var i GetInitialNotesUpdatedDescRow
		if err := rows.Scan(
			&i.ID,
			&i.UUID,
			&i.Content,
			&i.MdContent,
			&i.Deleted,
			&i.Trashed,
			&i.HasContent,
			&i.HasImages,
			&i.HasVideos,
			&i.HasOpenTasks,
			&i.HasClosedTasks,
			&i.HasCode,
			&i.HasAudios,
			&i.HasLinks,
			&i.HasFiles,
			&i.HasQuotes,
			&i.HasTables,
			&i.WorkspaceID,
			&i.Created,
			&i.Updated,
			&i.CreatedByID,
			&i.UpdatedByID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getNoteByUUIDAndWorkspace = `-- name: GetNoteByUUIDAndWorkspace :one
SELECT id,
       uuid,
       content,
       md_content,
       deleted,
       trashed,
       has_content,
       has_images,
       has_videos,
       has_open_tasks,
       has_closed_tasks,
       has_code,
       has_audios,
       has_links,
       has_files,
       has_quotes,
       has_tables,
       workspace_id,
       created,
       updated,
       created_by_id,
       updated_by_id
FROM note
WHERE uuid = $1
  AND workspace_id = $2
`

type GetNoteByUUIDAndWorkspaceParams struct {
	UUID        string
	WorkspaceID int64
}

type GetNoteByUUIDAndWorkspaceRow struct {
	ID             int64
	UUID           string
	Content        []byte
	MdContent      string
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

func (q *Queries) GetNoteByUUIDAndWorkspace(ctx context.Context, arg GetNoteByUUIDAndWorkspaceParams) (GetNoteByUUIDAndWorkspaceRow, error) {
	row := q.db.QueryRow(ctx, getNoteByUUIDAndWorkspace, arg.UUID, arg.WorkspaceID)
	var i GetNoteByUUIDAndWorkspaceRow
	err := row.Scan(
		&i.ID,
		&i.UUID,
		&i.Content,
		&i.MdContent,
		&i.Deleted,
		&i.Trashed,
		&i.HasContent,
		&i.HasImages,
		&i.HasVideos,
		&i.HasOpenTasks,
		&i.HasClosedTasks,
		&i.HasCode,
		&i.HasAudios,
		&i.HasLinks,
		&i.HasFiles,
		&i.HasQuotes,
		&i.HasTables,
		&i.WorkspaceID,
		&i.Created,
		&i.Updated,
		&i.CreatedByID,
		&i.UpdatedByID,
	)
	return i, err
}

const getNotesByCollectionID = `-- name: GetNotesByCollectionID :many
SELECT n.id,
       n.uuid,
       n.content,
       n.md_content,
       n.deleted,
       n.trashed,
       n.has_content,
       n.has_images,
       n.has_videos,
       n.has_open_tasks,
       n.has_closed_tasks,
       n.has_code,
       n.has_audios,
       n.has_links,
       n.has_files,
       n.has_quotes,
       n.has_tables,
       n.workspace_id,
       n.created,
       n.updated,
       n.created_by_id,
       n.updated_by_id
FROM collection_notes cn
         JOIN note n ON cn.note_id = n.id
WHERE cn.collection_id = $1
  AND cn.trashed = FALSE
  AND n.deleted = FALSE
  AND n.trashed = FALSE
  AND n.workspace_id = $2
ORDER BY n.updated DESC
`

type GetNotesByCollectionIDParams struct {
	CollectionID int64
	WorkspaceID  int64
}

type GetNotesByCollectionIDRow struct {
	ID             int64
	UUID           string
	Content        []byte
	MdContent      string
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

func (q *Queries) GetNotesByCollectionID(ctx context.Context, arg GetNotesByCollectionIDParams) ([]GetNotesByCollectionIDRow, error) {
	rows, err := q.db.Query(ctx, getNotesByCollectionID, arg.CollectionID, arg.WorkspaceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetNotesByCollectionIDRow
	for rows.Next() {
		var i GetNotesByCollectionIDRow
		if err := rows.Scan(
			&i.ID,
			&i.UUID,
			&i.Content,
			&i.MdContent,
			&i.Deleted,
			&i.Trashed,
			&i.HasContent,
			&i.HasImages,
			&i.HasVideos,
			&i.HasOpenTasks,
			&i.HasClosedTasks,
			&i.HasCode,
			&i.HasAudios,
			&i.HasLinks,
			&i.HasFiles,
			&i.HasQuotes,
			&i.HasTables,
			&i.WorkspaceID,
			&i.Created,
			&i.Updated,
			&i.CreatedByID,
			&i.UpdatedByID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getNotesCreatedAsc = `-- name: GetNotesCreatedAsc :many
SELECT id,
       uuid,
       content,
       md_content,
       deleted,
       trashed,
       has_content,
       has_images,
       has_videos,
       has_open_tasks,
       has_closed_tasks,
       has_code,
       has_audios,
       has_links,
       has_files,
       has_quotes,
       has_tables,
       workspace_id,
       created,
       updated,
       created_by_id,
       updated_by_id
FROM note
WHERE workspace_id = $1
  AND deleted = FALSE
  AND trashed = FALSE
  AND has_content = TRUE
  AND (
    created > $3
        OR (created = $3 AND id > $4) -- tie-break
    )
ORDER BY created ASC,
         id ASC
LIMIT $2
`

type GetNotesCreatedAscParams struct {
	WorkspaceID   int64
	Limit         int64
	LastSortValue int64
	LastNoteID    int64
}

type GetNotesCreatedAscRow struct {
	ID             int64
	UUID           string
	Content        []byte
	MdContent      string
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

func (q *Queries) GetNotesCreatedAsc(ctx context.Context, arg GetNotesCreatedAscParams) ([]GetNotesCreatedAscRow, error) {
	rows, err := q.db.Query(ctx, getNotesCreatedAsc,
		arg.WorkspaceID,
		arg.Limit,
		arg.LastSortValue,
		arg.LastNoteID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetNotesCreatedAscRow
	for rows.Next() {
		var i GetNotesCreatedAscRow
		if err := rows.Scan(
			&i.ID,
			&i.UUID,
			&i.Content,
			&i.MdContent,
			&i.Deleted,
			&i.Trashed,
			&i.HasContent,
			&i.HasImages,
			&i.HasVideos,
			&i.HasOpenTasks,
			&i.HasClosedTasks,
			&i.HasCode,
			&i.HasAudios,
			&i.HasLinks,
			&i.HasFiles,
			&i.HasQuotes,
			&i.HasTables,
			&i.WorkspaceID,
			&i.Created,
			&i.Updated,
			&i.CreatedByID,
			&i.UpdatedByID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getNotesCreatedDesc = `-- name: GetNotesCreatedDesc :many
SELECT id,
       uuid,
       content,
       md_content,
       deleted,
       trashed,
       has_content,
       has_images,
       has_videos,
       has_open_tasks,
       has_closed_tasks,
       has_code,
       has_audios,
       has_links,
       has_files,
       has_quotes,
       has_tables,
       workspace_id,
       created,
       updated,
       created_by_id,
       updated_by_id
FROM note
WHERE workspace_id = $1
  AND deleted = FALSE
  AND trashed = FALSE
  AND has_content = TRUE
  AND (
    created < $3
        OR (created = $3 AND id < $4) -- tie-break
    )
ORDER BY created DESC,
         id DESC
LIMIT $2
`

type GetNotesCreatedDescParams struct {
	WorkspaceID   int64
	Limit         int64
	LastSortValue int64
	LastNoteID    int64
}

type GetNotesCreatedDescRow struct {
	ID             int64
	UUID           string
	Content        []byte
	MdContent      string
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

func (q *Queries) GetNotesCreatedDesc(ctx context.Context, arg GetNotesCreatedDescParams) ([]GetNotesCreatedDescRow, error) {
	rows, err := q.db.Query(ctx, getNotesCreatedDesc,
		arg.WorkspaceID,
		arg.Limit,
		arg.LastSortValue,
		arg.LastNoteID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetNotesCreatedDescRow
	for rows.Next() {
		var i GetNotesCreatedDescRow
		if err := rows.Scan(
			&i.ID,
			&i.UUID,
			&i.Content,
			&i.MdContent,
			&i.Deleted,
			&i.Trashed,
			&i.HasContent,
			&i.HasImages,
			&i.HasVideos,
			&i.HasOpenTasks,
			&i.HasClosedTasks,
			&i.HasCode,
			&i.HasAudios,
			&i.HasLinks,
			&i.HasFiles,
			&i.HasQuotes,
			&i.HasTables,
			&i.WorkspaceID,
			&i.Created,
			&i.Updated,
			&i.CreatedByID,
			&i.UpdatedByID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getNotesUpdatedAsc = `-- name: GetNotesUpdatedAsc :many
SELECT id,
       uuid,
       content,
       md_content,
       deleted,
       trashed,
       has_content,
       has_images,
       has_videos,
       has_open_tasks,
       has_closed_tasks,
       has_code,
       has_audios,
       has_links,
       has_files,
       has_quotes,
       has_tables,
       workspace_id,
       created,
       updated,
       created_by_id,
       updated_by_id
FROM note
WHERE workspace_id = $1
  AND deleted = FALSE
  AND trashed = FALSE
  AND has_content = TRUE
  AND (
    updated > $3
        OR (updated = $3 AND id > $4)
    )
ORDER BY updated ASC,
         id ASC
LIMIT $2
`

type GetNotesUpdatedAscParams struct {
	WorkspaceID   int64
	Limit         int64
	LastSortValue int64
	LastNoteID    int64
}

type GetNotesUpdatedAscRow struct {
	ID             int64
	UUID           string
	Content        []byte
	MdContent      string
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

func (q *Queries) GetNotesUpdatedAsc(ctx context.Context, arg GetNotesUpdatedAscParams) ([]GetNotesUpdatedAscRow, error) {
	rows, err := q.db.Query(ctx, getNotesUpdatedAsc,
		arg.WorkspaceID,
		arg.Limit,
		arg.LastSortValue,
		arg.LastNoteID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetNotesUpdatedAscRow
	for rows.Next() {
		var i GetNotesUpdatedAscRow
		if err := rows.Scan(
			&i.ID,
			&i.UUID,
			&i.Content,
			&i.MdContent,
			&i.Deleted,
			&i.Trashed,
			&i.HasContent,
			&i.HasImages,
			&i.HasVideos,
			&i.HasOpenTasks,
			&i.HasClosedTasks,
			&i.HasCode,
			&i.HasAudios,
			&i.HasLinks,
			&i.HasFiles,
			&i.HasQuotes,
			&i.HasTables,
			&i.WorkspaceID,
			&i.Created,
			&i.Updated,
			&i.CreatedByID,
			&i.UpdatedByID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getNotesUpdatedDesc = `-- name: GetNotesUpdatedDesc :many
SELECT id,
       uuid,
       content,
       md_content,
       deleted,
       trashed,
       has_content,
       has_images,
       has_videos,
       has_open_tasks,
       has_closed_tasks,
       has_code,
       has_audios,
       has_links,
       has_files,
       has_quotes,
       has_tables,
       workspace_id,
       created,
       updated,
       created_by_id,
       updated_by_id
FROM note
WHERE workspace_id = $1
  AND deleted = FALSE
  AND trashed = FALSE
  AND has_content = TRUE
  AND (
    updated < $3
        OR (updated = $3 AND id < $4)
    )
ORDER BY updated DESC,
         id DESC
LIMIT $2
`

type GetNotesUpdatedDescParams struct {
	WorkspaceID   int64
	Limit         int64
	LastSortValue int64
	LastNoteID    int64
}

type GetNotesUpdatedDescRow struct {
	ID             int64
	UUID           string
	Content        []byte
	MdContent      string
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

func (q *Queries) GetNotesUpdatedDesc(ctx context.Context, arg GetNotesUpdatedDescParams) ([]GetNotesUpdatedDescRow, error) {
	rows, err := q.db.Query(ctx, getNotesUpdatedDesc,
		arg.WorkspaceID,
		arg.Limit,
		arg.LastSortValue,
		arg.LastNoteID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetNotesUpdatedDescRow
	for rows.Next() {
		var i GetNotesUpdatedDescRow
		if err := rows.Scan(
			&i.ID,
			&i.UUID,
			&i.Content,
			&i.MdContent,
			&i.Deleted,
			&i.Trashed,
			&i.HasContent,
			&i.HasImages,
			&i.HasVideos,
			&i.HasOpenTasks,
			&i.HasClosedTasks,
			&i.HasCode,
			&i.HasAudios,
			&i.HasLinks,
			&i.HasFiles,
			&i.HasQuotes,
			&i.HasTables,
			&i.WorkspaceID,
			&i.Created,
			&i.Updated,
			&i.CreatedByID,
			&i.UpdatedByID,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const insertNote = `-- name: InsertNote :one
INSERT INTO note (uuid, content, md_content, deleted, trashed, has_content, has_images, has_videos,
                  has_open_tasks, has_closed_tasks, has_code, has_audios, has_links, has_files,
                  has_quotes, has_tables, workspace_id, created, updated, created_by_id, updated_by_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
RETURNING id
`

type InsertNoteParams struct {
	UUID           string
	Content        []byte
	MdContent      string
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

func (q *Queries) InsertNote(ctx context.Context, arg InsertNoteParams) (int64, error) {
	row := q.db.QueryRow(ctx, insertNote,
		arg.UUID,
		arg.Content,
		arg.MdContent,
		arg.Deleted,
		arg.Trashed,
		arg.HasContent,
		arg.HasImages,
		arg.HasVideos,
		arg.HasOpenTasks,
		arg.HasClosedTasks,
		arg.HasCode,
		arg.HasAudios,
		arg.HasLinks,
		arg.HasFiles,
		arg.HasQuotes,
		arg.HasTables,
		arg.WorkspaceID,
		arg.Created,
		arg.Updated,
		arg.CreatedByID,
		arg.UpdatedByID,
	)
	var id int64
	err := row.Scan(&id)
	return id, err
}

const trashNoteByUUID = `-- name: TrashNoteByUUID :one
UPDATE note
SET trashed       = TRUE,
    updated       = $1,
    updated_by_id = $2
WHERE uuid = $3
  AND workspace_id = $4
RETURNING id
`

type TrashNoteByUUIDParams struct {
	Updated     int64
	UpdatedByID int64
	UUID        string
	WorkspaceID int64
}

func (q *Queries) TrashNoteByUUID(ctx context.Context, arg TrashNoteByUUIDParams) (int64, error) {
	row := q.db.QueryRow(ctx, trashNoteByUUID,
		arg.Updated,
		arg.UpdatedByID,
		arg.UUID,
		arg.WorkspaceID,
	)
	var id int64
	err := row.Scan(&id)
	return id, err
}

const trashNotesByUUIDs = `-- name: TrashNotesByUUIDs :exec
UPDATE note
SET trashed       = TRUE,
    updated       = $1,
    updated_by_id = $2
WHERE uuid = ANY ($3)
  AND workspace_id = $4
`

type TrashNotesByUUIDsParams struct {
	Updated     int64
	UpdatedByID int64
	Uuids       []string
	WorkspaceID int64
}

func (q *Queries) TrashNotesByUUIDs(ctx context.Context, arg TrashNotesByUUIDsParams) error {
	_, err := q.db.Exec(ctx, trashNotesByUUIDs,
		arg.Updated,
		arg.UpdatedByID,
		arg.Uuids,
		arg.WorkspaceID,
	)
	return err
}

const updateNote = `-- name: UpdateNote :exec
UPDATE note
SET content          = $1,
    has_content      = $2,
    has_images       = $3,
    has_videos       = $4,
    has_open_tasks   = $5,
    updated_by_id    = $6,
    has_closed_tasks = $7,
    has_code         = $8,
    has_audios       = $9,
    has_links        = $10,
    has_files        = $11,
    has_quotes       = $12,
    has_tables       = $13,
    updated          = $14,
    md_content       = $15
WHERE uuid = $16
  AND workspace_id = $17
`

type UpdateNoteParams struct {
	Content        []byte
	HasContent     bool
	HasImages      bool
	HasVideos      bool
	HasOpenTasks   bool
	UpdatedByID    int64
	HasClosedTasks bool
	HasCode        bool
	HasAudios      bool
	HasLinks       bool
	HasFiles       bool
	HasQuotes      bool
	HasTables      bool
	Updated        int64
	MdContent      string
	UUID           string
	WorkspaceID    int64
}

func (q *Queries) UpdateNote(ctx context.Context, arg UpdateNoteParams) error {
	_, err := q.db.Exec(ctx, updateNote,
		arg.Content,
		arg.HasContent,
		arg.HasImages,
		arg.HasVideos,
		arg.HasOpenTasks,
		arg.UpdatedByID,
		arg.HasClosedTasks,
		arg.HasCode,
		arg.HasAudios,
		arg.HasLinks,
		arg.HasFiles,
		arg.HasQuotes,
		arg.HasTables,
		arg.Updated,
		arg.MdContent,
		arg.UUID,
		arg.WorkspaceID,
	)
	return err
}
