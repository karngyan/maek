-- name: GetNoteByUUIDAndWorkspace :one
SELECT id,
       uuid,
       content,
       favorite,
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
  AND workspace_id = $2;

-- name: GetNotesByCollectionID :many
SELECT n.id,
       n.uuid,
       n.content,
       n.favorite,
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
  AND n.deleted = FALSE
  AND n.trashed = FALSE
  AND n.workspace_id = $2
ORDER BY n.updated DESC;

-- name: CheckNoteExists :one
SELECT id
FROM note
WHERE uuid = $1
  AND workspace_id = $2;

-- name: UpdateNote :exec
UPDATE note
SET content          = $1,
    favorite         = $2,
    has_content      = $3,
    has_images       = $4,
    has_videos       = $5,
    has_open_tasks   = $6,
    updated_by_id    = $7,
    has_closed_tasks = $8,
    has_code         = $9,
    has_audios       = $10,
    has_links        = $11,
    has_files        = $12,
    has_quotes       = $13,
    has_tables       = $14,
    updated          = $15
WHERE uuid = $16
  AND workspace_id = $17;

-- name: InsertNote :one
INSERT INTO note (uuid, content, favorite, deleted, trashed, has_content, has_images, has_videos,
                  has_open_tasks, has_closed_tasks, has_code, has_audios, has_links, has_files,
                  has_quotes, has_tables, workspace_id, created, updated, created_by_id, updated_by_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
RETURNING id;

-- name: TrashNoteByUUID :one
UPDATE note
SET trashed       = TRUE,
    updated       = @updated,
    updated_by_id = @updated_by_id
WHERE uuid = @uuid
  AND workspace_id = @workspace_id
RETURNING id;

-- name: TrashNotesByUUIDs :exec
UPDATE note
SET trashed       = TRUE,
    updated       = @updated,
    updated_by_id = @updated_by_id
WHERE uuid = ANY (@uuids)
  AND workspace_id = @workspace_id;

-- name: GetInitialNotesCreatedAsc :many
SELECT id,
       uuid,
       content,
       favorite,
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
LIMIT $2;

-- name: GetNotesCreatedAsc :many
SELECT id,
       uuid,
       content,
       favorite,
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
    created > @last_sort_value
        OR (created = @last_sort_value AND id > @last_note_id) -- tie-break
    )
ORDER BY created ASC,
         id ASC
LIMIT $2;

-- name: GetInitialNotesCreatedDesc :many
SELECT id,
       uuid,
       content,
       favorite,
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
LIMIT $2;

-- name: GetNotesCreatedDesc :many
SELECT id,
       uuid,
       content,
       favorite,
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
    created < @last_sort_value
        OR (created = @last_sort_value AND id < @last_note_id) -- tie-break
    )
ORDER BY created DESC,
         id DESC
LIMIT $2;

-- name: GetInitialNotesUpdatedAsc :many
SELECT id,
       uuid,
       content,
       favorite,
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
LIMIT $2;

-- name: GetNotesUpdatedAsc :many
SELECT id,
       uuid,
       content,
       favorite,
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
    updated > @last_sort_value
        OR (updated = @last_sort_value AND id > @last_note_id)
    )
ORDER BY updated ASC,
         id ASC
LIMIT $2;

-- name: GetInitialNotesUpdatedDesc :many
SELECT id,
       uuid,
       content,
       favorite,
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
LIMIT $2;

-- name: GetNotesUpdatedDesc :many
SELECT id,
       uuid,
       content,
       favorite,
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
    updated < @last_sort_value
        OR (updated = @last_sort_value AND id < @last_note_id)
    )
ORDER BY updated DESC,
         id DESC
LIMIT $2;