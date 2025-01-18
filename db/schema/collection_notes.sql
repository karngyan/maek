CREATE TABLE IF NOT EXISTS collection_notes
(
    id            BIGSERIAL PRIMARY KEY,
    collection_id BIGINT NOT NULL,      -- Foreign key to collection table
    note_id       BIGINT NOT NULL,      -- Foreign key to note table
    trashed       BOOLEAN DEFAULT FALSE -- Trash flag
);