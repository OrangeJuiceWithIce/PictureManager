package utils

import (
	"errors"
	"fmt"
	"picturemanager/db"
	"picturemanager/models"

	"gorm.io/gorm"
)

func BindTag(pictureId uint, tagName string) error {
	//检查是否已有同类型tag
	var tag models.Tag
	if err := db.DB.Where("name=?", tagName).First(&tag).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			tag = models.Tag{
				Name: tagName,
			}
			if err := db.DB.Create(&tag).Error; err != nil {
				return fmt.Errorf("failed to create new tag")
			}
		} else {
			return fmt.Errorf("failed to query tag")
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
