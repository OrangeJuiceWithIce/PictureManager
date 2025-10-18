package handlers

import (
	"fmt"
	"image"
	"path/filepath"
	"picturemanager/db"
	"picturemanager/models"
	"picturemanager/utils"
	"strconv"

	"github.com/disintegration/imaging"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// 只返回该用户照片的ID,PicturePath,Public字段
type Picture struct {
	ID       uint   `json:"id"`
	Public   bool   `json:"public"`
	Path     string `json:"path"`
	Username string `json:"username,omitempty"`
}

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
		return
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
		thumbnailPath := filepath.Join("thumbnail", uniqueName)
		//从上下文中获取userId
		userIdRaw, _ := c.Get("userId")
		userId, _ := userIdRaw.(uint)

		newPicture := &models.Picture{
			UserID:        userId,
			PictureName:   file.Filename,
			PicturePath:   savePath,
			ThumbnailPath: thumbnailPath,
		}
		//插入数据
		if err := db.DB.Create(&newPicture).Error; err != nil {
			fmt.Printf("[UploadPicture]insert newPicture failed\n")
			c.JSON(500, gin.H{
				"success": false,
				"error":   "failed to insert data into DB",
			})
			return
		}
		//保存图片
		if err = c.SaveUploadedFile(file, savePath); err != nil {
			c.JSON(500, gin.H{
				"success": false,
				"error":   "failed to save file",
			})
			return
		}

		srcImg, err := imaging.Open(savePath)
		if err != nil {
			fmt.Printf("[UploadPicture]failed to open image for thumbnail production:%v\n", err)
		} else {
			thumbImg := imaging.Thumbnail(srcImg, 200, 200, imaging.Lanczos)
			if err := imaging.Save(thumbImg, thumbnailPath); err != nil {
				fmt.Printf("[UploadPicture]failed to save thumbnail:%v\n", err)
			}
		}
		//如果有exif,解析并绑定ExifTag
		if ext == ".jpg" || ext == ".jpeg" {
			f, err := file.Open()
			if err != nil {
				fmt.Printf("[UploadPicture]failed to open file to get exif:%v\n", err)
				continue
			}
			defer f.Close()
			if err = utils.BindExifTag(newPicture.ID, f); err != nil {
				fmt.Printf("[UploadPicture]failed to bind exif tags for %s: %v\n", file.Filename, err)
			}
		}
	}
	c.JSON(200, gin.H{
		"success": true,
	})
}

type SearchPictureRequest struct {
	Offset       int      `json:"offset"`
	Limit        int      `json:"limit"`
	Time         string   `json:"time"`
	Public       string   `json:"public"`
	SelectedTags []string `json:"selectedTags"`
}

func SearchPicture(c *gin.Context) {
	var data SearchPictureRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"error":   "invalid request body",
		})
		return
	}

	if data.Limit <= 0 {
		data.Limit = 20
	}
	if data.Offset < 0 {
		data.Offset = 0
	}

	userIdRaw, _ := c.Get("userId")
	userId, _ := userIdRaw.(uint)

	var pictures []Picture
	query := db.DB.Model(&models.Picture{}).Select("pictures.id , pictures.public , pictures.thumbnail_path as path").Where("user_id = ?", userId)
	//匹配公开程度
	if data.Public != "" && data.Public != "all" {
		switch data.Public {
		case "public":
			query = query.Where("public=true")
		case "private":
			query = query.Where("public=false")
		default:
			c.JSON(400, gin.H{
				"success": false,
				"error":   "invalid visibility filter",
			})
			return
		}
	}

	//匹配时间
	if data.Time != "" && data.Time != "all" {
		startTime, err := utils.ConverTimeFilter(data.Time)
		if err != nil {
			c.JSON(400, gin.H{
				"success": false,
				"error":   "invalid time filter",
			})
			return
		}
		query = query.Where("pictures.created_at>=?", startTime)
	}
	//拥有所有标签
	filteredTags := utils.FilterEmptyString(data.SelectedTags)
	if len(filteredTags) > 0 {
		query = query.
			Joins("JOIN picture_tags ON picture_tags.picture_id = pictures.id").
			Joins("JOIN tags ON picture_tags.tag_id = tags.id").
			Where("tags.name IN ?", filteredTags).
			Group("pictures.id").
			Having("COUNT(DISTINCT tags.id)=?", len(filteredTags))
	}
	//分页查询
	query = query.Order("pictures.updated_at desc").Limit(data.Limit).Offset(data.Offset)
	//执行查询
	if err := query.Find(&pictures).Error; err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"error":   "failed to search pictures in DB",
		})
		return
	}
	c.JSON(200, gin.H{
		"success":  true,
		"pictures": pictures,
	})
}

func GetPictureByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"error":   "invalid id",
		})
		return
	}

	userIdRaw, _ := c.Get("userId")
	userId, _ := userIdRaw.(uint)

	var picture Picture
	err = db.DB.
		Model(&models.Picture{}).
		Select("id,public,picture_path as path").
		Where("id = ? AND user_id=?", id, userId).
		First(&picture).Error
	if err != nil {
		c.JSON(404, gin.H{
			"success": false,
			"error":   "picture not found",
		})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"picture": picture,
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
		})
	}
}

