-- name: InsertCollection :one
INSERT INTO collection (name, description, created, updated, trashed, deleted, workspace_id, created_by_id, updated_by_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING id;

-- name: AddNotesToCollection :exec
INSERT INTO collection_notes (collection_id, note_id)
SELECT UNNEST(@collection_ids::BIGINT[]), UNNEST(@note_ids::BIGINT[]);

-- name: RemoveNotesFromCollection :exec
UPDATE collection_notes
SET trashed = TRUE
WHERE collection_id = $1
  AND note_id = ANY(@note_ids);

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
