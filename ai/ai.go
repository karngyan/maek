package ai

import (
  "context"
  "fmt"
  "github.com/tmc/langchaingo/documentloaders"
  "github.com/tmc/langchaingo/embeddings"
  "github.com/tmc/langchaingo/llms/ollama"
  "github.com/tmc/langchaingo/schema"
  "github.com/tmc/langchaingo/textsplitter"
  "os"
)

func GenerateEmbeddings(ctx context.Context, content schema.Document) ([]float32, error) {
  ollamaLLM, err := ollama.New(ollama.WithModel("llama2"))
  if err != nil {
    return nil, err
  }
  ollamaEmbeder, err := embeddings.NewEmbedder(ollamaLLM)
  if err != nil {
    return nil, err
  }
  vector, err := ollamaEmbeder.EmbedQuery(ctx, content.PageContent)
  if err != nil {
    return nil, err
  }
  return vector, nil
}

func CreateChunks(ctx context.Context, data string, maxChunkSize int) ([]schema.Document, error) {
  file := documentloaders.NewText(ConvertContentIntoFile(data))

  split := textsplitter.NewRecursiveCharacter()
  split.ChunkSize = maxChunkSize
  split.ChunkOverlap = 30
  docs, err := file.LoadAndSplit(context.Background(), split)

  if err != nil {
    return nil, err
  }
  return docs, nil
}

func ConvertContentIntoFile(content string) *os.File {
  fileName := "input.txt"

  // Create the file
  file, err := os.Create(fileName)
  if err != nil {
    fmt.Printf("Error creating file: %v\n", err)
    return nil
  }
  defer file.Close()

  // Write the string content to the file
  _, err = file.WriteString(content)
  if err != nil {
    fmt.Printf("Error writing to file: %v\n", err)
    return nil
  }
  return file
}
