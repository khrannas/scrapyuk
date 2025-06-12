package handlers

import (
	"context"
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"scrapyuk-backend/config"
	"scrapyuk-backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
)

// AssetHandler handles asset-related HTTP requests
type AssetHandler struct{}

// NewAssetHandler creates a new asset handler
func NewAssetHandler() *AssetHandler {
	return &AssetHandler{}
}

// GetProjectAssets handles GET /api/projects/:id/assets - list project assets
func (h *AssetHandler) GetProjectAssets(c *gin.Context) {
	db := config.GetDB()

	projectID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid project ID",
			Error:   "Project ID must be a valid number",
		})
		return
	}

	// Verify project exists
	var project models.Project
	if err := db.First(&project, projectID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Message: "Project not found",
			Error:   err.Error(),
		})
		return
	}

	// Get project assets
	var assets []models.Asset
	if err := db.Where("project_id = ?", projectID).Order("uploaded_at DESC").Find(&assets).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Failed to fetch assets",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Assets fetched successfully",
		Data:    assets,
	})
}

// UploadAsset handles POST /api/projects/:id/assets - upload asset to project
func (h *AssetHandler) UploadAsset(c *gin.Context) {
	db := config.GetDB()

	projectID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid project ID",
			Error:   "Project ID must be a valid number",
		})
		return
	}

	// Verify project exists
	var project models.Project
	if err := db.First(&project, projectID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Message: "Project not found",
			Error:   err.Error(),
		})
		return
	}

	// Check if MinIO is available
	if !config.IsMinIOAvailable() {
		c.JSON(http.StatusServiceUnavailable, models.APIResponse{
			Success: false,
			Message: "File storage service unavailable",
			Error:   "MinIO storage is not configured or unavailable",
		})
		return
	}

	// Get uploaded file
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "No file uploaded",
			Error:   err.Error(),
		})
		return
	}
	defer file.Close()

	// Validate file type (only PNG allowed)
	filename := header.Filename
	if !isPNGFile(filename) {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid file type",
			Error:   "Only PNG files are allowed",
		})
		return
	}

	// Validate file size (max 10MB)
	if header.Size > 10*1024*1024 {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "File too large",
			Error:   "File size must be less than 10MB",
		})
		return
	}

	// Generate unique filename
	uniqueID := uuid.New().String()
	ext := filepath.Ext(filename)
	objectName := fmt.Sprintf("projects/%d/assets/%s%s", projectID, uniqueID, ext)

	// Upload to MinIO
	minioClient := config.GetMinIOClient()
	bucketName := config.GetBucketName()

	ctx := context.Background()
	_, err = minioClient.PutObject(ctx, bucketName, objectName, file, header.Size, minio.PutObjectOptions{
		ContentType: "image/png",
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Failed to upload file",
			Error:   err.Error(),
		})
		return
	}

	// Save asset record to database
	asset := models.Asset{
		ProjectID:  uint(projectID),
		Filename:   filename,
		FilePath:   objectName,
		UploadedAt: time.Now(),
	}

	if err := db.Create(&asset).Error; err != nil {
		// If database save fails, try to delete the uploaded file
		minioClient.RemoveObject(ctx, bucketName, objectName, minio.RemoveObjectOptions{})

		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Failed to save asset record",
			Error:   err.Error(),
		})
		return
	}

	// Generate file URL for response
	asset.FilePath = fmt.Sprintf("/api/assets/%s", objectName)

	c.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Message: "Asset uploaded successfully",
		Data:    asset,
	})
}

// DeleteAsset handles DELETE /api/assets/:id - delete an asset
func (h *AssetHandler) DeleteAsset(c *gin.Context) {
	db := config.GetDB()

	assetID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid asset ID",
			Error:   "Asset ID must be a valid number",
		})
		return
	}

	var asset models.Asset
	if err := db.First(&asset, assetID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Message: "Asset not found",
			Error:   err.Error(),
		})
		return
	}

	// Delete from MinIO if available
	if config.IsMinIOAvailable() {
		minioClient := config.GetMinIOClient()
		bucketName := config.GetBucketName()
		ctx := context.Background()

		err = minioClient.RemoveObject(ctx, bucketName, asset.FilePath, minio.RemoveObjectOptions{})
		if err != nil {
			// Log error but continue with database deletion
			fmt.Printf("Failed to delete file from MinIO: %v\n", err)
		}
	}

	// Delete from database
	if err := db.Delete(&asset).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Failed to delete asset",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Asset deleted successfully",
	})
}

// ServeAsset handles GET /api/assets/* - serve asset files
func (h *AssetHandler) ServeAsset(c *gin.Context) {
	if !config.IsMinIOAvailable() {
		c.JSON(http.StatusServiceUnavailable, models.APIResponse{
			Success: false,
			Message: "File storage service unavailable",
		})
		return
	}

	objectName := c.Param("filepath")
	if objectName == "" {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid file path",
		})
		return
	}

	minioClient := config.GetMinIOClient()
	bucketName := config.GetBucketName()
	ctx := context.Background()

	// Get object from MinIO
	object, err := minioClient.GetObject(ctx, bucketName, objectName, minio.GetObjectOptions{})
	if err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Message: "File not found",
			Error:   err.Error(),
		})
		return
	}
	defer object.Close()

	// Get object info for content type and size
	objectInfo, err := object.Stat()
	if err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Message: "File not found",
			Error:   err.Error(),
		})
		return
	}

	// Set appropriate headers
	c.Header("Content-Type", objectInfo.ContentType)
	c.Header("Content-Length", strconv.FormatInt(objectInfo.Size, 10))
	c.Header("Cache-Control", "public, max-age=3600")

	// Stream file content
	c.DataFromReader(http.StatusOK, objectInfo.Size, objectInfo.ContentType, object, nil)
}

// isPNGFile checks if the filename has a PNG extension
func isPNGFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	return ext == ".png"
}
