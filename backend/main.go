package main

import (
	"picturemanager/db"
	"picturemanager/handlers"
	"picturemanager/middlewares"

	"github.com/gin-gonic/gin"
)

func main() {
	db.InitDB()

	r := gin.Default()

	r.Use(middlewares.CORSMiddleware())

	//公共接口
	r.GET("/verify-token", handlers.VerifyToken)
	r.POST("/register", handlers.Register)
	r.POST("/login", handlers.Login)

	//需要检验token的auth接口
	auth := r.Group("/")
	auth.Use(middlewares.AuthMiddleware())
	auth.POST("/upload", handlers.UploadPicture)
	r.Run()
}
