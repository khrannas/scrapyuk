package config

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"scrapyuk-backend/internal/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// InitDatabase initializes the SQLite database connection
func InitDatabase() {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./data/scrapyuk.db"
	}

	// Ensure the data directory exists
	dir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		log.Fatal("Failed to create data directory:", err)
	}

	// Configure GORM logger
	var gormLogger logger.Interface
	if os.Getenv("GIN_MODE") == "release" {
		gormLogger = logger.Default.LogMode(logger.Silent)
	} else {
		gormLogger = logger.Default.LogMode(logger.Info)
	}

	// Open SQLite database
	var err error
	DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: gormLogger,
	})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Configure SQLite connection
	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("Failed to get underlying sql.DB:", err)
	}

	// SQLite specific configurations
	sqlDB.SetMaxOpenConns(1) // SQLite only allows one writer at a time
	sqlDB.SetMaxIdleConns(1)

	// Enable foreign key constraints
	DB.Exec("PRAGMA foreign_keys = ON")

	log.Println("Database connected successfully")
}

// RunMigrations runs all database migrations
func RunMigrations() {
	log.Println("Running database migrations...")

	// Auto-migrate all models
	err := DB.AutoMigrate(
		&models.Project{},
		&models.Asset{},
		&models.Object{},
		&models.SharedLink{},
	)
	if err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	log.Println("Migrations completed successfully")
}

// SeedDatabase seeds the database with initial data
func SeedDatabase() {
	log.Println("Seeding database with initial data...")

	// Check if we already have data
	var projectCount int64
	DB.Model(&models.Project{}).Count(&projectCount)

	if projectCount > 0 {
		log.Println("Database already contains data, skipping seed")
		return
	}

	// Create sample projects for development
	sampleProjects := []models.Project{
		{
			Title:     "Sample Scrapbook 20x20",
			FrameSize: "20x20",
			ProjectData: []byte(`{
				"version": "1.0",
				"settings": {
					"backgroundColor": "#ffffff",
					"lighting": {
						"enabled": true,
						"intensity": 1.0
					}
				},
				"objects": []
			}`),
		},
		{
			Title:     "Demo Project 20x30",
			FrameSize: "20x30",
			ProjectData: []byte(`{
				"version": "1.0",
				"settings": {
					"backgroundColor": "#f5f5f5",
					"lighting": {
						"enabled": true,
						"intensity": 0.8
					}
				},
				"objects": []
			}`),
		},
	}

	for _, project := range sampleProjects {
		if err := DB.Create(&project).Error; err != nil {
			log.Printf("Failed to create sample project: %v", err)
		}
	}

	log.Println("Database seeding completed")
}

// GetDB returns the database instance
func GetDB() *gorm.DB {
	return DB
}

// CloseDB closes the database connection
func CloseDB() {
	if DB != nil {
		sqlDB, err := DB.DB()
		if err != nil {
			log.Printf("Error getting underlying sql.DB: %v", err)
			return
		}

		if err := sqlDB.Close(); err != nil {
			log.Printf("Error closing database: %v", err)
		} else {
			log.Println("Database connection closed")
		}
	}
}

// HealthCheck checks if the database is accessible
func HealthCheck() error {
	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}

	if err := sqlDB.Ping(); err != nil {
		return fmt.Errorf("database ping failed: %w", err)
	}

	return nil
}
