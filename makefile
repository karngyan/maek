.PHONY: help up down apply setup diff test sql-generate dev
.DEFAULT_GOAL := help

help: ## Display this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

up: ## Start all docker services
	docker-compose up -d

down: ## Stop all docker services
	docker-compose down

apply: ## Applies latest schema to database
	pg-schema-diff apply --dsn "postgres://maek:passwd@localhost:5432/maek_dev?sslmode=disable" --schema-dir ./db/schema

setup: up apply ## Setup development environment

diff: ## Check for schema changes
	pg-schema-diff plan --dsn "postgres://maek:passwd@localhost:5432/maek_dev?sslmode=disable" --schema-dir ./db/schema

dev: ## Start development server
	go run cmds/ui_api/main.go

test: ## Run go tests
	go test -v ./...

sql-generate: ## Generate sql go files for queries
	sqlc generate
