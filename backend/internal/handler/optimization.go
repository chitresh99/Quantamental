package handler

import (
	"backend/internal/controllers/opt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type OptimizationHandler struct {
	*BaseHandler
}

func NewOptimizationHandler() *OptimizationHandler {
	return &OptimizationHandler{
		BaseHandler: NewBaseHandler(),
	}
}

func (h *OptimizationHandler) GoldenSectionSearch(c *gin.Context) {
	var req OptimizationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if !h.validator.IsValidFunction(req.Function) {
		h.SendError(c, http.StatusBadRequest, "invalid function")
		return
	}

	if req.Lower >= req.Upper {
		h.SendError(c, http.StatusBadRequest, "lower bound must be less than upper bound")
		return
	}

	if req.Tol <= 0 {
		h.SendError(c, http.StatusBadRequest, "tolerance must be positive")
		return
	}

	result, err := opt.GoldenSectionSearch(req.Lower, req.Upper, req.Tol)
	if err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	h.SendSuccess(c, result)
}
