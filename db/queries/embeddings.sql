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
INSERT INTO embedding_job (note_id, workspace_id, content)
VALUES ($1, $2, $3)
    RETURNING id;
