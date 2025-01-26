-- name: InsertCollection :one
INSERT INTO collection (name, description, created, updated, trashed, deleted, workspace_id, created_by_id, updated_by_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING id;

-- name: AddNotesToCollections :exec
INSERT INTO collection_notes (collection_id, note_id, trashed)
SELECT UNNEST(@collection_ids::BIGINT[]), UNNEST(@note_ids::BIGINT[]), FALSE
ON CONFLICT (collection_id, note_id)
DO UPDATE
SET trashed = FALSE;

-- name: RemoveNotesFromCollection :exec
UPDATE collection_notes
SET trashed = TRUE
WHERE collection_id = $1
  AND note_id = ANY(@note_ids)
  AND trashed = FALSE; -- Avoid updating already trashed entries

-- name: RemoveCollectionsFromNote :exec
UPDATE collection_notes
SET trashed = TRUE
WHERE note_id = $1
  AND collection_id = ANY(@collection_ids)
  AND trashed = FALSE; -- Avoid updating already trashed entries

-- name: GetCollectionsByNoteUUIDAndWorkspace :many
SELECT c.id, c.name, c.description, c.created, c.updated, c.trashed, c.deleted,
       c.workspace_id, c.created_by_id, c.updated_by_id
FROM collection c
JOIN collection_notes cn ON c.id = cn.collection_id
JOIN note n ON cn.note_id = n.id
WHERE n.uuid = $1
  AND cn.trashed = FALSE
  AND c.workspace_id = $2
  AND c.deleted = FALSE
  AND c.trashed = FALSE
  AND n.deleted = FALSE
  AND n.trashed = FALSE
ORDER BY c.updated DESC;

-- name: GetCollectionByIDAndWorkspace :one
SELECT id, name, description, created, updated, trashed, deleted, workspace_id, created_by_id, updated_by_id
FROM collection
WHERE id = $1
  AND workspace_id = $2;

-- name: UpdateCollection :one
UPDATE collection
SET name          = $1,
    description   = $2,
    updated_by_id = $3,
    updated       = $4
WHERE id = $5
  AND workspace_id = $6
RETURNING id, name, description, created, updated, trashed, deleted,
          workspace_id, created_by_id, updated_by_id;

-- name: TrashCollection :exec
UPDATE collection
SET trashed = TRUE,
    updated_by_id = $1,
    updated = $2
WHERE id = $3
  AND workspace_id = $4;

-- name: TrashCollectionsByIDs :exec
UPDATE collection
SET trashed = TRUE,
    updated_by_id = $1,
    updated = $2
WHERE id = ANY(@ids)
  AND workspace_id = $3;

-- name: DeleteCollection :exec
UPDATE collection
SET deleted = $1,
    updated_by_id = $2,
    updated = $3
WHERE id = $4
  AND workspace_id = $5;

-- name: ListCollections :many
SELECT id, name, description, created, updated, trashed, deleted,
       workspace_id, created_by_id, updated_by_id
FROM collection
WHERE workspace_id = $1
  AND deleted = false
  AND trashed = false
  AND (
    -- Sort by updated timestamp
    CASE WHEN @sort_by = 'updated' THEN
      CASE WHEN @sort_order = 'desc' THEN
        CASE WHEN @cursor_updated::BIGINT > 0 THEN
          (updated, id) < (@cursor_updated::BIGINT, @cursor_id::BIGINT)
        ELSE TRUE END
      ELSE
        CASE WHEN @cursor_updated::BIGINT > 0 THEN
          (updated, id) > (@cursor_updated::BIGINT, @cursor_id::BIGINT)
        ELSE TRUE END
      END
    -- Sort by name (string)
    WHEN @sort_by = 'name' THEN
      CASE WHEN @sort_order = 'desc' THEN
        CASE WHEN @cursor_name::VARCHAR != '' THEN
          (name, id) < (@cursor_name::VARCHAR, @cursor_id::BIGINT)
        ELSE TRUE END
      ELSE
        CASE WHEN @cursor_name::VARCHAR != '' THEN
          (name, id) > (@cursor_name::VARCHAR, @cursor_id::BIGINT)
        ELSE TRUE END
      END
    ELSE TRUE
    END
  )
ORDER BY
  CASE
    WHEN @sort_by = 'updated' AND @sort_order = 'desc' THEN updated END DESC,
  CASE
    WHEN @sort_by = 'updated' AND @sort_order = 'asc' THEN updated END ASC,
  CASE
    WHEN @sort_by = 'name' AND @sort_order = 'desc' THEN name END DESC,
  CASE
    WHEN @sort_by = 'name' AND @sort_order = 'asc' THEN name END ASC,
  id DESC -- Secondary sort by ID ensures stable ordering
LIMIT $2;