type EditPictureRequest struct {
	PictureId uint `json:"pictureId"`
	Rotate    int  `json:"rotate"`
	Grayscale bool `json:"grayscale"`
	Crop      *struct {
		X      int `json:"x"`
		Y      int `json:"y"`
		Width  int `json:"width"`
		Height int `json:"height"`
	} `json:"crop"`
}

func EditPicture(c *gin.Context) {
	var req EditPictureRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"error":   "invalid body",
		})
		return
	}

	userIdRaw, _ := c.Get("userId")
	userId := userIdRaw.(uint)

	var pic models.Picture
	if err := db.DB.Where("id = ? AND user_id = ?", req.PictureId, userId).First(&pic).Error; err != nil {
		c.JSON(404, gin.H{
			"success": false,
			"error":   "picture not found",
		})
		return
	}

	src, err := imaging.Open(pic.PicturePath)
	if err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"error":   "failed to open image",
		})
		return
	}

	edited := src

	if req.Crop != nil {
		rect := image.Rect(req.Crop.X, req.Crop.Y, req.Crop.X+req.Crop.Width, req.Crop.Y+req.Crop.Height)
		edited = imaging.Crop(edited, rect)
	}

	if req.Rotate != 0 {
		edited = imaging.Rotate(edited, float64(req.Rotate), nil)
	}

	if req.Grayscale {
		edited = imaging.Grayscale(edited)
	}

	uniqueName := fmt.Sprintf("%s_edited.jpg", uuid.New())
	savePath := filepath.Join("uploads", uniqueName)
	thumbPath := filepath.Join("thumbnail", uniqueName)

	if err := imaging.Save(edited, savePath); err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"error":   "failed to save edited image",
		})
		return
	}

	thumb := imaging.Thumbnail(edited, 200, 200, imaging.Lanczos)
	_ = imaging.Save(thumb, thumbPath)

	newPic := models.Picture{
		UserID:        userId,
		PictureName:   "edited_" + pic.PictureName,
		PicturePath:   savePath,
		ThumbnailPath: thumbPath,
	}

	if err := db.DB.Create(&newPic).Error; err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"error":   "failed to insert new picture",
		})
		return
	}

	c.JSON(200, gin.H{
		"success":      true,
		"newPictureId": newPic.ID,
	})
}

type SetPicturePublicReq struct {
	PictureId uint `json:"pictureId"`
	Public    bool `json:"public"`
}

func SetPicturePublic(c *gin.Context) {
	var data SetPicturePublicReq
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"error":   "invalid request body",
		})
		return
	}

	userIdRaw, _ := c.Get("userId")
	userId := userIdRaw.(uint)

	result := db.DB.Model(&models.Picture{}).Where("id = ? AND user_id = ?", data.PictureId, userId).Update("public", data.Public)
	if result.Error != nil {
		c.JSON(500, gin.H{
			"success": false,
			"error":   "failed to update record",
		})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(404, gin.H{
			"success": false,
			"error":   "record not found",
		})
		return
	}
	c.JSON(200, gin.H{
		"success": true,
	})
}

type SearchPublicPictureRequest struct {
	Offset       int      `json:"offset"`
	Limit        int      `json:"limit"`
	Time         string   `json:"time"`
	SelectedTags []string `json:"selectedTags"`
}

func GetPublicPictures(c *gin.Context) {
	var data SearchPublicPictureRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"error":   "invalid request body",
		})
		return
	}

	if data.Limit <= 0 {
		data.Limit = 20
	}
	if data.Offset < 0 {
		data.Offset = 0
	}

	var pictures []Picture
	query := db.DB.Table("pictures").
		Select("pictures.id, pictures.public, pictures.thumbnail_path as path, users.username").
		Joins("JOIN users ON pictures.user_id = users.id").
		Where("pictures.public = true")

	// 匹配时间
	if data.Time != "" && data.Time != "all" {
		startTime, err := utils.ConverTimeFilter(data.Time)
		if err != nil {
			c.JSON(400, gin.H{
				"success": false,
				"error":   "invalid time filter",
			})
			return
		}
		query = query.Where("pictures.created_at >= ?", startTime)
	}

	// 匹配标签
	filteredTags := utils.FilterEmptyString(data.SelectedTags)
	if len(filteredTags) > 0 {
		query = query.
			Joins("JOIN picture_tags ON picture_tags.picture_id = pictures.id").
			Joins("JOIN tags ON picture_tags.tag_id = tags.id").
			Where("tags.name IN ?", filteredTags).
			Group("pictures.id, users.username").
			Having("COUNT(DISTINCT tags.id)=?", len(filteredTags))
	}

	// 分页查询
	query = query.Order("pictures.updated_at desc").Limit(data.Limit).Offset(data.Offset)

	// 执行查询
	if err := query.Find(&pictures).Error; err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"error":   "failed to search public pictures in DB",
		})
		return
	}

	c.JSON(200, gin.H{
		"success":  true,
		"pictures": pictures,
	})
}

func GetPublicPictureByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(400, gin.H{
			"success": false,
			"error":   "invalid id",
		})
		return
	}

	var picture Picture
	err = db.DB.Table("pictures").
		Select("pictures.id, pictures.public, pictures.picture_path as path, users.username").
		Joins("JOIN users ON pictures.user_id = users.id").
		Where("pictures.id = ? AND pictures.public = true", id).
		First(&picture).Error
	if err != nil {
		c.JSON(404, gin.H{
			"success": false,
			"error":   "picture not found or not public",
		})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"picture": picture,
	})
}
