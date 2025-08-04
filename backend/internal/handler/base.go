package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type BaseHandler struct {
	validator *Validator
}

func NewBaseHandler() *BaseHandler {
	return &BaseHandler{
		validator: NewValidator(),
	}
}

func (h *BaseHandler) SendError(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, gin.H{"error": message})
}

func (h *BaseHandler) SendSuccess(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, gin.H{"result": data})
}

func (h *BaseHandler) SendSuccessWithFields(c *gin.Context, data gin.H) {
	c.JSON(http.StatusOK, data)
}
