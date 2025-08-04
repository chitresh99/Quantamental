package handler

import (
	"backend/internal/controllers/dist"
	"net/http"

	"github.com/gin-gonic/gin"
)

type DistributionHandler struct {
	*BaseHandler
}

func NewDistributionHandler() *DistributionHandler {
	return &DistributionHandler{
		BaseHandler: NewBaseHandler(),
	}
}

func (h *DistributionHandler) NormalPDF(c *gin.Context) {
	var req NormalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.validator.ValidateNormalParams(req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	result := dist.NormalPDF(req.X, req.Mean, req.Std)
	h.SendSuccess(c, result)
}

func (h *DistributionHandler) NormalCDF(c *gin.Context) {
	var req NormalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.validator.ValidateNormalParams(req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	result := dist.NormalCDF(req.X, req.Mean, req.Std)
	h.SendSuccess(c, result)
}
