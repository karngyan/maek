package embedder_test

import (
	"context"
	"github.com/karngyan/maek/db"
	"github.com/karngyan/maek/embedder"
	"github.com/labstack/gommon/log"
	"testing"
)

func TestFlow(t *testing.T) {
	ctx := context.Background()
	err := db.Tx(ctx, func(ctx context.Context, q *db.Queries) error {

		err := embedder.AddEmbeddingJobs(ctx, q, 1, 1, []byte("hello world"))
		if err != nil {
			log.Fatalf("failed to add embedding jobs: %v", err)
		}
		return nil
	})

	if err != nil {
		log.Info(err)
	}
}
