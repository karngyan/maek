CREATE TABLE IF NOT EXISTS "collection_notes"
(
    id            BIGSERIAL PRIMARY KEY,
    collection_id BIGINT NOT NULL,
    note_id       BIGINT NOT NULL
);

-- Index for querying notes in a collection
CREATE INDEX idx_collection_notes_collection
    ON "collection_notes" (collection_id);

-- Index for finding collections containing a note
CREATE INDEX idx_collection_notes_note
    ON "collection_notes" (note_id);
