package handlers

import (
	"picturemanager/utils"

	"github.com/gin-gonic/gin"
)

func VerifyToken(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	claims, err := utils.VerifyToken(authHeader)
	if err != nil {
		c.JSON(400, gin.H{
			"valid": false,
		})
		return
	}
	c.JSON(200, gin.H{
		"valid": true,
		"user":  gin.H{"userId": claims.UserId, "email": claims.Email, "username": claims.Username},
	})
}
