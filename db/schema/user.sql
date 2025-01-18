CREATE TABLE IF NOT EXISTS "user"
(
    id                   BIGSERIAL PRIMARY KEY,
    default_workspace_id BIGINT       NOT NULL DEFAULT 0,         -- Default workspace ID
    name                 VARCHAR(255) NOT NULL DEFAULT '',        -- User's name
    email                VARCHAR(255) NOT NULL DEFAULT '' UNIQUE, -- User's email
    role                 VARCHAR(255) NOT NULL DEFAULT 'user',    -- User's role
    password             TEXT         NOT NULL DEFAULT '',        -- User's password (hashed)
    verified             BOOLEAN      NOT NULL DEFAULT FALSE,     -- Email verification status
    created              BIGINT       NOT NULL DEFAULT 0,         -- Creation timestamp
    updated              BIGINT       NOT NULL DEFAULT 0          -- Last updated timestamp
);
