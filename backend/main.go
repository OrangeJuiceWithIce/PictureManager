package main

import (
	"log"
	"picturemanager/db"
	"picturemanager/handlers"
	"picturemanager/models"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db.InitDB()
	if err := db.DB.AutoMigrate(&models.User{}); err != nil {
		log.Fatalf("[main]failed to automigrate User model")
	}

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	r.GET("/verify-token", handlers.VerifyToken)
	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)

	r.Run()
}
