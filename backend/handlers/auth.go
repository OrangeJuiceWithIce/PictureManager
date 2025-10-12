package handlers

import (
	"fmt"
	"picturemanager/db"
	"picturemanager/models"
	"picturemanager/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type RegisterForm struct {
	Email    string `form:"email" binding:"required,email"`
	Username string `form:"username" binding:"required,min=6,max=20"`
	Password string `form:"password" binding:"required,min=6,max=20"`
}

type LoginForm struct {
	Email    string `form:"email" binding:"required,email"`
	Password string `form:"password" binding:"required,min=6,max=20"`
}

func Register(c *gin.Context) {
	var formdata RegisterForm
	if err := c.ShouldBind(&formdata); err != nil {
		c.JSON(400, gin.H{"success": false, "error": err.Error()})
		return
	}
	//db
	//repeated email
	var count int64
	db.DB.Model(&models.User{}).Where("email=?", formdata.Email).Count(&count)
	if count > 0 {
		c.JSON(400, gin.H{"success": false, "error": "email already been registered"})
		return
	}
	//repeated username
	db.DB.Model(&models.User{}).Where("username=?", formdata.Username).Count(&count)
	if count > 0 {
		c.JSON(400, gin.H{"success": false, "error": "username already been registered"})
		return
	}

	hashedPassword, err := utils.HashPassword(formdata.Password)
	if err != nil {
		fmt.Printf("[Register]failed to hash password:%v", err)
		c.JSON(500, gin.H{"success": false, "error": "failed to hash password"})
		return
	}

	newuser := &models.User{
		Email:    formdata.Email,
		Username: formdata.Username,
		Password: hashedPassword,
	}

	if err := db.DB.Create(newuser).Error; err != nil {
		fmt.Printf("[Register]failed to create new user:%v", err)
		c.JSON(500, gin.H{"success": false, "error": "failed to create new user"})
		return
	}

	//token
	token, err := utils.GenerateToken(strconv.Itoa(int(newuser.ID)), newuser.Email, newuser.Username)
	if err != nil {
		fmt.Printf("[Register]failed to generate token:%v", err)
		c.JSON(500, gin.H{"success": false, "error": "failed to generate token"})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"error":   nil,
		"user":    gin.H{"userId": strconv.Itoa(int(newuser.ID)), "email": newuser.Email, "username": newuser.Username},
		"token":   token,
	})
}

func Login(c *gin.Context) {
	var formdata LoginForm
	if err := c.ShouldBind(&formdata); err != nil {
		c.JSON(400, gin.H{"success": false, "error": err.Error()})
		return
	}
	var user models.User
	if err := db.DB.Where("email=?", formdata.Email).First(&user).Error; err != nil {
		c.JSON(400, gin.H{"success": false, "error": err.Error()})
		return
	}

	if !utils.CheckPassword(formdata.Password, user.Password) {
		c.JSON(401, gin.H{"success": false, "error": "wrong password"})
		return
	}

	token, err := utils.GenerateToken(strconv.Itoa(int(user.ID)), user.Email, user.Username)
	if err != nil {
		fmt.Printf("[Login]failed to generate token:%v", err)
		c.JSON(500, gin.H{"success": false, "error": "failed to generate token"})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"error":   nil,
		"user":    gin.H{"userId": strconv.Itoa(int(user.ID)), "email": user.Email, "username": user.Username},
		"token":   token,
	})
}
