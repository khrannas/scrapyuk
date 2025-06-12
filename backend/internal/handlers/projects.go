package handlers

import (
	"net/http"
	"strconv"

	"scrapyuk-backend/config"
	"scrapyuk-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// ProjectHandler handles project-related HTTP requests
type ProjectHandler struct{}

// NewProjectHandler creates a new project handler
func NewProjectHandler() *ProjectHandler {
	return &ProjectHandler{}
}

// GetProjects handles GET /api/projects - list all projects with pagination
func (h *ProjectHandler) GetProjects(c *gin.Context) {
	db := config.GetDB()

	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit

	var projects []models.Project
	var total int64

	// Get total count
	if err := db.Model(&models.Project{}).Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Failed to count projects",
			Error:   err.Error(),
		})
		return
	}

	// Get projects with pagination
	if err := db.Offset(offset).Limit(limit).Order("created_at DESC").Find(&projects).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Failed to fetch projects",
			Error:   err.Error(),
		})
		return
	}

	totalPages := int((total + int64(limit) - 1) / int64(limit))

	response := models.PaginatedResponse{
		Success: true,
		Message: "Projects fetched successfully",
		Data:    projects,
		Meta: models.PaginationMeta{
			Page:       page,
			Limit:      limit,
			Total:      total,
			TotalPages: totalPages,
		},
	}

	c.JSON(http.StatusOK, response)
}

// GetProject handles GET /api/projects/:id - get a single project
func (h *ProjectHandler) GetProject(c *gin.Context) {
	db := config.GetDB()

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid project ID",
			Error:   "Project ID must be a valid number",
		})
		return
	}

	var project models.Project
	if err := db.Preload("Assets").Preload("Objects").First(&project, id).Error; err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Message: "Project not found",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Project fetched successfully",
		Data:    project,
	})
}

// CreateProject handles POST /api/projects - create a new project
func (h *ProjectHandler) CreateProject(c *gin.Context) {
	db := config.GetDB()

	var req models.ProjectCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid request data",
			Error:   err.Error(),
		})
		return
	}

	project := models.Project{
		Title:       req.Title,
		FrameSize:   req.FrameSize,
		ProjectData: req.ProjectData,
	}

	if err := db.Create(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Failed to create project",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, models.APIResponse{
		Success: true,
		Message: "Project created successfully",
		Data:    project,
	})
}

// UpdateProject handles PUT /api/projects/:id - update a project
func (h *ProjectHandler) UpdateProject(c *gin.Context) {
	db := config.GetDB()

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid project ID",
			Error:   "Project ID must be a valid number",
		})
		return
	}

	var req models.ProjectUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid request data",
			Error:   err.Error(),
		})
		return
	}

	var project models.Project
	if err := db.First(&project, id).Error; err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Message: "Project not found",
			Error:   err.Error(),
		})
		return
	}

	// Update fields if provided
	if req.Title != nil {
		project.Title = *req.Title
	}
	if req.FrameSize != nil {
		project.FrameSize = *req.FrameSize
	}
	if req.ProjectData != nil {
		project.ProjectData = req.ProjectData
	}

	if err := db.Save(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Failed to update project",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Project updated successfully",
		Data:    project,
	})
}

// DeleteProject handles DELETE /api/projects/:id - delete a project
func (h *ProjectHandler) DeleteProject(c *gin.Context) {
	db := config.GetDB()

	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Success: false,
			Message: "Invalid project ID",
			Error:   "Project ID must be a valid number",
		})
		return
	}

	var project models.Project
	if err := db.First(&project, id).Error; err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Success: false,
			Message: "Project not found",
			Error:   err.Error(),
		})
		return
	}

	// Delete the project (cascade will handle related records)
	if err := db.Delete(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Success: false,
			Message: "Failed to delete project",
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "Project deleted successfully",
	})
}
