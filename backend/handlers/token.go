package handlers

import (
	"picturemanager/utils"

	"github.com/gin-gonic/gin"
)

func VerifyToken(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" || len(authHeader) < 7 || authHeader[:7] != "Bearer " {
		c.JSON(401, gin.H{
			"valid": false,
		})
		return
	}
	tokenString := authHeader[7:]
	claims, err := utils.ValidateToken(tokenString)
	if err != nil {
		c.JSON(401, gin.H{
			"valid": false,
		})
		return
	}
	c.JSON(200, gin.H{
		"valid": true,
		"user":  gin.H{"userId": claims.UserId, "email": claims.Email, "username": claims.Username},
	})
}
