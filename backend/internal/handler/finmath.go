package handler

import (
	"backend/internal/controllers/finmath"
	"net/http"

	"github.com/gin-gonic/gin"
)

type FinMathHandler struct {
	*BaseHandler
}

func NewFinMathHandler() *FinMathHandler {
	return &FinMathHandler{
		BaseHandler: NewBaseHandler(),
	}
}

func (h *FinMathHandler) BlackScholes(c *gin.Context) {
	var req BlackScholesRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := h.validator.ValidateFinancialParams(req.S, req.K, req.T, req.V); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if req.R < 0 {
		h.SendError(c, http.StatusBadRequest, "risk-free rate cannot be negative")
		return
	}

	call, put := finmath.BlackScholes(req.S, req.K, req.T, req.R, req.V)
	h.SendSuccessWithFields(c, gin.H{
		"call_price": call,
		"put_price":  put,
	})
}

func (h *FinMathHandler) ImpliedVolatility(c *gin.Context) {
	var req ImpliedVolatilityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	if req.S <= 0 || req.K <= 0 || req.T <= 0 || req.MarketPrice <= 0 {
		h.SendError(c, http.StatusBadRequest, "financial parameters must be positive")
		return
	}

	result, err := finmath.ImpliedVolatility(req.S, req.K, req.T, req.R, req.MarketPrice, req.IsCall)
	if err != nil {
		h.SendError(c, http.StatusBadRequest, err.Error())
		return
	}

	h.SendSuccess(c, result)
}
