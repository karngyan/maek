-- name: InsertSession :one
INSERT INTO session (ua, ip, user_id, token, expires, created, updated)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING id;

-- name: InsertUser :one
INSERT INTO "user" (default_workspace_id, name, email, role, password, verified, created, updated)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id;

-- name: InsertWorkspace :one
INSERT INTO workspace (name, description, created, updated)
VALUES ($1, $2, $3, $4)
RETURNING id;

-- name: InsertUserWorkspace :one
INSERT INTO user_workspaces (user_id, workspace_id)
VALUES ($1, $2)
RETURNING id, user_id, workspace_id;

-- name: GetWorkspaceByID :one
SELECT id, name, description, created, updated
FROM workspace
WHERE id = $1;

-- name: GetUserByID :one
SELECT id, default_workspace_id, name, email, role, password, verified, created, updated
FROM "user"
WHERE id = $1;

-- name: GetUsersByIDs :many
SELECT id, default_workspace_id, name, email, role, password, verified, created, updated
FROM "user"
WHERE id = ANY($1);

-- name: GetUserByEmail :one
SELECT id, default_workspace_id, name, email, role, password, verified, created, updated
FROM "user"
WHERE email = $1;

-- name: GetWorkspacesForUser :many
SELECT w.id, w.name, w.description, w.created, w.updated
FROM workspace w
JOIN user_workspaces uw ON w.id = uw.workspace_id
WHERE uw.user_id = $1;

-- name: GetUsersForWorkspace :many
SELECT u.id, u.default_workspace_id, u.name, u.email, u.role, u.password, u.verified, u.created, u.updated
FROM "user" u
JOIN user_workspaces uw ON u.id = uw.user_id
WHERE uw.workspace_id = $1;

-- name: GetNonExpiredSessionByToken :one
SELECT id, ua, ip, user_id, token, expires, created, updated
FROM session
WHERE session.token = $1 AND session.expires > $2;

-- name: DeleteSessionByToken :exec
DELETE FROM session
WHERE token = $1;


