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