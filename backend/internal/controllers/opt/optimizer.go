package opt

import (
	"errors"
	"math"
)

const goldenRatio = 1.618033988749895

func GoldenSectionSearch(a, b, tol float64) (float64, error) {
	if b <= a {
		return 0, errors.New("upper bound must be greater than lower bound")
	}

	if tol <= 0 {
		tol = 1e-6
	}

	// Simple quadratic function for demonstration: f(x) = (x-2)^2
	f := func(x float64) float64 {
		return (x - 2) * (x - 2)
	}

	c := b - (b-a)/goldenRatio
	d := a + (b-a)/goldenRatio

	for math.Abs(b-a) > tol {
		if f(c) < f(d) {
			b = d
		} else {
			a = c
		}

		c = b - (b-a)/goldenRatio
		d = a + (b-a)/goldenRatio
	}

	return (a + b) / 2, nil
}

func NewtonRaphson(x0, tol float64, maxIter int) (float64, error) {
	// Example: finding root of f(x) = x^2 - 2 (sqrt of 2)
	f := func(x float64) float64 {
		return x*x - 2
	}

	df := func(x float64) float64 {
		return 2 * x
	}

	x := x0

	for i := 0; i < maxIter; i++ {
		fx := f(x)
		dfx := df(x)

		if math.Abs(dfx) < 1e-12 {
			return 0, errors.New("derivative too small")
		}

		xNew := x - fx/dfx

		if math.Abs(xNew-x) < tol {
			return xNew, nil
		}

		x = xNew
	}

	return 0, errors.New("maximum iterations reached")
}
