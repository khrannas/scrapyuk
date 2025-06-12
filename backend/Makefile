# ScrapYuk Backend Makefile

# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
GOMOD=$(GOCMD) mod
BINARY_NAME=scrapyuk-backend
BINARY_UNIX=$(BINARY_NAME)_unix
MAIN_PATH=./cmd/server

# Default target
.PHONY: all
all: test build

# Build the application
.PHONY: build
build:
	$(GOBUILD) -o $(BINARY_NAME) -v $(MAIN_PATH)

# Build for Linux
.PHONY: build-linux
build-linux:
	CGO_ENABLED=1 GOOS=linux GOARCH=amd64 $(GOBUILD) -o $(BINARY_UNIX) -v $(MAIN_PATH)

# Run the application
.PHONY: run
run:
	$(GOCMD) run $(MAIN_PATH)/main.go

# Run with hot reload (using air if available)
.PHONY: dev
dev:
	@if command -v air > /dev/null; then \
		air; \
	else \
		echo "Air not found, install with: go install github.com/cosmtrek/air@latest"; \
		$(MAKE) run; \
	fi

# Test the application
.PHONY: test
test:
	$(GOTEST) -v ./...

# Test with coverage
.PHONY: test-coverage
test-coverage:
	$(GOTEST) -v -coverprofile=coverage.out ./...
	$(GOCMD) tool cover -html=coverage.out

# Clean build artifacts
.PHONY: clean
clean:
	$(GOCLEAN)
	rm -f $(BINARY_NAME)
	rm -f $(BINARY_UNIX)
	rm -f coverage.out

# Download dependencies
.PHONY: deps
deps:
	$(GOMOD) download
	$(GOMOD) tidy

# Format code
.PHONY: fmt
fmt:
	$(GOCMD) fmt ./...

# Lint code (requires golangci-lint)
.PHONY: lint
lint:
	@if command -v golangci-lint > /dev/null; then \
		golangci-lint run; \
	else \
		echo "golangci-lint not found, install with: go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest"; \
	fi

# Generate documentation
.PHONY: docs
docs:
	@echo "API Documentation available at http://localhost:8080/api when server is running"

# Database operations
.PHONY: db-reset
db-reset:
	rm -f ./data/scrapyuk.db
	@echo "Database reset. It will be recreated on next server start."

# MinIO setup (requires Docker)
.PHONY: minio-start
minio-start:
	@if command -v docker > /dev/null; then \
		docker run -d \
		  --name scrapyuk-minio \
		  -p 9000:9000 \
		  -p 9001:9001 \
		  -e "MINIO_ROOT_USER=minioadmin" \
		  -e "MINIO_ROOT_PASSWORD=minioadmin" \
		  -v minio_data:/data \
		  minio/minio server /data --console-address ":9001"; \
		echo "MinIO started at http://localhost:9000 (API) and http://localhost:9001 (Console)"; \
		echo "Credentials: minioadmin / minioadmin"; \
	else \
		echo "Docker not found, please install Docker to run MinIO"; \
	fi

.PHONY: minio-stop
minio-stop:
	@if command -v docker > /dev/null; then \
		docker stop scrapyuk-minio || true; \
		docker rm scrapyuk-minio || true; \
		echo "MinIO stopped and removed"; \
	else \
		echo "Docker not found"; \
	fi

# Full setup for development
.PHONY: setup
setup: deps minio-start
	@echo "Backend setup complete!"
	@echo "Run 'make dev' to start the development server"

# Help
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  build         - Build the application"
	@echo "  run           - Run the application"
	@echo "  dev           - Run with hot reload (requires air)"
	@echo "  test          - Run tests"
	@echo "  test-coverage - Run tests with coverage report"
	@echo "  clean         - Clean build artifacts"
	@echo "  deps          - Download and tidy dependencies"
	@echo "  fmt           - Format code"
	@echo "  lint          - Lint code (requires golangci-lint)"
	@echo "  db-reset      - Reset SQLite database"
	@echo "  minio-start   - Start MinIO with Docker"
	@echo "  minio-stop    - Stop MinIO container"
	@echo "  setup         - Full development setup"
	@echo "  help          - Show this help message"