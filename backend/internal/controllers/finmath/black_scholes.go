package finmath

import (
	"backend/internal/controllers/dist"
	"errors"
	"math"
)

func BlackScholes(S, K, T, r, sigma float64) (float64, float64) {
	if S <= 0 || K <= 0 || T <= 0 || sigma <= 0 {
		return 0, 0
	}

	d1 := (math.Log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma * math.Sqrt(T))
	d2 := d1 - sigma*math.Sqrt(T)

	Nd1 := dist.StandardNormalCDF(d1)
	Nd2 := dist.StandardNormalCDF(d2)
	NegD1 := dist.StandardNormalCDF(-d1)
	NegD2 := dist.StandardNormalCDF(-d2)

	// Call option price
	call := S*Nd1 - K*math.Exp(-r*T)*Nd2

	// Put option price
	put := K*math.Exp(-r*T)*NegD2 - S*NegD1

	return call, put
}

func ImpliedVolatility(S, K, T, r, marketPrice float64, isCall bool) (float64, error) {
	if S <= 0 || K <= 0 || T <= 0 || marketPrice <= 0 {
		return 0, errors.New("invalid parameters")
	}

	// Newton-Raphson method
	sigma := 0.2 // Initial guess
	tolerance := 1e-6
	maxIterations := 100

	for i := 0; i < maxIterations; i++ {
		call, put := BlackScholes(S, K, T, r, sigma)

		var price, vega float64
		if isCall {
			price = call
		} else {
			price = put
		}

		// Calculate vega (derivative of option price with respect to volatility)
		d1 := (math.Log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma * math.Sqrt(T))
		vega = S * math.Sqrt(T) * dist.NormalPDF(d1, 0, 1)

		if math.Abs(vega) < 1e-10 {
			return 0, errors.New("vega too small")
		}

		sigmaNewer := sigma - (price-marketPrice)/vega

		if math.Abs(sigmaNewer-sigma) < tolerance {
			return sigmaNewer, nil
		}

		sigma = sigmaNewer

		if sigma <= 0 {
			sigma = 0.01 // Ensure positive volatility
		}
	}

	return 0, errors.New("failed to converge")
}

func Greeks(S, K, T, r, sigma float64) map[string]float64 {
	if S <= 0 || K <= 0 || T <= 0 || sigma <= 0 {
		return nil
	}

	d1 := (math.Log(S/K) + (r+0.5*sigma*sigma)*T) / (sigma * math.Sqrt(T))
	d2 := d1 - sigma*math.Sqrt(T)

	Nd1 := dist.StandardNormalCDF(d1)
	Nd2 := dist.StandardNormalCDF(d2)
	pdf_d1 := dist.NormalPDF(d1, 0, 1)

	// Delta
	callDelta := Nd1
	putDelta := Nd1 - 1

	// Gamma
	gamma := pdf_d1 / (S * sigma * math.Sqrt(T))

	// Theta
	callTheta := -(S*pdf_d1*sigma)/(2*math.Sqrt(T)) - r*K*math.Exp(-r*T)*Nd2
	putTheta := -(S*pdf_d1*sigma)/(2*math.Sqrt(T)) + r*K*math.Exp(-r*T)*(1-Nd2)

	// Vega
	vega := S * math.Sqrt(T) * pdf_d1

	// Rho
	callRho := K * T * math.Exp(-r*T) * Nd2
	putRho := -K * T * math.Exp(-r*T) * (1 - Nd2)

	return map[string]float64{
		"call_delta": callDelta,
		"put_delta":  putDelta,
		"gamma":      gamma,
		"call_theta": callTheta / 365, // Per day
		"put_theta":  putTheta / 365,  // Per day
		"vega":       vega / 100,      // Per 1% change
		"call_rho":   callRho / 100,   // Per 1% change
		"put_rho":    putRho / 100,    // Per 1% change
	}
}
