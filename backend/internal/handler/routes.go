package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handlers struct {
	Linear       *LinearHandler
	Stats        *StatsHandler
	Distribution *DistributionHandler
	TimeSeries   *TimeSeriesHandler
	Optimization *OptimizationHandler
	FinMath      *FinMathHandler
	Calculus     *CalculusHandler
	Simulation   *SimulationHandler
}

func NewHandlers() *Handlers {
	return &Handlers{
		Linear:       NewLinearHandler(),
		Stats:        NewStatsHandler(),
		Distribution: NewDistributionHandler(),
		TimeSeries:   NewTimeSeriesHandler(),
		Optimization: NewOptimizationHandler(),
		FinMath:      NewFinMathHandler(),
		Calculus:     NewCalculusHandler(),
		Simulation:   NewSimulationHandler(),
	}
}

func (h *Handlers) Introduction(c *gin.Context) {
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

func (h *Handlers) RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")

	// Introduction
	api.GET("/", h.Introduction)

	// Linear algebra routes
	linear := api.Group("/linear")
	{
		linear.POST("/matrix-multiply", h.Linear.MatrixMultiply)
		linear.POST("/matrix-inverse", h.Linear.MatrixInverse)
	}

	// Statistics routes
	stats := api.Group("/stats")
	{
		stats.POST("/descriptive", h.Stats.DescriptiveStats)
		stats.POST("/correlation", h.Stats.Correlation)
	}

	// Distribution routes
	dist := api.Group("/dist")
	{
		dist.POST("/normal-pdf", h.Distribution.NormalPDF)
		dist.POST("/normal-cdf", h.Distribution.NormalCDF)
	}

	// Time series routes
	timeseries := api.Group("/timeseries")
	{
		timeseries.POST("/moving-average", h.TimeSeries.MovingAverage)
		timeseries.POST("/exponential-average", h.TimeSeries.ExponentialAverage)
	}

	// Optimization routes
	opt := api.Group("/opt")
	{
		opt.POST("/golden-section", h.Optimization.GoldenSectionSearch)
	}

	// Financial math routes
	finmath := api.Group("/finmath")
	{
		finmath.POST("/black-scholes", h.FinMath.BlackScholes)
		finmath.POST("/implied-volatility", h.FinMath.ImpliedVolatility)
	}

	// Calculus routes
	calculus := api.Group("/calculus")
	{
		calculus.POST("/derivative", h.Calculus.NumericalDerivative)
		calculus.POST("/integral", h.Calculus.NumericalIntegral)
	}

	// Simulation routes
	sim := api.Group("/sim")
	{
		sim.POST("/monte-carlo", h.Simulation.MonteCarlo)
	}
}
