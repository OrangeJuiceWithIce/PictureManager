package handlers

import (
	"fmt"
	"picturemanager/db"
	"picturemanager/models"
	"picturemanager/utils"

	"github.com/gin-gonic/gin"
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
		fmt.Printf("[AddTag]failed to delete tag:%v\n", err)
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
	//关联tag
	if err := utils.BindTag(data.PictureID, data.TagName, data.TagType); err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}
	c.JSON(200, gin.H{
		"success": true,
		"error":   nil,
	})
}

func GetTag(c *gin.Context) {
	var pictureIds []uint
	if err := c.ShouldBindJSON(&pictureIds); err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"error":   "failed to parse pictureIds",
		})
		return
	}
	var pictures []models.Picture
	if err := db.DB.Preload("Tags").Where("id in ?", pictureIds).Find(&pictures).Error; err != nil {
		fmt.Printf("[GetTag]failed to get tags:%v\n", err)
		c.JSON(500, gin.H{
			"success": false,
			"error":   "failed to get tags",
		})
		return
	}

	type Tag struct {
		ID   uint   `json:"id"`
		Name string `json:"name"`
		Type string `json:"type"`
	}

	tagMap := make(map[uint][]Tag)
	//截取tags中需要的部分
	for _, pic := range pictures {
		var temp []Tag
		for _, t := range pic.Tags {
			temp = append(temp, Tag{
				ID:   t.ID,
				Name: t.Name,
				Type: t.Type,
			})
		}
		tagMap[pic.ID] = temp
	}

	c.JSON(200, gin.H{
		"success": true,
		"tags":    tagMap,
	})
}
