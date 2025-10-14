package middlewares

import (
	"picturemanager/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		claims, err := utils.VerifyToken(authHeader)
		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{
				"success": false,
				"error":   "invalid user token",
			})
			return
		}
		userId64, _ := strconv.ParseUint(claims.UserId, 10, 64)
		c.Set("userId", uint(userId64))
		c.Next()
	}
}
