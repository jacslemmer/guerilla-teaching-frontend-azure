# Guerilla Teaching Project Makefile
# This file provides convenient commands for common development and deployment tasks

.PHONY: help install build test dev start stop restart clean deploy backup logs status health

# Default target
.DEFAULT_GOAL := help

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
BLUE := \033[0;34m
NC := \033[0m

# Configuration
COMPOSE_DEV := docker-compose -f docker-compose.dev.yml
COMPOSE_PROD := docker-compose -f docker-compose.prod.yml
BACKEND_PORT := 3001
FRONTEND_PORT := 3000

## Help
help: ## Show this help message
	@echo "$(BLUE)Guerilla Teaching Project Commands$(NC)"
	@echo ""
	@echo "$(GREEN)Development:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Development:/ {found=1; next} found && /^[a-zA-Z_-]+:.*?## / && !/^##/ {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2} /^## / && found {found=0}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)Building & Testing:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Building.*Testing:/ {found=1; next} found && /^[a-zA-Z_-]+:.*?## / && !/^##/ {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2} /^## / && found {found=0}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)Production:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Production:/ {found=1; next} found && /^[a-zA-Z_-]+:.*?## / && !/^##/ {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2} /^## / && found {found=0}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)Maintenance:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / && /Maintenance:/ {found=1; next} found && /^[a-zA-Z_-]+:.*?## / && !/^##/ {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2} /^## / && found {found=0}' $(MAKEFILE_LIST)

## Development:
install: ## Install all dependencies
	@echo "$(BLUE)Installing dependencies...$(NC)"
	@if [ -d "shared" ]; then cd shared && npm install || (echo "$(RED)Shared dependencies failed$(NC)" && exit 1); fi
	@if [ -d "backend" ]; then cd backend && npm install || (echo "$(RED)Backend dependencies failed$(NC)" && exit 1); fi
	@if [ -d "frontend" ]; then cd frontend && npm install || (echo "$(RED)Frontend dependencies failed$(NC)" && exit 1); fi
	@echo "$(GREEN)Dependencies installed successfully!$(NC)"

dev: ## Start development environment
	@echo "$(BLUE)Starting development environment...$(NC)"
	@./scripts/start-dev.sh

dev-docker: ## Start development environment with Docker
	@echo "$(BLUE)Starting development environment with Docker...$(NC)"
	@$(COMPOSE_DEV) up -d
	@echo "$(GREEN)Development environment started!$(NC)"
	@make status

start: dev ## Alias for dev

stop: ## Stop all services
	@echo "$(BLUE)Stopping services...$(NC)"
	@if [ -f "logs/backend.pid" ]; then \
		kill `cat logs/backend.pid` 2>/dev/null || true; \
		rm -f logs/backend.pid; \
	fi
	@if [ -f "logs/frontend.pid" ]; then \
		kill `cat logs/frontend.pid` 2>/dev/null || true; \
		rm -f logs/frontend.pid; \
	fi
	@$(COMPOSE_DEV) down || true
	@echo "$(GREEN)Services stopped!$(NC)"

restart: stop dev ## Restart development environment

dev-logs: ## View development logs
	@echo "$(BLUE)Viewing development logs...$(NC)"
	@$(COMPOSE_DEV) logs -f

## Building & Testing:
build: ## Build the entire stack
	@echo "$(BLUE)Building entire stack...$(NC)"
	@./scripts/build.sh || (echo "$(RED)Build script failed$(NC)" && exit 1)
	@echo "$(GREEN)Build completed!$(NC)"

test: ## Run all tests
	@echo "$(BLUE)Running tests...$(NC)"
	@if [ -d "shared" ]; then cd shared && npm test || true; fi
	@if [ -d "backend" ]; then cd backend && npm test || true; fi
	@if [ -d "frontend" ]; then cd frontend && npm test || true; fi
	@echo "$(GREEN)Tests completed!$(NC)"

lint: ## Run linting on all projects
	@echo "$(BLUE)Running linting...$(NC)"
	@if [ -d "shared" ]; then cd shared && npm run lint || true; fi
	@if [ -d "backend" ]; then cd backend && npm run lint || true; fi
	@if [ -d "frontend" ]; then cd frontend && npm run lint || true; fi
	@echo "$(GREEN)Linting completed!$(NC)"

format: ## Format code in all projects
	@echo "$(BLUE)Formatting code...$(NC)"
	@if [ -d "shared" ]; then cd shared && npm run format || true; fi
	@if [ -d "backend" ]; then cd backend && npm run format || true; fi
	@if [ -d "frontend" ]; then cd frontend && npm run format || true; fi
	@echo "$(GREEN)Code formatted!$(NC)"

type-check: ## Run TypeScript type checking
	@echo "$(BLUE)Running TypeScript type checking...$(NC)"
	@if [ -d "shared" ]; then cd shared && npx tsc --noEmit || true; fi
	@if [ -d "backend" ]; then cd backend && npx tsc --noEmit || true; fi
	@if [ -d "frontend" ]; then cd frontend && npx tsc --noEmit || true; fi
	@echo "$(GREEN)Type checking completed!$(NC)"

## Production:
deploy: ## Deploy to production
	@echo "$(BLUE)Deploying to production...$(NC)"
	@./scripts/deploy.sh
	@echo "$(GREEN)Deployment completed!$(NC)"

deploy-local: ## Deploy locally for testing
	@echo "$(BLUE)Deploying locally...$(NC)"
	@./scripts/deploy.sh --local
	@echo "$(GREEN)Local deployment completed!$(NC)"

prod-up: ## Start production environment
	@echo "$(BLUE)Starting production environment...$(NC)"
	@$(COMPOSE_PROD) up -d
	@echo "$(GREEN)Production environment started!$(NC)"
	@make prod-status

prod-down: ## Stop production environment
	@echo "$(BLUE)Stopping production environment...$(NC)"
	@$(COMPOSE_PROD) down
	@echo "$(GREEN)Production environment stopped!$(NC)"

prod-logs: ## View production logs
	@echo "$(BLUE)Viewing production logs...$(NC)"
	@$(COMPOSE_PROD) logs -f

prod-status: ## Show production status
	@echo "$(BLUE)Production Status:$(NC)"
	@$(COMPOSE_PROD) ps

## Maintenance:
clean: ## Clean build artifacts and caches
	@echo "$(BLUE)Cleaning build artifacts...$(NC)"
	@rm -rf shared/dist shared/node_modules
	@rm -rf backend/dist backend/node_modules
	@rm -rf frontend/dist frontend/node_modules
	@rm -rf logs/*.log
	@rm -rf docker-build
	@docker system prune -f || true
	@echo "$(GREEN)Cleanup completed!$(NC)"

backup: ## Create database backup
	@echo "$(BLUE)Creating database backup...$(NC)"
	@mkdir -p backups
	@docker exec $$(docker ps -qf "name=postgres") pg_dump -U postgres -d guerilla_teaching > backups/backup-$$(date +%Y%m%d-%H%M%S).sql || echo "$(YELLOW)Database backup failed - check if postgres container is running$(NC)"
	@echo "$(GREEN)Database backup completed!$(NC)"

restore: ## Restore database from backup (requires BACKUP_FILE variable)
	@echo "$(BLUE)Restoring database from backup...$(NC)"
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo "$(RED)Error: Please specify BACKUP_FILE=path/to/backup.sql$(NC)"; \
		exit 1; \
	fi
	@docker exec -i $$(docker ps -qf "name=postgres") psql -U postgres -d guerilla_teaching < $(BACKUP_FILE)
	@echo "$(GREEN)Database restored!$(NC)"

logs: ## View application logs
	@echo "$(BLUE)Application Logs:$(NC)"
	@if [ -f "logs/backend.log" ]; then echo "$(YELLOW)Backend:$(NC)"; tail -n 20 logs/backend.log; fi
	@if [ -f "logs/frontend.log" ]; then echo "$(YELLOW)Frontend:$(NC)"; tail -n 20 logs/frontend.log; fi

status: ## Show development status
	@echo "$(BLUE)Development Status:$(NC)"
	@if [ -f "logs/backend.pid" ]; then \
		echo "$(GREEN)✓ Backend running (PID: $$(cat logs/backend.pid))$(NC)"; \
	else \
		echo "$(RED)✗ Backend not running$(NC)"; \
	fi
	@if [ -f "logs/frontend.pid" ]; then \
		echo "$(GREEN)✓ Frontend running (PID: $$(cat logs/frontend.pid))$(NC)"; \
	else \
		echo "$(RED)✗ Frontend not running$(NC)"; \
	fi
	@echo ""
	@echo "$(BLUE)Docker Services:$(NC)"
	@$(COMPOSE_DEV) ps 2>/dev/null || echo "$(YELLOW)Docker Compose not running$(NC)"

health: ## Check service health
	@echo "$(BLUE)Health Check:$(NC)"
	@echo -n "Backend: "
	@curl -sf http://localhost:$(BACKEND_PORT)/health >/dev/null && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Unhealthy$(NC)"
	@echo -n "Frontend: "
	@curl -sf http://localhost:$(FRONTEND_PORT) >/dev/null && echo "$(GREEN)✓ Healthy$(NC)" || echo "$(RED)✗ Unhealthy$(NC)"

update: ## Update all dependencies
	@echo "$(BLUE)Updating dependencies...$(NC)"
	@if [ -d "shared" ]; then cd shared && npm update; fi
	@if [ -d "backend" ]; then cd backend && npm update; fi
	@if [ -d "frontend" ]; then cd frontend && npm update; fi
	@echo "$(GREEN)Dependencies updated!$(NC)"

security-audit: ## Run security audit
	@echo "$(BLUE)Running security audit...$(NC)"
	@if [ -d "shared" ]; then cd shared && npm audit || true; fi
	@if [ -d "backend" ]; then cd backend && npm audit || true; fi
	@if [ -d "frontend" ]; then cd frontend && npm audit || true; fi
	@echo "$(GREEN)Security audit completed!$(NC)"

reset: clean install ## Full reset: clean and reinstall everything
	@echo "$(GREEN)Full reset completed!$(NC)"

# Docker-specific commands
docker-build: ## Build all Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	@$(COMPOSE_DEV) build
	@echo "$(GREEN)Docker images built!$(NC)"

docker-clean: ## Clean Docker artifacts
	@echo "$(BLUE)Cleaning Docker artifacts...$(NC)"
	@docker system prune -a -f
	@docker volume prune -f
	@echo "$(GREEN)Docker cleanup completed!$(NC)"

# Environment setup
setup-env: ## Setup environment files from examples
	@echo "$(BLUE)Setting up environment files...$(NC)"
	@if [ ! -f "backend/.env" ] && [ -f "backend/.env.example" ]; then \
		cp backend/.env.example backend/.env; \
		echo "$(GREEN)Created backend/.env$(NC)"; \
	fi
	@if [ ! -f "frontend/.env" ] && [ -f "frontend/.env.example" ]; then \
		cp frontend/.env.example frontend/.env; \
		echo "$(GREEN)Created frontend/.env$(NC)"; \
	fi
	@echo "$(YELLOW)Please review and update .env files with your configuration$(NC)"

# Quick commands for common workflows
quick-start: install setup-env dev ## Quick start: install deps, setup env, and start dev

full-test: lint type-check test ## Run full test suite (lint + type-check + tests)

release: full-test build ## Prepare for release (test + build)