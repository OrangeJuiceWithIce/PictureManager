package models

type PictureTag struct {
	PictureID uint `gorm:"primaryKey"`
	TagID     uint `gorm:"primaryKey"`
}

func (PictureTag) TableName() string {
	return "picture_tags"
}
