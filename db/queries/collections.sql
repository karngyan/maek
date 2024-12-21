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