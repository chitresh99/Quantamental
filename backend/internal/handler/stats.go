package handler

import (
	"backend/internal/controllers/stats"
	"net/http"

	"github.com/gin-gonic/gin"
)

type StatsHandler struct {
	*BaseHandler
}

func NewStatsHandler() *StatsHandler {
	return &StatsHandler{
		BaseHandler: NewBaseHandler(),
	}
}

func (h *StatsHandler) DescriptiveStats(c *gin.Context) {
	var req DataRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.validator.ValidateData(req.Data); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	result := stats.DescriptiveStats(req.Data)
	h.SendSuccess(c, result)
}

func (h *StatsHandler) Correlation(c *gin.Context) {
	var req CorrelationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.validator.ValidateData(req.DataX); err != nil {
		h.SendError(c, http.StatusBadRequest, "DataX: "+err.Error())
		return
	}

	if err := h.validator.ValidateData(req.DataY); err != nil {
		h.SendError(c, http.StatusBadRequest, "DataY: "+err.Error())
		return
	}

	if len(req.DataX) != len(req.DataY) {
		h.SendError(c, http.StatusBadRequest, "data arrays must have same length")
		return
	}

	result, err := stats.Correlation(req.DataX, req.DataY)
	if err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	h.SendSuccess(c, result)
}
