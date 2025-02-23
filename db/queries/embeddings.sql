-- name: GetEmbeddingJobsByStatus :many
SELECT id,
       note_id,
       workspace_id,
       content,
       status,
       attempts,
       created,
       updated
FROM embedding_job
WHERE status = $1;

-- name: InsertEmbeddingJobs :one
INSERT INTO embedding_job (note_id, workspace_id, content, created, updated)
VALUES ($1, $2, $3, $4, $5)
    RETURNING id;

-- name: UpdateEmbeddingJobStatus :exec
UPDATE embedding_job
SET status = $2
WHERE id = $1;

-- name: InsertEmbeddings :one
INSERT INTO embedding (note_id, workspace_id, chunk, embedding_vector)
VALUES ($1, $2, $3, $4)
    RETURNING id;