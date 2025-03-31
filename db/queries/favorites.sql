-- name: GetFavoritesForUser :many
SELECT id,
       user_id,
       entity_type,
       entity_id,
       workspace_id,
       created,
       updated,
       order_idx
FROM favorite
WHERE user_id = $1
  AND workspace_id = $2
ORDER BY order_idx ASC
LIMIT $3;

-- name: InsertFavorite :one
INSERT INTO favorite (user_id, entity_type, entity_id, workspace_id, created, updated, order_idx)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id, user_id, entity_type, entity_id, workspace_id, created, updated, order_idx;

-- name: DeleteFavorite :exec
DELETE
FROM favorite
WHERE id = $1
  AND user_id = $2
  AND workspace_id = $3;

-- name: UpdateFavoriteOrder :exec
UPDATE favorite
SET order_idx = $1,
    updated   = $2
WHERE id = $3;

-- name: GetMaxOrderIndexForUser :one
SELECT COALESCE(MAX(order_idx), 0) AS max_idx
FROM favorite
WHERE user_id = $1
  AND workspace_id = $2;

-- name: ReindexFavoritesForUser :exec
UPDATE favorite
SET order_idx = new_idx.new_order
FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY order_idx ASC) * @gap::BIGINT AS new_order
      FROM favorite
      WHERE user_id = @user_id::BIGINT
        AND workspace_id = @workspace_id::BIGINT) AS new_idx
WHERE favorite.id = new_idx.id;

-- name: DeleteFavoritesByEntityId :exec
DELETE
FROM favorite
WHERE entity_id = $1
  AND workspace_id = $2
  AND user_id = $3;
