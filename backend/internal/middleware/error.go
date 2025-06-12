package middleware

import (
	"fmt"
	"log"
	"net/http"

	"scrapyuk-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// ErrorHandler is a middleware that handles panics and errors
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("Panic recovered: %v", err)

				response := models.APIResponse{
					Success: false,
					Message: "Internal server error",
					Error:   "An unexpected error occurred",
				}

				c.JSON(http.StatusInternalServerError, response)
				c.Abort()
			}
		}()

		c.Next()
	}
}

// Logger is a middleware that logs requests
func Logger() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("%s - [%s] \"%s %s %s %d %s \"%s\" %s\"\n",
			param.ClientIP,
			param.TimeStamp.Format("02/Jan/2006:15:04:05 -0700"),
			param.Method,
			param.Path,
			param.Request.Proto,
			param.StatusCode,
			param.Latency,
			param.Request.UserAgent(),
			param.ErrorMessage,
		)
	})
}

// JSONContentType ensures the response content type is application/json
func JSONContentType() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Content-Type", "application/json")
		c.Next()
	}
}

// SecurityHeaders adds basic security headers
func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Next()
	}
}
