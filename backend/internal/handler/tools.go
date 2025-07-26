package handler

import (
	"backend/internal/controllers/calculus"
	"backend/internal/controllers/dist"
	"backend/internal/controllers/finmath"
	"backend/internal/controllers/linear"
	"backend/internal/controllers/opt"
	"backend/internal/controllers/sim"
	"backend/internal/controllers/stats"
	"backend/internal/controllers/timeseries"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Introduction(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "Welcome to Quantamental's mathematical tools",
		"endpoints": []string{
			"/api/linear/matrix-multiply",
			"/api/linear/matrix-inverse",
			"/api/stats/descriptive",
			"/api/stats/correlation",
			"/api/dist/normal-pdf",
			"/api/dist/normal-cdf",
			"/api/timeseries/moving-average",
			"/api/timeseries/exponential-average",
			"/api/opt/golden-section",
			"/api/finmath/black-scholes",
			"/api/finmath/implied-volatility",
			"/api/calculus/derivative",
			"/api/calculus/integral",
			"/api/sim/monte-carlo",
		},
	})
}

type MatrixRequest struct {
	MatrixA [][]float64 `json:"matrix_a"`
	MatrixB [][]float64 `json:"matrix_b"`
}

type SingleMatrixRequest struct {
	Matrix [][]float64 `json:"matrix"`
}

type DataRequest struct {
	Data []float64 `json:"data"`
}

type CorrelationRequest struct {
	DataX []float64 `json:"data_x"`
	DataY []float64 `json:"data_y"`
}

type NormalRequest struct {
	X    float64 `json:"x"`
	Mean float64 `json:"mean"`
	Std  float64 `json:"std"`
}

type MovingAverageRequest struct {
	Data   []float64 `json:"data"`
	Window int       `json:"window"`
}

type ExponentialAverageRequest struct {
	Data  []float64 `json:"data"`
	Alpha float64   `json:"alpha"`
}

type OptimizationRequest struct {
	Function string  `json:"function"`
	Lower    float64 `json:"lower"`
	Upper    float64 `json:"upper"`
	Tol      float64 `json:"tolerance"`
}

type BlackScholesRequest struct {
	S float64 `json:"spot_price"`
	K float64 `json:"strike_price"`
	T float64 `json:"time_to_expiry"`
	R float64 `json:"risk_free_rate"`
	V float64 `json:"volatility"`
}

type DerivativeRequest struct {
	Function string  `json:"function"`
	X        float64 `json:"x"`
	H        float64 `json:"step_size"`
}

type IntegralRequest struct {
	Function string  `json:"function"`
	Lower    float64 `json:"lower"`
	Upper    float64 `json:"upper"`
	N        int     `json:"intervals"`
}

type MonteCarloRequest struct {
	Function   string                 `json:"function"`
	Parameters map[string]interface{} `json:"parameters"`
	Samples    int                    `json:"samples"`
}

func MatrixMultiply(c *gin.Context) {
	var req MatrixRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := linear.Multiply(req.MatrixA, req.MatrixB)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result})
}

func MatrixInverse(c *gin.Context) {
	var req SingleMatrixRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := linear.Inverse(req.Matrix)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result})
}

func DescriptiveStats(c *gin.Context) {
	var req DataRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := stats.DescriptiveStats(req.Data)
	c.JSON(http.StatusOK, gin.H{"result": result})
}

func Correlation(c *gin.Context) {
	var req CorrelationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := stats.Correlation(req.DataX, req.DataY)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result})
}

func NormalPDF(c *gin.Context) {
	var req NormalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := dist.NormalPDF(req.X, req.Mean, req.Std)
	c.JSON(http.StatusOK, gin.H{"result": result})
}

func NormalCDF(c *gin.Context) {
	var req NormalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := dist.NormalCDF(req.X, req.Mean, req.Std)
	c.JSON(http.StatusOK, gin.H{"result": result})
}

func MovingAverage(c *gin.Context) {
	var req MovingAverageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := timeseries.MovingAverage(req.Data, req.Window)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result})
}

func ExponentialAverage(c *gin.Context) {
	var req ExponentialAverageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := timeseries.ExponentialMovingAverage(req.Data, req.Alpha)
	c.JSON(http.StatusOK, gin.H{"result": result})
}

func GoldenSectionSearch(c *gin.Context) {
	var req OptimizationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := opt.GoldenSectionSearch(req.Lower, req.Upper, req.Tol)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result})
}

func BlackScholes(c *gin.Context) {
	var req BlackScholesRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	call, put := finmath.BlackScholes(req.S, req.K, req.T, req.R, req.V)
	c.JSON(http.StatusOK, gin.H{
		"call_price": call,
		"put_price":  put,
	})
}

func ImpliedVolatility(c *gin.Context) {
	var req struct {
		S           float64 `json:"spot_price"`
		K           float64 `json:"strike_price"`
		T           float64 `json:"time_to_expiry"`
		R           float64 `json:"risk_free_rate"`
		MarketPrice float64 `json:"market_price"`
		IsCall      bool    `json:"is_call"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := finmath.ImpliedVolatility(req.S, req.K, req.T, req.R, req.MarketPrice, req.IsCall)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result})
}

func NumericalDerivative(c *gin.Context) {
	var req DerivativeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := calculus.NumericalDerivative(req.X, req.H)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result})
}

func NumericalIntegral(c *gin.Context) {
	var req IntegralRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := calculus.TrapezoidalRule(req.Lower, req.Upper, req.N)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result})
}

func MonteCarlo(c *gin.Context) {
	var req MonteCarloRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := sim.MonteCarlo(req.Samples)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result})
}
