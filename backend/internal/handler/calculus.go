package handler

import (
	"backend/internal/controllers/calculus"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CalculusHandler struct {
	*BaseHandler
}

func NewCalculusHandler() *CalculusHandler {
	return &CalculusHandler{
		BaseHandler: NewBaseHandler(),
	}
}

func (h *CalculusHandler) NumericalDerivative(c *gin.Context) {
	var req DerivativeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if !h.validator.IsValidFunction(req.Function) {
		h.SendError(c, http.StatusBadRequest, "invalid function")
		return
	}

	if req.H <= 0 {
		h.SendError(c, http.StatusBadRequest, "step size must be positive")
		return
	}

	result, err := calculus.NumericalDerivative(req.X, req.H)
	if err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	h.SendSuccess(c, result)
}

func (h *CalculusHandler) NumericalIntegral(c *gin.Context) {
	var req IntegralRequest
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

	if req.N <= 0 {
		h.SendError(c, http.StatusBadRequest, "intervals must be positive")
		return
	}

	result, err := calculus.TrapezoidalRule(req.Lower, req.Upper, req.N)
	if err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	h.SendSuccess(c, result)
}
