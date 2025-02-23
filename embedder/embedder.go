package embedder

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/karngyan/maek/ai"
	"github.com/karngyan/maek/db"
	"github.com/pgvector/pgvector-go"
	"time"
)

type EmbeddingJobStatus int32

const (
	EmbeddingJobStatusPending EmbeddingJobStatus = iota + 1
	EmbeddingJobStatusRunning
	EmbeddingJobStatusCompleted
	EmbeddingJobStatusFailed
)

func AddEmbeddingJobs(ctx context.Context, q *db.Queries, nid int64, wid int64, content []byte) error {
	_, err := q.InsertEmbeddingJobs(ctx, db.InsertEmbeddingJobsParams{
		NoteID:      int32(nid),
		WorkspaceID: int32(wid),
		Content:     string(content),
	})
	if err != nil {
		return err
	}
	return nil
}

func ProcessEmbeddingJobs() error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
	defer cancel()

	return db.Tx(ctx, func(txCtx context.Context, q *db.Queries) error {
		jobs, err := q.GetEmbeddingJobsByStatus(txCtx, pgtype.Int4{
			Int32: int32(EmbeddingJobStatusPending),
			Valid: true,
		})
		if err != nil {
			return fmt.Errorf("failed to fetch embedding jobs: %w", err)
		}
		// define a function which creates chunks with content string
		for _, job := range jobs {
			chunks, generateErr := ai.CreateChunks(ctx, job.Content, 300)
			if generateErr != nil {
				return generateErr
			}
			for _, chunk := range chunks {
				vector, generateErr := ai.GenerateEmbeddings(ctx, chunk)
				if generateErr != nil {
					updateErr := q.UpdateEmbeddingJobStatus(txCtx, db.UpdateEmbeddingJobStatusParams{
						ID: job.ID,
						Status: pgtype.Int4{
							Int32: int32(EmbeddingJobStatusFailed),
							Valid: true,
						},
					})
					if updateErr != nil {
						return fmt.Errorf("failed to update job status to 'Failed' for job ID %d: %w", job.ID, updateErr)
					}
					continue
				}
				_, insertErr := q.InsertEmbeddings(txCtx, db.InsertEmbeddingsParams{
					NoteID:          int32(job.NoteID),
					WorkspaceID:     int32(job.WorkspaceID),
					Chunk:           pgtype.Text{String: chunk.PageContent},
					EmbeddingVector: pgvector.NewVector(vector),
				})
				if insertErr != nil {
					return insertErr
				}
				updateErr := q.UpdateEmbeddingJobStatus(txCtx, db.UpdateEmbeddingJobStatusParams{
					ID: job.ID,
					Status: pgtype.Int4{
						Int32: int32(EmbeddingJobStatusCompleted),
						Valid: true,
					},
				})
				if updateErr != nil {
					return fmt.Errorf("failed to update job status to 'Completed' for job ID %d: %w", job.ID, updateErr)
				}
			}
		}
		return nil // All jobs processed successfully
	})
}
