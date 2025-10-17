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
	auth.POST("/uploadpict", handlers.UploadPicture)
	auth.POST("/searchpict", handlers.SearchPicture)
	auth.GET("/getpictbyid/:id", handlers.GetPictureByID)
	auth.DELETE("/deletepict/:id", handlers.DeletePicture)
	auth.POST("/addtag", handlers.AddTag)
	auth.POST("/gettag", handlers.GetTag)
	auth.POST("/deletetag", handlers.DeleteTag)
	auth.POST("/editpict", handlers.EditPicture)

	r.Static("/uploads", "./uploads")
	r.Static("/thumbnail", "./thumbnail")
	r.Run("0.0.0.0:8080")
}
