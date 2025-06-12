package handlers

import (
	"net/http"

	"scrapyuk-backend/config"
	"scrapyuk-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// HealthHandler handles health check requests
type HealthHandler struct{}

// NewHealthHandler creates a new health handler
func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

// HealthCheck handles GET /health - basic health check
func (h *HealthHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, models.APIResponse{
		Success: true,
		Message: "ScrapYuk Backend API is healthy",
		Data: map[string]interface{}{
			"status":  "ok",
			"service": "scrapyuk-backend",
		},
	})
}

// DetailedHealthCheck handles GET /health/detailed - detailed health check
func (h *HealthHandler) DetailedHealthCheck(c *gin.Context) {
	healthStatus := map[string]interface{}{
		"status":   "ok",
		"service":  "scrapyuk-backend",
		"database": "ok",
		"storage":  "ok",
	}

	httpStatus := http.StatusOK

	// Check database health
	if err := config.HealthCheck(); err != nil {
		healthStatus["database"] = "error"
		healthStatus["database_error"] = err.Error()
		healthStatus["status"] = "degraded"
		httpStatus = http.StatusServiceUnavailable
	}

	// Check MinIO health
	if !config.IsMinIOAvailable() {
		healthStatus["storage"] = "unavailable"
		healthStatus["storage_error"] = "MinIO not configured or unreachable"
		if healthStatus["status"] == "ok" {
			healthStatus["status"] = "degraded"
		}
		// Don't change HTTP status for MinIO being unavailable as it's optional
	} else if err := config.HealthCheckMinIO(); err != nil {
		healthStatus["storage"] = "error"
		healthStatus["storage_error"] = err.Error()
		if healthStatus["status"] == "ok" {
			healthStatus["status"] = "degraded"
		}
	}

	c.JSON(httpStatus, models.APIResponse{
		Success: httpStatus == http.StatusOK,
		Message: "Health check completed",
		Data:    healthStatus,
	})
}
