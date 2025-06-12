# Phase 3 Checklist - Backend API & Database Setup

## Overview
Phase 3 focuses on creating the backend infrastructure for ScrapYuk, including Go server, SQLite database, MinIO storage, and REST API endpoints.

## Progress Tracking
- [x] **Backend Setup**
  - [x] Create Go backend project structure in `/backend`
  - [x] Set up Gin framework
  - [x] Configure environment variables
  - [x] Set up basic server with health check endpoint

- [x] **Database Configuration**
  - [x] Set up SQLite database
  - [x] Create database schema for all entities
  - [x] Implement database migration system
  - [x] Create database models (Projects, Assets, Objects, SharedLinks)

- [x] **Asset Storage**
  - [x] Set up MinIO for local development
  - [x] Configure MinIO buckets for asset storage
  - [x] Implement file upload functionality

- [x] **REST API Endpoints**
  - [x] GET/POST `/api/projects` (list/create projects)
  - [x] GET/PUT/DELETE `/api/projects/:id` (get/update/delete project)
  - [x] POST `/api/projects/:id/assets` (upload assets)
  - [x] GET `/api/projects/:id/assets` (list project assets)
  - [x] POST `/api/shared-links` (create share link)
  - [x] GET `/api/shared/:token` (get shared project)

- [x] **Cross-Origin Configuration**
  - [x] Configure CORS for Next.js frontend communication
  - [x] Set up proper headers and allowed origins

- [x] **Frontend Integration**
  - [x] Create API client utilities for frontend
  - [ ] Update frontend to use backend APIs
  - [ ] Test frontend-backend integration

- [x] **Error Handling & Logging**
  - [x] Implement proper error handling middleware
  - [x] Set up structured logging
  - [x] Add request/response logging

- [x] **Documentation & Testing**
  - [x] Create API documentation
  - [ ] Write unit tests for API endpoints
  - [ ] Test backend functionality
  - [ ] Integration testing

## Database Schema

### Projects Table
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

### Assets Table
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

### Objects Table
```sql
CREATE TABLE objects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  asset_id INTEGER,
  position JSON NOT NULL,
  layers INTEGER DEFAULT 0,
  properties JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL
);
```

### SharedLinks Table
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

## Key User Stories Addressed
- **US-02**: Save design progress as project (backend storage)
- **US-03**: Re-open saved project from list (backend retrieval)
- **US-06**: Upload PNG files (asset storage via MinIO)

## Environment Configuration
- Go backend server port
- SQLite database path
- MinIO connection settings
- CORS allowed origins
- API base URL for frontend

## Completion Criteria
- [ ] All API endpoints functional and tested
- [ ] Database properly configured with migrations
- [ ] MinIO asset storage working
- [ ] Frontend successfully integrates with backend
- [ ] CORS properly configured
- [ ] Error handling and logging implemented
- [ ] API documentation complete

## Notes
- Backend runs on separate port from Next.js frontend
- SQLite database file stored in `/backend/data/`
- MinIO runs locally for development
- All API endpoints follow RESTful conventions
- Proper error responses and status codes implemented