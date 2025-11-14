# Makefile for Ruaa Project Docker Environment

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make build     - Build Docker images"
	@echo "  make up        - Start all services"
	@echo "  make down      - Stop all services"
	@echo "  make logs      - View logs"
	@echo "  make init      - Initialize Laravel application"
	@echo "  make clean     - Remove all containers and volumes"

# Build Docker images
.PHONY: build
build:
	docker-compose build

# Start all services
.PHONY: up
up:
	docker-compose up -d

# Stop all services
.PHONY: down
down:
	docker-compose down

# View logs
.PHONY: logs
logs:
	docker-compose logs -f

# Initialize Laravel application
.PHONY: init
init:
	./init-laravel.sh

# Remove all containers and volumes
.PHONY: clean
clean:
	docker-compose down -v --remove-orphans