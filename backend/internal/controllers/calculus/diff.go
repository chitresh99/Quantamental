package calculus

import (
	"errors"
)

func NumericalDerivative(x, h float64) (float64, error) {
	if h <= 0 {
		h = 1e-8
	}

	// Example function: f(x) = x^2 + 2x + 1
	f := func(x float64) float64 {
		return x*x + 2*x + 1
	}

	// Central difference method
	return (f(x+h) - f(x-h)) / (2 * h), nil
}

func PartialDerivative(x, y, h float64, variable string) (float64, error) {
	// Example function: f(x,y) = x^2 + y^2 + xy
	f := func(x, y float64) float64 {
		return x*x + y*y + x*y
	}

	if h <= 0 {
		h = 1e-8
	}

	switch variable {
	case "x":
		return (f(x+h, y) - f(x-h, y)) / (2 * h), nil
	case "y":
		return (f(x, y+h) - f(x, y-h)) / (2 * h), nil
	default:
		return 0, errors.New("variable must be 'x' or 'y'")
	}
}

func TrapezoidalRule(a, b float64, n int) (float64, error) {
	if n <= 0 {
		return 0, errors.New("number of intervals must be positive")
	}

	if b <= a {
		return 0, errors.New("upper bound must be greater than lower bound")
	}

	// Example function: f(x) = x^2
	f := func(x float64) float64 {
		return x * x
	}

	h := (b - a) / float64(n)
	sum := f(a) + f(b)

	for i := 1; i < n; i++ {
		x := a + float64(i)*h
		sum += 2 * f(x)
	}

	return h * sum / 2, nil
}

func SimpsonsRule(a, b float64, n int) (float64, error) {
	if n <= 0 || n%2 != 0 {
		return 0, errors.New("number of intervals must be positive and even")
	}

	if b <= a {
		return 0, errors.New("upper bound must be greater than lower bound")
	}

	// Example function: f(x) = x^2
	f := func(x float64) float64 {
		return x * x
	}

	h := (b - a) / float64(n)
	sum := f(a) + f(b)

	for i := 1; i < n; i++ {
		x := a + float64(i)*h
		if i%2 == 0 {
			sum += 2 * f(x)
		} else {
			sum += 4 * f(x)
		}
	}

	return h * sum / 3, nil
}

func Gradient(x, y, h float64) ([]float64, error) {
	// Example function: f(x,y) = x^2 + y^2 + xy
	f := func(x, y float64) float64 {
		return x*x + y*y + x*y
	}

	if h <= 0 {
		h = 1e-8
	}

	// Partial derivative with respect to x
	dfdx := (f(x+h, y) - f(x-h, y)) / (2 * h)

	// Partial derivative with respect to y
	dfdy := (f(x, y+h) - f(x, y-h)) / (2 * h)

	return []float64{dfdx, dfdy}, nil
}
