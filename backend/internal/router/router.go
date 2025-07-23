package router

import (
	"backend/internal/handler"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	api := r.Group("/api")
	{
		api.GET("/mathematicaltools", handler.Introduction)
	}

	return r
}
