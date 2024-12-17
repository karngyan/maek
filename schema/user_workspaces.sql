CREATE TABLE IF NOT EXISTS "user_workspaces"
(
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    workspace_id BIGINT NOT NULL
);

-- Index for finding workspaces for a user
CREATE INDEX idx_user_workspaces_user
    ON "user_workspaces" (user_id);

-- Index for finding users in a workspace
CREATE INDEX idx_user_workspaces_workspace
    ON "user_workspaces" (workspace_id);
