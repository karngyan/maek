-- +goose Up
-- +goose StatementBegin
-- workspace table
CREATE TABLE IF NOT EXISTS workspace
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL DEFAULT '', -- Name of the workspace
    description TEXT         NOT NULL,            -- Description of the workspace
    created     BIGINT       NOT NULL DEFAULT 0,  -- Creation timestamp
    updated     BIGINT       NOT NULL DEFAULT 0   -- Last updated timestamp
);

-- user table
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

-- user_workspaces table
CREATE TABLE IF NOT EXISTS user_workspaces
(
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    workspace_id BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_workspaces_user
    ON user_workspaces (user_id);

CREATE INDEX IF NOT EXISTS idx_user_workspaces_workspace
    ON user_workspaces (workspace_id);

-- session table
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

CREATE INDEX IF NOT EXISTS idx_session_token
    ON session (token);

CREATE INDEX IF NOT EXISTS idx_session_user
    ON session (user_id);

-- note table
CREATE TABLE IF NOT EXISTS note
(
    id               BIGSERIAL PRIMARY KEY,
    uuid             VARCHAR(100) NOT NULL UNIQUE,        -- Unique identifier for the note
    content          JSONB        NOT NULL,               -- Note content
    favorite         BOOLEAN      NOT NULL DEFAULT FALSE, -- Mark as favorite
    deleted          BOOLEAN      NOT NULL DEFAULT FALSE, -- Soft delete flag
    trashed          BOOLEAN      NOT NULL DEFAULT FALSE, -- Trash flag
    has_content      BOOLEAN      NOT NULL DEFAULT FALSE, -- Indicates presence of content
    has_images       BOOLEAN      NOT NULL DEFAULT FALSE, -- Indicates presence of images
    has_videos       BOOLEAN      NOT NULL DEFAULT FALSE, -- Indicates presence of videos
    has_open_tasks   BOOLEAN      NOT NULL DEFAULT FALSE, -- Indicates open tasks
    has_closed_tasks BOOLEAN      NOT NULL DEFAULT FALSE, -- Indicates closed tasks
    has_code         BOOLEAN      NOT NULL DEFAULT FALSE, -- Indicates code blocks
    has_audios       BOOLEAN      NOT NULL DEFAULT FALSE, -- Indicates audio files
    has_links        BOOLEAN      NOT NULL DEFAULT FALSE, -- Indicates links
    has_files        BOOLEAN      NOT NULL DEFAULT FALSE, -- Indicates attached files
    has_quotes       BOOLEAN      NOT NULL DEFAULT FALSE, -- Indicates quotes
    has_tables       BOOLEAN      NOT NULL DEFAULT FALSE, -- Indicates tables
    workspace_id     BIGINT       NOT NULL,               -- Foreign key to workspace table
    created          BIGINT       NOT NULL DEFAULT 0,     -- Creation timestamp
    updated          BIGINT       NOT NULL DEFAULT 0,     -- Last updated timestamp
    created_by_id    BIGINT       NOT NULL,               -- Foreign key to user table (creator)
    updated_by_id    BIGINT       NOT NULL                -- Foreign key to user table (updater)
);

CREATE INDEX IF NOT EXISTS idx_note_uuid ON note (uuid);

CREATE INDEX IF NOT EXISTS idx_note_workspace_created ON note (workspace_id, created DESC);

CREATE INDEX IF NOT EXISTS idx_note_favorite
    ON note (workspace_id, created DESC)
    WHERE favorite = TRUE AND deleted = FALSE AND trashed = FALSE;

CREATE INDEX IF NOT EXISTS idx_note_active
    ON note (workspace_id, created DESC)
    WHERE deleted = FALSE AND trashed = FALSE;

-- collection table
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

CREATE INDEX IF NOT EXISTS idx_collection_workspace
    ON collection (workspace_id);

CREATE INDEX IF NOT EXISTS idx_collection_workspace_deleted
    ON collection (workspace_id, deleted);

-- collection_notes table
CREATE TABLE IF NOT EXISTS collection_notes
(
    id            BIGSERIAL PRIMARY KEY,
    collection_id BIGINT NOT NULL,      -- Foreign key to collection table
    note_id       BIGINT NOT NULL,      -- Foreign key to note table
    trashed       BOOLEAN DEFAULT FALSE -- Trash flag
);

CREATE INDEX IF NOT EXISTS idx_collection_notes_collection
    ON collection_notes (collection_id);

CREATE INDEX IF NOT EXISTS idx_collection_notes_note
    ON collection_notes (note_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS collection_notes;
DROP TABLE IF EXISTS collection;
DROP TABLE IF EXISTS note;
DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS user_workspaces;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS workspace;
-- +goose StatementEnd