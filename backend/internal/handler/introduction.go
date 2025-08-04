package handler

import (
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
