CREATE TABLE IF NOT EXISTS collection
(
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL DEFAULT '',
    description   TEXT         NOT NULL,
    created       BIGINT       NOT NULL DEFAULT 0,
    updated       BIGINT       NOT NULL DEFAULT 0,
    trashed       BOOLEAN      NOT NULL DEFAULT FALSE,
    deleted       BOOLEAN      NOT NULL DEFAULT FALSE,
    workspace_id  BIGINT       NOT NULL,
    created_by_id BIGINT       NOT NULL,
    updated_by_id BIGINT       NOT NULL
);

CREATE INDEX idx_collection_workspace
    ON collection (workspace_id);

CREATE INDEX idx_collection_workspace_deleted
    ON collection (workspace_id, deleted);
