CREATE TABLE IF NOT EXISTS user_workspaces
(
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    workspace_id BIGINT NOT NULL
);