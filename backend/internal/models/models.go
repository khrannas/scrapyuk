package models

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

// Project represents a scrapbook project
type Project struct {
	ID          uint            `gorm:"primaryKey" json:"id"`
	Title       string          `gorm:"not null" json:"title"`
	FrameSize   string          `gorm:"not null" json:"frame_size"` // "20x20" or "20x30"
	ProjectData json.RawMessage `gorm:"type:text" json:"project_data"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
	DeletedAt   gorm.DeletedAt  `gorm:"index" json:"-"`

	// Relationships
	Assets      []Asset      `gorm:"foreignKey:ProjectID;constraint:OnDelete:CASCADE" json:"assets,omitempty"`
	Objects     []Object     `gorm:"foreignKey:ProjectID;constraint:OnDelete:CASCADE" json:"objects,omitempty"`
	SharedLinks []SharedLink `gorm:"foreignKey:ProjectID;constraint:OnDelete:CASCADE" json:"shared_links,omitempty"`
}

// Asset represents an uploaded image asset
type Asset struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	ProjectID  uint      `gorm:"not null;index" json:"project_id"`
	Filename   string    `gorm:"not null" json:"filename"`
	FilePath   string    `gorm:"not null" json:"file_path"`
	UploadedAt time.Time `json:"uploaded_at"`

	// Relationships
	Project Project  `gorm:"foreignKey:ProjectID" json:"project,omitempty"`
	Objects []Object `gorm:"foreignKey:AssetID;constraint:OnDelete:SET NULL" json:"objects,omitempty"`
}

// Object represents a 3D object in the scene
type Object struct {
	ID         uint            `gorm:"primaryKey" json:"id"`
	ProjectID  uint            `gorm:"not null;index" json:"project_id"`
	AssetID    *uint           `gorm:"index" json:"asset_id"`
	Position   json.RawMessage `gorm:"type:text;not null" json:"position"`
	Layers     int             `gorm:"default:1" json:"layers"`
	Properties json.RawMessage `gorm:"type:text" json:"properties"`
	CreatedAt  time.Time       `json:"created_at"`

	// Relationships
	Project Project `gorm:"foreignKey:ProjectID" json:"project,omitempty"`
	Asset   *Asset  `gorm:"foreignKey:AssetID" json:"asset,omitempty"`
}

// SharedLink represents a shareable link for a project
type SharedLink struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	ProjectID uint       `gorm:"not null;index" json:"project_id"`
	Token     string     `gorm:"uniqueIndex;not null" json:"token"`
	ExpiresAt *time.Time `json:"expires_at"`
	CreatedAt time.Time  `json:"created_at"`

	// Relationships
	Project Project `gorm:"foreignKey:ProjectID" json:"project,omitempty"`
}

// TableName methods for custom table names (optional)
func (Project) TableName() string {
	return "projects"
}

func (Asset) TableName() string {
	return "assets"
}

func (Object) TableName() string {
	return "objects"
}

func (SharedLink) TableName() string {
	return "shared_links"
}

// ProjectCreateRequest represents the request payload for creating a project
type ProjectCreateRequest struct {
	Title       string          `json:"title" binding:"required"`
	FrameSize   string          `json:"frame_size" binding:"required,oneof=20x20 20x30"`
	ProjectData json.RawMessage `json:"project_data"`
}

// ProjectUpdateRequest represents the request payload for updating a project
type ProjectUpdateRequest struct {
	Title       *string         `json:"title"`
	FrameSize   *string         `json:"frame_size" binding:"omitempty,oneof=20x20 20x30"`
	ProjectData json.RawMessage `json:"project_data"`
}

// SharedLinkCreateRequest represents the request payload for creating a shared link
type SharedLinkCreateRequest struct {
	ExpiresAt *time.Time `json:"expires_at"`
}

// APIResponse represents a standard API response
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// PaginatedResponse represents a paginated API response
type PaginatedResponse struct {
	Success bool           `json:"success"`
	Message string         `json:"message"`
	Data    interface{}    `json:"data"`
	Meta    PaginationMeta `json:"meta"`
}

// PaginationMeta represents pagination metadata
type PaginationMeta struct {
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"total_pages"`
}
