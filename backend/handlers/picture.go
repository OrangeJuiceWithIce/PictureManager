package handlers

import (
	"fmt"
	"path/filepath"
	"picturemanager/db"
	"picturemanager/models"

	"github.com/gin-gonic/gin"
)

func UploadPicture(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"error":   "failed to parse file",
		})
		return
	}
	ext := filepath.Ext(file.Filename)
	switch ext {
	case ".jpg", ".png", ".gif":
	default:
		c.JSON(400, gin.H{
			"succeess": false,
			"error":    "unmatched file type,expect .jpg .png .gif",
		})
		return
	}
	savePath := filepath.Join("uploads", file.Filename)
	//从上下文中获取userId
	userIdRaw, _ := c.Get("userId")
	userId, _ := userIdRaw.(uint)

	newPicture := &models.Picture{
		UserID:      userId,
		PictureName: file.Filename,
		PicturePath: savePath,
	}
	if err := db.DB.Create(&newPicture).Error; err != nil {
		fmt.Printf("[UploadPicture]insert newPicture failed")
		c.JSON(500, gin.H{
			"success": false,
			"error":   "failed to insert data into DB",
		})
		return
	}
	if err = c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"error":   "failed to save file",
		})
		return
	}
	c.JSON(200, gin.H{
		"success": true,
		"error":   nil,
	})
}
