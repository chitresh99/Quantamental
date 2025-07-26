package dist

import (
	"math"
)

func NormalPDF(x, mean, std float64) float64 {
	if std <= 0 {
		return 0
	}

	coefficient := 1.0 / (std * math.Sqrt(2*math.Pi))
	exponent := -0.5 * math.Pow((x-mean)/std, 2)
	return coefficient * math.Exp(exponent)
}

func NormalCDF(x, mean, std float64) float64 {
	if std <= 0 {
		return 0
	}

	z := (x - mean) / std
	return 0.5 * (1 + erf(z/math.Sqrt(2)))
}

func StandardNormalCDF(z float64) float64 {
	return 0.5 * (1 + erf(z/math.Sqrt(2)))
}

// Error function approximation
func erf(x float64) float64 {
	// Abramowitz and Stegun approximation
	a1 := 0.254829592
	a2 := -0.284496736
	a3 := 1.421413741
	a4 := -1.453152027
	a5 := 1.061405429
	p := 0.3275911

	sign := 1.0
	if x < 0 {
		sign = -1.0
		x = -x
	}

	t := 1.0 / (1.0 + p*x)
	y := 1.0 - (((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*math.Exp(-x*x)

	return sign * y
}

func InverseNormalCDF(p, mean, std float64) float64 {
	if p <= 0 || p >= 1 {
		return math.NaN()
	}

	z := inverseStandardNormal(p)
	return mean + std*z
}

func inverseStandardNormal(p float64) float64 {
	// Beasley-Springer-Moro algorithm
	// Constants for central region
	a := [4]float64{0, -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02}
	b := [4]float64{1, -5.447609879822406e+01, 1.615858368580409e+02, -7.843832180970751e+01}
	// Constants for tail regions
	c := [4]float64{-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00}
	d := [2]float64{7.784695709041462e-03, 3.224671290700398e-01}

	// Split point for algorithm
	split := 0.42

	if math.Abs(p-0.5) <= split {
		// Central region - use rational approximation
		t := p - 0.5
		s := t * t
		t = t * (((a[3]*s+a[2])*s+a[1])*s + a[0]) / ((((b[3]*s+b[2])*s+b[1])*s+b[0])*s + 1.0)
		return t
	} else {
		// Tail regions
		var t float64
		if p < 0.5 {
			t = math.Sqrt(-2 * math.Log(p))
			return -((c[3]*t+c[2])*t+c[1])*t + c[0]/((d[1]*t+d[0])*t+1)
		} else {
			t = math.Sqrt(-2 * math.Log(1-p))
			return ((c[3]*t+c[2])*t+c[1])*t + c[0]/((d[1]*t+d[0])*t+1)
		}
	}
}
