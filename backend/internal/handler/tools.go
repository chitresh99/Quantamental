package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Introduction(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Welcome to Quantamental's mathematical tools",
	})
}
