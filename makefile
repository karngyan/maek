.PHONY: help up down apply setup diff
.DEFAULT_GOAL := help

help: ## Display this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

up: ## Start all docker services
	docker-compose up -d

down: ## Stop all docker services
	docker-compose down

apply: ## Applies latest schema to database
	atlas schema apply --to file://schema --url "${SQL_CONN}" --dev-url "${ATLAS_TMP_DEV_URL}"

setup: up apply ## Setup development environment

diff: ## Check for schema changes
	atlas schema diff --to file://schema --from "${SQL_CONN}" --dev-url "${ATLAS_TMP_DEV_URL}"

dev: ## Start development server
	bee run -main=cmds/api_server/main.go