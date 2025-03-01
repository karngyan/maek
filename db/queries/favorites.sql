-- name: GetFavoritesByUser :many
SELECT f.id, f.entity_type, f.entity_id, f.workspace_id, f.created, f.updated, f.order_idx
FROM favorite f
LEFT JOIN note n ON f.entity_type = 1 AND f.entity_id = n.id
LEFT JOIN collection c ON f.entity_type = 2 AND f.entity_id = c.id
WHERE f.user_id = $1
AND (
    (f.entity_type = 1 AND n.deleted = FALSE AND n.trashed = FALSE)
    OR
    (f.entity_type = 2 AND c.deleted = FALSE AND c.trashed = FALSE)
)
ORDER BY f.order_idx ASC;

-- name: UpdateFavoriteOrder :exec
UPDATE favorite
SET order_idx = $1
WHERE id = $2 AND user_id = $3;

-- name: DeleteFavorite :exec
DELETE FROM favorite
WHERE id = $1 AND user_id = $2;

-- name: DeleteAllFavoritesByUser :exec
DELETE FROM favorite
WHERE user_id = $1;

-- name: CreateFavorite :exec
INSERT INTO favorite (user_id, entity_type, entity_id, workspace_id, created, updated, order_idx)
SELECT $1, $2, $3, $4, $5, $6, $7
FROM (
    SELECT 1
    FROM note n
    WHERE $2 = 1 AND n.id = $3 AND n.workspace_id = $4
    UNION ALL
    SELECT 1
    FROM collection c
    WHERE $2 = 2 AND c.id = $3 AND c.workspace_id = $4
) AS validation
ON CONFLICT (user_id, entity_type, entity_id) DO NOTHING;