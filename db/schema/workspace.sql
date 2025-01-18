CREATE TABLE IF NOT EXISTS workspace
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL DEFAULT '', -- Name of the workspace
    description TEXT         NOT NULL,            -- Description of the workspace
    created     BIGINT       NOT NULL DEFAULT 0,  -- Creation timestamp
    updated     BIGINT       NOT NULL DEFAULT 0   -- Last updated timestamp
);