-- name: InsertCollection :one
INSERT INTO collection (name, description, created, updated, trashed, deleted, workspace_id, created_by_id, updated_by_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING id;

-- name: AddNoteToCollection :exec
INSERT INTO collection_notes (collection_id, note_id)
VALUES ($1, $2);

-- name: GetCollectionByIDAndWorkspace :one
SELECT id, name, description, created, updated, trashed, deleted, workspace_id, created_by_id, updated_by_id
FROM collection
WHERE id = $1
  AND workspace_id = $2;

-- name: UpdateCollection :exec
UPDATE collection
SET name          = $1,
    description   = $2,
    updated_by_id = $3,
    updated       = $4
WHERE id = $5
  AND workspace_id = $6;

-- name: TrashCollection :exec
UPDATE collection
SET trashed = $1,
    updated_by_id = $2,
    updated = $3
WHERE id = $4
  AND workspace_id = $5;

-- name: DeleteCollection :exec
UPDATE collection
SET deleted = $1,
    updated_by_id = $2,
    updated = $3
WHERE id = $4
  AND workspace_id = $5;

-- name: GetInitialCollectionsUpdatedAsc :many
SELECT id, name, description, created, updated, trashed, deleted, workspace_id, created_by_id, updated_by_id
FROM collection
WHERE workspace_id = $1
  AND trashed = $2
  AND deleted = FALSE
ORDER BY updated ASC,
         id ASC
LIMIT $3;

-- name: GetInitialCollectionsUpdatedDesc :many
SELECT id, name, description, created, updated, trashed, deleted, workspace_id, created_by_id, updated_by_id
FROM collection
WHERE workspace_id = $1
  AND trashed = $2
  AND deleted = FALSE
ORDER BY updated DESC,
         id DESC
LIMIT $3;

-- name: GetInitialCollectionsAlphabeticalAsc :many
SELECT id, name, description, created, updated, trashed, deleted, workspace_id, created_by_id, updated_by_id
FROM collection
WHERE workspace_id = $1
  AND trashed = $2
  AND deleted = FALSE
ORDER BY name ASC,
         id ASC 
LIMIT $3;

-- name: GetInitialCollectionsAlphabeticalDesc :many
SELECT id, name, description, created, updated, trashed, deleted, workspace_id, created_by_id, updated_by_id
FROM collection
WHERE workspace_id = $1
  AND trashed = $2
  AND deleted = FALSE
ORDER BY name DESC,
         id DESC
LIMIT $3;



