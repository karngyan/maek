CREATE TABLE IF NOT EXISTS session
(
    id      BIGSERIAL PRIMARY KEY,
    ua      VARCHAR(255) NOT NULL DEFAULT '', -- User agent information
    ip      VARCHAR(255) NOT NULL DEFAULT '', -- IP address
    user_id BIGINT       NOT NULL,            -- Foreign key to user table
    token   VARCHAR(255) NOT NULL DEFAULT '', -- Session token
    expires BIGINT       NOT NULL DEFAULT 0,  -- Expiration timestamp
    created BIGINT       NOT NULL DEFAULT 0,  -- Creation timestamp
    updated BIGINT       NOT NULL DEFAULT 0   -- Last updated timestamp
);