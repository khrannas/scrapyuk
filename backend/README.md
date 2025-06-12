# ScrapYuk Backend API

A Go-based REST API for the ScrapYuk 3D scrapbook application, built with Gin framework, SQLite database, and MinIO object storage.

## Features

- **RESTful API** for project and asset management
- **SQLite Database** with GORM ORM for data persistence
- **MinIO Object Storage** for PNG asset uploads
- **CORS Support** for frontend integration
- **Shared Links** with expiration for buyer access
- **Health Checks** and error handling
- **API Documentation** endpoint

## Tech Stack

- **Go 1.21+** with Gin web framework
- **SQLite** database with GORM
- **MinIO** for object storage
- **JWT** for authentication (future enhancement)
- **UUID** for unique identifiers

## Quick Start

### Prerequisites

- Go 1.21 or higher
- Docker (optional, for MinIO)

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd scrapyuk/backend
   ```

2. **Install dependencies**:
   ```bash
   make deps
   # or manually:
   go mod download && go mod tidy
   ```

3. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env file as needed
   ```

4. **Start MinIO (optional)**:
   ```bash
   make minio-start
   # MinIO will be available at:
   # - API: http://localhost:9000
   # - Console: http://localhost:9001
   # - Credentials: minioadmin / minioadmin
   ```

5. **Run the server**:
   ```bash
   make run
   # or for development with hot reload:
   make dev
   ```

The API will be available at `http://localhost:8080`

## API Endpoints

### Health Checks
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health with database/storage status

### Projects
- `GET /api/projects` - List projects (paginated)
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Assets
- `GET /api/projects/:id/assets` - List project assets
- `POST /api/projects/:id/assets` - Upload asset to project
- `DELETE /api/assets/:id` - Delete asset
- `GET /api/assets/*filepath` - Serve asset file

### Shared Links
- `POST /api/shared-links` - Create shared link
- `GET /api/projects/:id/shared-links` - List project shared links
- `DELETE /api/shared-links/:token` - Delete shared link
- `GET /api/shared/:token` - Get shared project (buyer view)

### Documentation
- `GET /api` - API documentation and endpoint list

## Configuration

Environment variables (see `.env.example`):

```bash
# Server Configuration
PORT=8080
GIN_MODE=debug

# Database Configuration
DB_PATH=./data/scrapyuk.db

# MinIO Configuration
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=scrapyuk-assets

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## Database Schema

### Projects
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  frame_size TEXT NOT NULL,
  project_data JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Assets
```sql
CREATE TABLE assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

### Objects
```sql
CREATE TABLE objects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  asset_id INTEGER,
  position JSON NOT NULL,
  layers INTEGER DEFAULT 1,
  properties JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL
);
```

### Shared Links
```sql
CREATE TABLE shared_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

## Development

### Available Make Commands

```bash
make build         # Build the application
make run           # Run the application
make dev           # Run with hot reload (requires air)
make test          # Run tests
make test-coverage # Run tests with coverage
make clean         # Clean build artifacts
make deps          # Download dependencies
make fmt           # Format code
make lint          # Lint code (requires golangci-lint)
make db-reset      # Reset SQLite database
make minio-start   # Start MinIO with Docker
make minio-stop    # Stop MinIO container
make setup         # Full development setup
make help          # Show help
```

### Hot Reload Development

Install Air for hot reload:
```bash
go install github.com/cosmtrek/air@latest
```

Then run:
```bash
make dev
```

### Testing

Run tests:
```bash
make test
```

Run tests with coverage:
```bash
make test-coverage
```

### Code Quality

Format code:
```bash
make fmt
```

Lint code (install golangci-lint first):
```bash
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
make lint
```

## API Usage Examples

### Create a Project
```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Scrapbook",
    "frame_size": "20x20",
    "project_data": {"version": "1.0", "objects": []}
  }'
```

### Upload an Asset
```bash
curl -X POST http://localhost:8080/api/projects/1/assets \
  -F "file=@image.png"
```

### Create a Shared Link
```bash
curl -X POST "http://localhost:8080/api/shared-links?project_id=1" \
  -H "Content-Type: application/json" \
  -d '{
    "expires_at": "2024-12-31T23:59:59Z"
  }'
```

## Error Handling

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Human readable message",
  "data": {}, // Present on success
  "error": "Error details" // Present on failure
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `410` - Gone (expired links)
- `500` - Internal Server Error
- `503` - Service Unavailable

## Production Deployment

1. Set `GIN_MODE=release` in environment
2. Use strong `JWT_SECRET`
3. Configure proper CORS origins
4. Set up persistent MinIO storage
5. Consider using PostgreSQL instead of SQLite for high traffic
6. Set up proper logging and monitoring

## License

[Add your license information here]