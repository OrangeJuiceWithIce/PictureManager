package utils

import (
	"fmt"
	"math"
	"mime/multipart"
	"picturemanager/models"

	"github.com/rwcarlsen/goexif/exif"
)

func ParseExif(file multipart.File) ([]models.Tag, error) {
	exifmeta, err := exif.Decode(file)
	if err != nil {
		return nil, err
	}
	var tags []models.Tag
	//提取时间信息
	if t, err := exifmeta.DateTime(); err == nil {
		tags = append(tags, models.Tag{
			Name: t.Format("2006-01"),
			Type: "exif",
		})
	}
	//经纬度
	if lat, long, err := exifmeta.LatLong(); err == nil {
		if !math.IsNaN(lat) {
			tags = append(tags, models.Tag{
				Name: fmt.Sprintf("Lat:%.2f", lat),
				Type: "exif",
			})
		}
		if !math.IsNaN(long) {
			tags = append(tags, models.Tag{
				Name: fmt.Sprintf("long:%.2f", long),
				Type: "exif",
			})
		}
	}
	//像素
	if w, err := exifmeta.Get(exif.PixelXDimension); err == nil {
		if h, err := exifmeta.Get(exif.PixelYDimension); err == nil {
			wInt, _ := w.Int(0)
			hInt, _ := h.Int(0)
			tags = append(tags, models.Tag{
				Name: fmt.Sprintf("%dx%d", wInt, hInt),
				Type: "exif",
			})
		}
	}

	return tags, nil
}

func BindExifTag(pictureID uint, file multipart.File) error {
	tags, err := ParseExif(file)
	if err != nil {
		return err
	}

	for _, tag := range tags {
		if err := BindTag(pictureID, tag.Name, tag.Type); err != nil {
			return err
		}
	}
	return nil
}
