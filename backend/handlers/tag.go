package handlers

import (
	"errors"
	"fmt"
	"picturemanager/db"
	"picturemanager/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AddTagRequest struct {
	PictureID uint   `json:"pictureID"`
	TagName   string `json:"tagName"`
	TagType   string `json:"tagType"`
}

func AddTag(c *gin.Context) {
	var data AddTagRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"error":   "expect request args",
		})
		return
	}

	userIdRaw, _ := c.Get("userId")
	userId := userIdRaw.(uint)
	//检查权限
	var count int64
	if err := db.DB.Model(&models.Picture{}).Where("user_id=? AND id=?", userId, data.PictureID).Count(&count).Error; err != nil {
		fmt.Printf("[AddTag]failed to delete tag:%v", err)
		c.JSON(500, gin.H{
			"success": false,
			"error":   "failed to check authority for picture",
		})
		return
	}

	if count == 0 {
		c.JSON(400, gin.H{
			"success": false,
			"error":   "invalid authority for picture",
		})
		return
	}

	//检查是否已有同名tag
	var tag models.Tag
	if err := db.DB.Where("name=?", data.TagName).First(&tag).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			tag = models.Tag{
				Name: data.TagName,
				Type: data.TagType,
			}
			if err := db.DB.Create(&tag).Error; err != nil {
				c.JSON(500, gin.H{
					"success": false,
					"error":   "failed to create new tag",
				})
				return
			}
		} else {
			c.JSON(500, gin.H{
				"success": false,
				"error":   "failed to create new tag",
			})
			return
		}
	}
	//关联tag和picture
	picture := models.Picture{}
	picture.ID = data.PictureID
	if err := db.DB.Model(&picture).Association("Tags").Append(&tag); err != nil {
		fmt.Printf("[AddTag]failed to asscociate tag and picture:%v", err)
		c.JSON(500, gin.H{
			"success": false,
			"error":   "failed to asscociate tag and picture",
		})
		return
	}
	c.JSON(200, gin.H{
		"success": true,
		"error":   nil,
	})
}
