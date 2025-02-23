package ai

import (
  "bytes"
  "context"
  "fmt"
  "github.com/tmc/langchaingo/documentloaders"
  "github.com/tmc/langchaingo/embeddings"
  "github.com/tmc/langchaingo/llms/ollama"
  "github.com/tmc/langchaingo/schema"
  "github.com/tmc/langchaingo/textsplitter"
)

func GenerateEmbeddings(ctx context.Context, content schema.Document) ([]float32, error) {
  ollamaLLM, err := ollama.New(ollama.WithModel("llama3.2"))
  if err != nil {
    fmt.Println("error declaring Ollama", err)
    return nil, err
  }
  ollamaEmbeder, err := embeddings.NewEmbedder(ollamaLLM)
  if err != nil {
    fmt.Println("error creating embedding", err)
    return nil, err
  }
  vector, err := ollamaEmbeder.EmbedQuery(ctx, content.PageContent)
  if err != nil {
    fmt.Println("error creating vector embeddings", err)
    return nil, err
  }
  fmt.Println(len(vector))
  return vector, nil
}

func CreateChunks(ctx context.Context, data string, maxChunkSize int) ([]schema.Document, error) {
  text := documentloaders.NewText(bytes.NewReader([]byte(data)))
  split := textsplitter.NewRecursiveCharacter(
    textsplitter.WithChunkSize(maxChunkSize),
    textsplitter.WithChunkOverlap(30),
  )
  docs, err := text.LoadAndSplit(context.Background(), split)
  if err != nil {
    fmt.Println("Error loading documents:", err)
    return nil, err
  }
  return docs, nil
}
