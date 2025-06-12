package config

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var MinIOClient *minio.Client
var MinioBucketName string

// InitMinIO initializes the MinIO client and creates bucket if needed
func InitMinIO() {
	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKeyID := os.Getenv("MINIO_ACCESS_KEY")
	secretAccessKey := os.Getenv("MINIO_SECRET_KEY")
	useSSL := os.Getenv("MINIO_USE_SSL") == "true"
	bucketName := os.Getenv("MINIO_BUCKET_NAME")

	// Set defaults if not provided
	if endpoint == "" {
		endpoint = "localhost:9000"
	}
	if accessKeyID == "" {
		accessKeyID = "minioadmin"
	}
	if secretAccessKey == "" {
		secretAccessKey = "minioadmin"
	}
	if bucketName == "" {
		bucketName = "scrapyuk-assets"
	}

	MinioBucketName = bucketName

	// Initialize MinIO client
	var err error
	MinIOClient, err = minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Printf("Failed to initialize MinIO client: %v", err)
		log.Println("MinIO will be unavailable - file uploads will not work")
		return
	}

	// Test connection and create bucket if needed
	ctx := context.Background()

	// Check if bucket exists
	exists, err := MinIOClient.BucketExists(ctx, bucketName)
	if err != nil {
		log.Printf("Error checking bucket existence: %v", err)
		log.Println("MinIO will be unavailable - file uploads will not work")
		MinIOClient = nil
		return
	}

	// Create bucket if it doesn't exist
	if !exists {
		err = MinIOClient.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		if err != nil {
			log.Printf("Error creating bucket: %v", err)
			log.Println("MinIO will be unavailable - file uploads will not work")
			MinIOClient = nil
			return
		}
		log.Printf("Created bucket: %s", bucketName)
	}

	log.Printf("MinIO client initialized successfully (endpoint: %s, bucket: %s)", endpoint, bucketName)
}

// GetMinIOClient returns the MinIO client instance
func GetMinIOClient() *minio.Client {
	return MinIOClient
}

// GetBucketName returns the configured bucket name
func GetBucketName() string {
	return MinioBucketName
}

// IsMinIOAvailable checks if MinIO is available
func IsMinIOAvailable() bool {
	return MinIOClient != nil
}

// HealthCheckMinIO performs a health check on MinIO
func HealthCheckMinIO() error {
	if MinIOClient == nil {
		return fmt.Errorf("MinIO client not initialized")
	}

	ctx := context.Background()

	// Check if bucket exists as a simple health check
	exists, err := MinIOClient.BucketExists(ctx, MinioBucketName)
	if err != nil {
		return fmt.Errorf("MinIO health check failed: %w", err)
	}

	if !exists {
		return fmt.Errorf("bucket %s does not exist", MinioBucketName)
	}

	return nil
}

// SetupMinIOPolicy sets up a public read policy for the assets bucket
func SetupMinIOPolicy() {
	if MinIOClient == nil {
		log.Println("MinIO client not available, skipping policy setup")
		return
	}

	ctx := context.Background()

	// Define a policy that allows public read access to objects in the bucket
	policy := fmt.Sprintf(`{
		"Version": "2012-10-17",
		"Statement": [
			{
				"Effect": "Allow",
				"Principal": "*",
				"Action": ["s3:GetObject"],
				"Resource": ["arn:aws:s3:::%s/*"]
			}
		]
	}`, MinioBucketName)

	err := MinIOClient.SetBucketPolicy(ctx, MinioBucketName, policy)
	if err != nil {
		log.Printf("Warning: Failed to set bucket policy: %v", err)
		log.Println("Assets may not be publicly accessible")
	} else {
		log.Println("Bucket policy set successfully - assets are publicly readable")
	}
}
