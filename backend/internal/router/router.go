package router

import (
	"backend/internal/handler"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	api := r.Group("/api")
	{
		api.GET("/mathematicaltools", handler.Introduction)
		api.POST("/linear/matrix-multiply", handler.MatrixMultiply)
		api.POST("/linear/matrix-inverse", handler.MatrixInverse)
		api.POST("/stats/descriptive", handler.DescriptiveStats)
		api.POST("/stats/correlation", handler.Correlation)
		api.POST("/dist/normal-pdf", handler.NormalPDF)
		api.POST("/dist/normal-cdf", handler.NormalCDF)
		api.POST("/timeseries/moving-average", handler.MovingAverage)
		api.POST("/timeseries/exponential-average", handler.ExponentialAverage)
		api.POST("/opt/golden-section", handler.GoldenSectionSearch)
		api.POST("/finmath/black-scholes", handler.BlackScholes)
		api.POST("/finmath/implied-volatility", handler.ImpliedVolatility)
		api.POST("/calculus/derivative", handler.NumericalDerivative)
		api.POST("/calculus/integral", handler.NumericalIntegral)
		api.POST("/sim/monte-carlo", handler.MonteCarlo)
	}
	return r
}
