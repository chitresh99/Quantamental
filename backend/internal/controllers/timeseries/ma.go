package timeseries

import (
	"errors"
)

func MovingAverage(data []float64, window int) ([]float64, error) {
	if window <= 0 || window > len(data) {
		return nil, errors.New("invalid window size")
	}

	result := make([]float64, len(data)-window+1)

	for i := 0; i <= len(data)-window; i++ {
		sum := 0.0
		for j := i; j < i+window; j++ {
			sum += data[j]
		}
		result[i] = sum / float64(window)
	}

	return result, nil
}

func ExponentialMovingAverage(data []float64, alpha float64) []float64 {
	if len(data) == 0 || alpha <= 0 || alpha > 1 {
		return nil
	}

	result := make([]float64, len(data))
	result[0] = data[0]

	for i := 1; i < len(data); i++ {
		result[i] = alpha*data[i] + (1-alpha)*result[i-1]
	}

	return result
}

func WeightedMovingAverage(data []float64, weights []float64) ([]float64, error) {
	if len(weights) > len(data) {
		return nil, errors.New("weights length cannot exceed data length")
	}

	window := len(weights)
	result := make([]float64, len(data)-window+1)

	// Normalize weights
	weightSum := 0.0
	for _, w := range weights {
		weightSum += w
	}

	for i := 0; i <= len(data)-window; i++ {
		sum := 0.0
		for j := 0; j < window; j++ {
			sum += data[i+j] * weights[j]
		}
		result[i] = sum / weightSum
	}

	return result, nil
}
