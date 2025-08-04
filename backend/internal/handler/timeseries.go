package handler

import (
	"backend/internal/controllers/timeseries"
	"net/http"

	"github.com/gin-gonic/gin"
)

type TimeSeriesHandler struct {
	*BaseHandler
}

func NewTimeSeriesHandler() *TimeSeriesHandler {
	return &TimeSeriesHandler{
		BaseHandler: NewBaseHandler(),
	}
}

func (h *TimeSeriesHandler) MovingAverage(c *gin.Context) {
	var req MovingAverageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.validator.ValidateData(req.Data); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if req.Window <= 0 || req.Window > len(req.Data) {
		h.SendError(c, http.StatusBadRequest, "invalid window size")
		return
	}

	result, err := timeseries.MovingAverage(req.Data, req.Window)
	if err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	h.SendSuccess(c, result)
}

func (h *TimeSeriesHandler) ExponentialAverage(c *gin.Context) {
	var req ExponentialAverageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.validator.ValidateData(req.Data); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if req.Alpha <= 0 || req.Alpha >= 1 {
		h.SendError(c, http.StatusBadRequest, "alpha must be between 0 and 1")
		return
	}

	result := timeseries.ExponentialMovingAverage(req.Data, req.Alpha)
	h.SendSuccess(c, result)
}
