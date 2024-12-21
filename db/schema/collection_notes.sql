CREATE TABLE IF NOT EXISTS collection_notes
(
    id            BIGSERIAL PRIMARY KEY,
    collection_id BIGINT NOT NULL,
    note_id       BIGINT NOT NULL
);

CREATE INDEX idx_collection_notes_collection
    ON collection_notes (collection_id);

CREATE INDEX idx_collection_notes_note
    ON collection_notes (note_id);
