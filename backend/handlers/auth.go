package handlers

import (
	"fmt"

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
		c.JSON(400, gin.H{"success": false, "error": err.Error(), "userId": nil})
		return
	}
	fmt.Printf("[Register]:email:%s,username:%s,password:%s", formdata.Email, formdata.Username, formdata.Password)
	c.JSON(200, gin.H{
		"success": true,
		"error":   nil,
		"userId":  "test",
	})
}

func Login(c *gin.Context) {
	var formdata LoginForm
	if err := c.ShouldBind(&formdata); err != nil {
		c.JSON(400, gin.H{"success": false, "error": err.Error(), "userId": nil})
		return
	}
	fmt.Printf("[Register]:email:%s,password:%s", formdata.Email, formdata.Password)
	c.JSON(200, gin.H{
		"success": true,
		"error":   nil,
		"userId":  "test",
	})
}
