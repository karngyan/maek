CREATE TABLE IF NOT EXISTS collection
(
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL DEFAULT '',    -- Collection name
    description   TEXT         NOT NULL,               -- Collection description
    created       BIGINT       NOT NULL DEFAULT 0,     -- Creation timestamp
    updated       BIGINT       NOT NULL DEFAULT 0,     -- Last updated timestamp
    trashed       BOOLEAN      NOT NULL DEFAULT FALSE, -- Trash flag
    deleted       BOOLEAN      NOT NULL DEFAULT FALSE, -- Soft delete flag
    workspace_id  BIGINT       NOT NULL,               -- Foreign key to workspace table
    created_by_id BIGINT       NOT NULL,               -- Foreign key to user table (creator)
    updated_by_id BIGINT       NOT NULL                -- Foreign key to user table (updater)
);