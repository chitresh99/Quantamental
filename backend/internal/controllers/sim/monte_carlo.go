package sim

import (
	"errors"
	"math"
	"math/rand"
	"time"
)

type MonteCarloResult struct {
	Mean       float64   `json:"mean"`
	StdDev     float64   `json:"std_dev"`
	Confidence []float64 `json:"confidence_interval"`
	Samples    []float64 `json:"samples"`
}

func MonteCarlo(numSamples int) (MonteCarloResult, error) {
	if numSamples <= 0 {
		return MonteCarloResult{}, errors.New("number of samples must be positive")
	}

	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	samples := make([]float64, numSamples)
	insideCircle := 0

	for i := 0; i < numSamples; i++ {
		x := rng.Float64()*2 - 1
		y := rng.Float64()*2 - 1

		if x*x+y*y <= 1 {
			insideCircle++
			samples[i] = 1
		} else {
			samples[i] = 0
		}
	}

	piEstimate := 4.0 * float64(insideCircle) / float64(numSamples)
	mean := piEstimate
	var variance float64
	for _, sample := range samples {
		diff := sample - mean/4
		variance += diff * diff
	}
	variance /= float64(numSamples - 1)
	stdDev := math.Sqrt(variance)

	marginError := 1.96 * stdDev / math.Sqrt(float64(numSamples))
	confidence := []float64{mean - marginError, mean + marginError}

	return MonteCarloResult{
		Mean:       mean,
		StdDev:     stdDev,
		Confidence: confidence,
		Samples:    samples[:min(100, len(samples))],
	}, nil
}

func GeometricBrownianMotion(S0, mu, sigma, T float64, steps, paths int) ([][]float64, error) {
	if steps <= 0 || paths <= 0 {
		return nil, errors.New("steps and paths must be positive")
	}
	if T <= 0 || sigma <= 0 || S0 <= 0 {
		return nil, errors.New("invalid parameters")
	}

	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	dt := T / float64(steps)
	drift := (mu - 0.5*sigma*sigma) * dt
	diffusion := sigma * math.Sqrt(dt)

	result := make([][]float64, paths)

	for i := 0; i < paths; i++ {
		path := make([]float64, steps+1)
		path[0] = S0

		for j := 1; j <= steps; j++ {
			z := rng.NormFloat64()
			path[j] = path[j-1] * math.Exp(drift+diffusion*z)
		}
		result[i] = path
	}
	return result, nil
}

func OptionPricingMonteCarlo(S0, K, T, r, sigma float64, numSims int, isCall bool) (float64, error) {
	if numSims <= 0 {
		return 0, errors.New("number of simulations must be positive")
	}
	if S0 <= 0 || K <= 0 || T <= 0 || sigma <= 0 {
		return 0, errors.New("invalid parameters")
	}

	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	var payoffSum float64
	drift := (r - 0.5*sigma*sigma) * T
	diffusion := sigma * math.Sqrt(T)

	for i := 0; i < numSims; i++ {
		z := rng.NormFloat64()
		ST := S0 * math.Exp(drift+diffusion*z)

		var payoff float64
		if isCall {
			payoff = math.Max(ST-K, 0)
		} else {
			payoff = math.Max(K-ST, 0)
		}
		payoffSum += payoff
	}

	averagePayoff := payoffSum / float64(numSims)
	return averagePayoff * math.Exp(-r*T), nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
