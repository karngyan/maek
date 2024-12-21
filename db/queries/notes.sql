-- name: GetNoteByUUIDAndWorkspace :one
SELECT id, uuid, content, favorite, deleted, trashed, has_content, has_images, has_videos,
       has_open_tasks, has_closed_tasks, has_code, has_audios, has_links, has_files,
       has_quotes, has_tables, workspace_id, created, updated, created_by_id, updated_by_id
FROM note
WHERE uuid = $1
  AND workspace_id = $2;

-- name: GetNotesWithSortingAndPagination :many
SELECT id, uuid, content, favorite, deleted, trashed, has_content, has_images, has_videos,
       has_open_tasks, has_closed_tasks, has_code, has_audios, has_links, has_files,
       has_quotes, has_tables, workspace_id, created, updated, created_by_id, updated_by_id
FROM note
WHERE workspace_id = $1
  AND deleted = FALSE
  AND trashed = FALSE
  AND has_content = TRUE
  AND (
    (created > @last_sort_value AND @sort_key = 'created_asc')
    OR (created < @last_sort_value AND @sort_key = 'created_dsc')
    OR (updated > @last_sort_value AND @sort_key = 'updated_asc')
    OR (updated < @last_sort_value AND @sort_key = 'updated_dsc')
    OR (created = @last_sort_value AND id > @last_note_id) -- Tie-breaker for stability
  )
ORDER BY
  CASE
    WHEN @sort_key = 'created_asc' THEN created
    WHEN @sort_key = 'created_dsc' THEN created
    WHEN @sort_key = 'updated_asc' THEN updated
    WHEN @sort_key = 'updated_dsc' THEN updated
  END ASC,
  id ASC
LIMIT $2;

-- name: UpsertNote :one
INSERT INTO note (
    id, uuid, content, favorite, deleted, trashed, has_content, has_images, has_videos,
    has_open_tasks, has_closed_tasks, has_code, has_audios, has_links, has_files,
    has_quotes, has_tables, workspace_id, created, updated, created_by_id, updated_by_id
)
VALUES (
    @id, @uuid, @content, @favorite, @deleted, @trashed, @has_content, @has_images, @has_videos,
    @has_open_tasks, @has_closed_tasks, @has_code, @has_audios, @has_links, @has_files,
    @has_quotes, @has_tables, @workspace_id, @created, @updated, @created_by_id, @updated_by_id
)
ON CONFLICT (id) DO UPDATE
SET
    uuid = EXCLUDED.uuid,
    content = EXCLUDED.content,
    favorite = EXCLUDED.favorite,
    deleted = EXCLUDED.deleted,
    trashed = EXCLUDED.trashed,
    has_content = EXCLUDED.has_content,
    has_images = EXCLUDED.has_images,
    has_videos = EXCLUDED.has_videos,
    has_open_tasks = EXCLUDED.has_open_tasks,
    has_closed_tasks = EXCLUDED.has_closed_tasks,
    has_code = EXCLUDED.has_code,
    has_audios = EXCLUDED.has_audios,
    has_links = EXCLUDED.has_links,
    has_files = EXCLUDED.has_files,
    has_quotes = EXCLUDED.has_quotes,
    has_tables = EXCLUDED.has_tables,
    workspace_id = EXCLUDED.workspace_id,
    created = EXCLUDED.created,
    updated = EXCLUDED.updated,
    created_by_id = EXCLUDED.created_by_id,
    updated_by_id = EXCLUDED.updated_by_id
RETURNING id;

-- name: TrashNoteByUUID :one
UPDATE note
SET
    trashed = TRUE,
    updated = @updated,
    updated_by_id = @updated_by_id
WHERE uuid = @uuid
  AND workspace_id = @workspace_id
RETURNING id;

-- name: TrashNotesByUUIDs :exec
UPDATE note
SET
    trashed = TRUE,
    updated = @updated,
    updated_by_id = @updated_by_id
WHERE uuid = ANY(@uuids)
  AND workspace_id = @workspace_id;