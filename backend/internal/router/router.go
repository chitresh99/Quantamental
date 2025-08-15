package router

import (
	"backend/internal/handler"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	// Allowed origins for both local and production
	allowedOrigins := map[string]bool{
		"http://localhost:3000":           true, // Local Next.js dev
		"https://quantamental.vercel.app": true, // Production frontend
	}

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		// If origin is in allowed list, set the header
		if allowedOrigins[origin] {
			c.Header("Access-Control-Allow-Origin", origin)
		}

		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers",
			"Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods",
			"POST, HEAD, PATCH, OPTIONS, GET, PUT, DELETE")

		// Handle preflight request
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(CORSMiddleware())

	linearHandler := handler.NewLinearHandler()
	statsHandler := handler.NewStatsHandler()
	distHandler := handler.NewDistributionHandler()
	timeSeriesHandler := handler.NewTimeSeriesHandler()
	optHandler := handler.NewOptimizationHandler()
	finMathHandler := handler.NewFinMathHandler()
	calculusHandler := handler.NewCalculusHandler()
	simHandler := handler.NewSimulationHandler()
	financeNewsHandler := handler.NewFinanceNewsHandler()

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

		finance := api.Group("/finance")
		{
			finance.GET("/news", financeNewsHandler.GetFinanceNews)
			finance.POST("/search", financeNewsHandler.SearchFinanceNews)
			finance.GET("/sources", financeNewsHandler.GetFinanceSources)
		}
	}

	return r
}
