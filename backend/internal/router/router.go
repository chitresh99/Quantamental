package router

import (
	"backend/internal/handler"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	linearHandler := handler.NewLinearHandler()
	statsHandler := handler.NewStatsHandler()
	distHandler := handler.NewDistributionHandler()
	timeSeriesHandler := handler.NewTimeSeriesHandler()
	optHandler := handler.NewOptimizationHandler()
	finMathHandler := handler.NewFinMathHandler()
	calculusHandler := handler.NewCalculusHandler()
	simHandler := handler.NewSimulationHandler()

	// API routes
	api := r.Group("/api")
	{
		// Introduction
		api.GET("/", handler.Introduction)

		// Linear algebra routes
		linear := api.Group("/linear")
		{
			linear.POST("/matrix-multiply", linearHandler.MatrixMultiply)
			linear.POST("/matrix-inverse", linearHandler.MatrixInverse)
		}

		// Statistics routes
		stats := api.Group("/stats")
		{
			stats.POST("/descriptive", statsHandler.DescriptiveStats)
			stats.POST("/correlation", statsHandler.Correlation)
		}

		// Distribution routes
		dist := api.Group("/dist")
		{
			dist.POST("/normal-pdf", distHandler.NormalPDF)
			dist.POST("/normal-cdf", distHandler.NormalCDF)
		}

		// Time series routes
		timeseries := api.Group("/timeseries")
		{
			timeseries.POST("/moving-average", timeSeriesHandler.MovingAverage)
			timeseries.POST("/exponential-average", timeSeriesHandler.ExponentialAverage)
		}

		// Optimization routes
		opt := api.Group("/opt")
		{
			opt.POST("/golden-section", optHandler.GoldenSectionSearch)
		}

		// Financial math routes
		finmath := api.Group("/finmath")
		{
			finmath.POST("/black-scholes", finMathHandler.BlackScholes)
			finmath.POST("/implied-volatility", finMathHandler.ImpliedVolatility)
		}

		// Calculus routes
		calculus := api.Group("/calculus")
		{
			calculus.POST("/derivative", calculusHandler.NumericalDerivative)
			calculus.POST("/integral", calculusHandler.NumericalIntegral)
		}

		// Simulation routes
		sim := api.Group("/sim")
		{
			sim.POST("/monte-carlo", simHandler.MonteCarlo)
		}
	}

	return r
}
