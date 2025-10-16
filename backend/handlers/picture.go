package handlers

import (
	"fmt"
	"path/filepath"
	"picturemanager/db"
	"picturemanager/models"
	"picturemanager/utils"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func UploadPicture(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"error":   "failed to parse form",
		})
		return
	}
	files := form.File["files"]
	if len(files) == 0 {
		c.JSON(400, gin.H{
			"success": false,
			"error":   "no picture uploaded",
		})
	}
	for _, file := range files {
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
		uniqueName := fmt.Sprintf("%s%s", uuid.New(), ext)
		savePath := filepath.Join("uploads", uniqueName)
		//从上下文中获取userId
		userIdRaw, _ := c.Get("userId")
		userId, _ := userIdRaw.(uint)

		newPicture := &models.Picture{
			UserID:      userId,
			PictureName: file.Filename,
			PicturePath: savePath,
		}
		if err := db.DB.Create(&newPicture).Error; err != nil {
			fmt.Printf("[UploadPicture]insert newPicture failed\n")
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
		//如果有exif,解析并绑定ExifTag
		if ext == ".jpg" || ext == ".jpeg" {
			f, err := file.Open()
			if err != nil {
				fmt.Printf("[UploadPicture]failed to open file to get exif:%v\n", err)
				continue
			}
			if err = utils.BindExifTag(newPicture.ID, f); err != nil {
				fmt.Printf("[UploadPicture]failed to bind exif tags for %s: %v\n", file.Filename, err)
			}
			f.Close()
		}
	}
	c.JSON(200, gin.H{
		"success": true,
		"error":   nil,
	})
}

func GetPicture(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"error":   "query'limit' should be number",
		})
		return
	}
	//只返回该用户照片的ID,PicturePath字段
	type Picture struct {
		ID   uint   `json:"id"`
		Path string `json:"path"`
	}

	userIdRaw, _ := c.Get("userId")
	userId, _ := userIdRaw.(uint)

	var pictures []Picture
	if err := db.DB.Model(&models.Picture{}).Select("id , picture_path as path").Where("user_id = ?", userId).Order("updated_at desc").Limit(limit).Find(&pictures).Error; err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"error":   "failed to search pictures in DB",
		})
		return
	}
	c.JSON(200, gin.H{
		"success":  true,
		"error":    nil,
		"pictures": pictures,
	})
}

func DeletePicture(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"error":   "expect uint type id",
		})
		return
	}

	userIdRaw, _ := c.Get("userId")
	userId, _ := userIdRaw.(uint)

	result := db.DB.Where("id = ? AND user_id = ?", id, userId).Delete(&models.Picture{})
	if result.Error != nil {
		c.JSON(500, gin.H{
			"success": false,
			"error":   "failed to delete",
		})
		return
	} else if result.RowsAffected == 0 {
		c.JSON(400, gin.H{
			"success": false,
			"error":   "failed to delete picture:not exist or unauthorized",
		})
		return
	} else {
		c.JSON(200, gin.H{
			"success": true,
			"error":   nil,
		})
	}
}
