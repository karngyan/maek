.PHONY: help up down dev test sqlc
.DEFAULT_GOAL := help

help: ## Display this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

up: ## Start all docker services
	docker-compose up -d

down: ## Stop all docker services
	docker-compose down

dev: ## Start development server
	air

test: ## Run go tests
	go test -v ./...

sqlc: ## Generate sql go files for queries in sqlc
	sqlc generate
