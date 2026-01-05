package utils

import (
	"errors"
	"fmt"
	"picturemanager/db"
	"picturemanager/models"
	"picturemanager/redis"
	"strconv"
	"time"

	"gorm.io/gorm"
)

func BindTag(pictureId uint, tagName string) error {
	//检查是否已有同类型tag
	var tag models.Tag
	tagIdStr, err := redis.GetCache("tag:" + tagName)
	if err == nil {
		if id, convErr := strconv.ParseUint(tagIdStr, 10, 64); convErr == nil {
			tag.ID = uint(id)
			tag.Name = tagName
		}
	} else {
		if err := db.DB.Where("name=?", tagName).First(&tag).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				//使用分布式锁创建一个新标签
				err := redis.WithLock(
					fmt.Sprintf("CreateTag:%s", tagName),
					5*time.Second,
					func() error {
						tag = models.Tag{
							Name: tagName,
						}
						if err := db.DB.Create(&tag).Error; err != nil {
							return fmt.Errorf("failed to create new tag")
						}
						return redis.SetCache("tag:"+tagName, strconv.FormatUint(uint64(tag.ID), 10), time.Hour*24)
					},
				)
				if err != nil {
					return err
				}
			} else {
				return fmt.Errorf("failed to query tag")
			}
		} else {
			redis.SetCache("tag:"+tagName, strconv.FormatUint(uint64(tag.ID), 10), time.Hour*24)
		}
	}
	//关联tag和picture
	picture := models.Picture{}
	picture.ID = pictureId
	if err := db.DB.Model(&picture).Association("Tags").Append(&tag); err != nil {
		return fmt.Errorf("failed to asscociate tag and picture")
	}

	return nil
}
