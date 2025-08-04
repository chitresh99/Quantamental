package handler

import (
	"backend/internal/controllers/linear"
	"net/http"

	"github.com/gin-gonic/gin"
)

type LinearHandler struct {
	*BaseHandler
}

func NewLinearHandler() *LinearHandler {
	return &LinearHandler{
		BaseHandler: NewBaseHandler(),
	}
}

func (h *LinearHandler) MatrixMultiply(c *gin.Context) {
	var req MatrixRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.validator.ValidateMatrix(req.MatrixA); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.validator.ValidateMatrix(req.MatrixB); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := linear.Multiply(req.MatrixA, req.MatrixB)
	if err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	h.SendSuccess(c, result)
}

func (h *LinearHandler) MatrixInverse(c *gin.Context) {
	var req SingleMatrixRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.validator.ValidateMatrix(req.Matrix); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	result, err := linear.Inverse(req.Matrix)
	if err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	h.SendSuccess(c, result)
}
