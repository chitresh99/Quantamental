package handler

import (
	"backend/internal/controllers/sim"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SimulationHandler struct {
	*BaseHandler
}

func NewSimulationHandler() *SimulationHandler {
	return &SimulationHandler{
		BaseHandler: NewBaseHandler(),
	}
}

func (h *SimulationHandler) MonteCarlo(c *gin.Context) {
	var req MonteCarloRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if !h.validator.IsValidFunction(req.Function) {
		h.SendError(c, http.StatusBadRequest, "invalid function")
		return
	}

	if req.Samples <= 0 {
		h.SendError(c, http.StatusBadRequest, "samples must be positive")
		return
	}

	result, err := sim.MonteCarlo(req.Samples)
	if err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	h.SendSuccess(c, result)
}
