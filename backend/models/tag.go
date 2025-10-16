package models

import "gorm.io/gorm"

type Tag struct {
	gorm.Model
	Name string `gorm:"unique;not null"`
	Type string `gorm:"type:enum('exif','custom');default:'custom'"`
}
