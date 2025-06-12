package main

import (
	"log"
	"os"

	"scrapyuk-backend/config"
	"scrapyuk-backend/internal/handlers"
	"scrapyuk-backend/internal/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(".env"); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Set default port if not specified
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Set Gin mode
	ginMode := os.Getenv("GIN_MODE")
	if ginMode == "" {
		ginMode = "debug"
	}
	gin.SetMode(ginMode)

	// Initialize database
	config.InitDatabase()
	defer config.CloseDB()

	// Run database migrations
	config.RunMigrations()

	// Seed database (only if empty)
	config.SeedDatabase()

	// Initialize MinIO
	config.InitMinIO()
	if config.IsMinIOAvailable() {
		config.SetupMinIOPolicy()
	}

	// Initialize Gin router
	router := gin.New()

	// Add middleware
	router.Use(middleware.Logger())
	router.Use(middleware.ErrorHandler())
	router.Use(middleware.SetupCORS())
	router.Use(middleware.JSONContentType())
	router.Use(middleware.SecurityHeaders())

	// Initialize handlers
	healthHandler := handlers.NewHealthHandler()
	projectHandler := handlers.NewProjectHandler()
	assetHandler := handlers.NewAssetHandler()
	sharedLinkHandler := handlers.NewSharedLinkHandler()

	// Health check routes
	router.GET("/health", healthHandler.HealthCheck)
	router.GET("/health/detailed", healthHandler.DetailedHealthCheck)

	// API routes
	api := router.Group("/api")
	{
		// Project routes
		projects := api.Group("/projects")
		{
			projects.GET("", projectHandler.GetProjects)
			projects.POST("", projectHandler.CreateProject)
			projects.GET("/:id", projectHandler.GetProject)
			projects.PUT("/:id", projectHandler.UpdateProject)
			projects.DELETE("/:id", projectHandler.DeleteProject)

			// Project asset routes
			projects.GET("/:id/assets", assetHandler.GetProjectAssets)
			projects.POST("/:id/assets", assetHandler.UploadAsset)

			// Project shared links routes
			projects.GET("/:id/shared-links", sharedLinkHandler.GetProjectSharedLinks)
		}

		// Asset routes
		assets := api.Group("/assets")
		{
			assets.DELETE("/:id", assetHandler.DeleteAsset)
			assets.GET("/*filepath", assetHandler.ServeAsset)
		}

		// Shared link routes
		sharedLinks := api.Group("/shared-links")
		{
			sharedLinks.POST("", sharedLinkHandler.CreateSharedLink)
			sharedLinks.DELETE("/:token", sharedLinkHandler.DeleteSharedLink)
		}

		// Shared project routes (buyer view)
		api.GET("/shared/:token", sharedLinkHandler.GetSharedProject)
	}

	// API documentation route (simple endpoint list)
	router.GET("/api", func(c *gin.Context) {
		endpoints := map[string]interface{}{
			"service": "ScrapYuk Backend API",
			"version": "1.0.0",
			"endpoints": map[string]interface{}{
				"health": map[string]string{
					"GET /health":          "Basic health check",
					"GET /health/detailed": "Detailed health check with database and storage status",
				},
				"projects": map[string]string{
					"GET /api/projects":                  "List all projects (paginated)",
					"POST /api/projects":                 "Create a new project",
					"GET /api/projects/:id":              "Get project by ID",
					"PUT /api/projects/:id":              "Update project by ID",
					"DELETE /api/projects/:id":           "Delete project by ID",
					"GET /api/projects/:id/assets":       "List project assets",
					"POST /api/projects/:id/assets":      "Upload asset to project",
					"GET /api/projects/:id/shared-links": "List project shared links",
				},
				"assets": map[string]string{
					"DELETE /api/assets/:id":    "Delete asset by ID",
					"GET /api/assets/*filepath": "Serve asset file",
				},
				"shared_links": map[string]string{
					"POST /api/shared-links":          "Create shared link for project",
					"DELETE /api/shared-links/:token": "Delete shared link by token",
					"GET /api/shared/:token":          "Get shared project by token (buyer view)",
				},
			},
			"notes": []string{
				"All endpoints return JSON responses",
				"File uploads accept only PNG images up to 10MB",
				"Project frame sizes: 20x20, 20x30",
				"Shared links can have optional expiration dates",
				"CORS is configured for frontend integration",
			},
		}
		c.JSON(200, endpoints)
	})

	// Start the server
	log.Printf("Starting ScrapYuk Backend API server on port %s", port)
	log.Printf("Environment: %s", ginMode)
	log.Printf("Database: %s", os.Getenv("DB_PATH"))
	if config.IsMinIOAvailable() {
		log.Printf("Storage: MinIO available at %s", os.Getenv("MINIO_ENDPOINT"))
	} else {
		log.Println("Storage: MinIO not available - file uploads disabled")
	}

	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
