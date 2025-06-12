package handlers

import (
	"net/http"
	"strconv"
	"time"

	"scrapyuk-backend/config"
	"scrapyuk-backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// SharedLinkHandler handles shared link-related HTTP requests
type SharedLinkHandler struct{}

// NewSharedLinkHandler creates a new shared link handler
func NewSharedLinkHandler() *SharedLinkHandler {
	return &SharedLinkHandler{}
}

// CreateSharedLink handles POST /api/shared-links - create a shared link for a project
func (h *SharedLinkHandler) CreateSharedLink(c *gin.Context) {
	db := config.GetDB()

	projectID, err := strconv.ParseUint(c.Query("project_id"), 10, 32)
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

	var req models.SharedLinkCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid request data",
			Error:   err.Error(),
		})
		return
	}

	// Generate unique token
	token := uuid.New().String()

	// Create shared link
	sharedLink := models.SharedLink{
		ProjectID: uint(projectID),
		Token:     token,
		ExpiresAt: req.ExpiresAt,
	}

	if err := db.Create(&sharedLink).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Failed to create shared link",
			Error:   err.Error(),
		})
		return
	}

	// Load the project data for the response
	db.Preload("Project").First(&sharedLink, sharedLink.ID)

	c.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Message: "Shared link created successfully",
		Data:    sharedLink,
	})
}

// GetSharedProject handles GET /api/shared/:token - get project by shared token
func (h *SharedLinkHandler) GetSharedProject(c *gin.Context) {
	db := config.GetDB()

	token := c.Param("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid token",
			Error:   "Token cannot be empty",
		})
		return
	}

	// Find shared link by token
	var sharedLink models.SharedLink
	if err := db.Where("token = ?", token).First(&sharedLink).Error; err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Message: "Shared link not found",
			Error:   "Invalid or expired token",
		})
		return
	}

	// Check if link has expired
	if sharedLink.ExpiresAt != nil && sharedLink.ExpiresAt.Before(time.Now()) {
		c.JSON(http.StatusGone, models.APIResponse{
			Success: false,
			Message: "Shared link has expired",
			Error:   "This link is no longer valid",
		})
		return
	}

	// Get the project with related data
	var project models.Project
	if err := db.Preload("Assets").Preload("Objects").First(&project, sharedLink.ProjectID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Message: "Project not found",
			Error:   err.Error(),
		})
		return
	}

	// Return project data for buyer view
	response := map[string]interface{}{
		"project":     project,
		"shared_link": sharedLink,
		"is_shared":   true,
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Shared project fetched successfully",
		Data:    response,
	})
}

// GetProjectSharedLinks handles GET /api/projects/:id/shared-links - get all shared links for a project
func (h *SharedLinkHandler) GetProjectSharedLinks(c *gin.Context) {
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

	// Get shared links for the project
	var sharedLinks []models.SharedLink
	if err := db.Where("project_id = ?", projectID).Order("created_at DESC").Find(&sharedLinks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Failed to fetch shared links",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Shared links fetched successfully",
		Data:    sharedLinks,
	})
}

// DeleteSharedLink handles DELETE /api/shared-links/:token - delete a shared link
func (h *SharedLinkHandler) DeleteSharedLink(c *gin.Context) {
	db := config.GetDB()

	token := c.Param("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid token",
			Error:   "Token cannot be empty",
		})
		return
	}

	// Find and delete the shared link
	var sharedLink models.SharedLink
	if err := db.Where("token = ?", token).First(&sharedLink).Error; err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Message: "Shared link not found",
			Error:   err.Error(),
		})
		return
	}

	if err := db.Delete(&sharedLink).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Failed to delete shared link",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Shared link deleted successfully",
	})
}

// CleanupExpiredLinks handles cleanup of expired shared links (can be called via cron)
func (h *SharedLinkHandler) CleanupExpiredLinks() error {
	db := config.GetDB()

	result := db.Where("expires_at IS NOT NULL AND expires_at < ?", time.Now()).Delete(&models.SharedLink{})
	if result.Error != nil {
		return result.Error
	}

	// Log how many expired links were deleted
	if result.RowsAffected > 0 {
		println("Cleaned up", result.RowsAffected, "expired shared links")
	}

	return nil
}
