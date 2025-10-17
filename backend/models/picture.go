package models

import "gorm.io/gorm"

type Picture struct {
	gorm.Model
	UserID        uint   `gorm:"not null"`
	User          User   `gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`
	PictureName   string `gorm:"varchar(255);not null"`
	PicturePath   string `gorm:"varchar(255);not null"`
	ThumbnailPath string `gorm:"varchar(255);not null"`
	Tags          []Tag  `gorm:"many2many:picture_tags;constraint:OnDelete:CASCADE"`
}
