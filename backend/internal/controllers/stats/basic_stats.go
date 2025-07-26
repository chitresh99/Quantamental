package stats

import (
	"errors"
	"math"
	"sort"
)

type Stats struct {
	Mean     float64 `json:"mean"`
	Median   float64 `json:"median"`
	Mode     float64 `json:"mode"`
	StdDev   float64 `json:"std_dev"`
	Variance float64 `json:"variance"`
	Min      float64 `json:"min"`
	Max      float64 `json:"max"`
	Range    float64 `json:"range"`
	Skewness float64 `json:"skewness"`
	Kurtosis float64 `json:"kurtosis"`
}

func DescriptiveStats(data []float64) Stats {
	if len(data) == 0 {
		return Stats{}
	}

	sorted := make([]float64, len(data))
	copy(sorted, data)
	sort.Float64s(sorted)

	mean := Mean(data)
	variance := Variance(data)
	stdDev := math.Sqrt(variance)

	return Stats{
		Mean:     mean,
		Median:   Median(sorted),
		Mode:     Mode(data),
		StdDev:   stdDev,
		Variance: variance,
		Min:      sorted[0],
		Max:      sorted[len(sorted)-1],
		Range:    sorted[len(sorted)-1] - sorted[0],
		Skewness: Skewness(data, mean, stdDev),
		Kurtosis: Kurtosis(data, mean, stdDev),
	}
}

func Mean(data []float64) float64 {
	if len(data) == 0 {
		return 0
	}

	sum := 0.0
	for _, v := range data {
		sum += v
	}
	return sum / float64(len(data))
}

func Median(sortedData []float64) float64 {
	n := len(sortedData)
	if n == 0 {
		return 0
	}

	if n%2 == 0 {
		return (sortedData[n/2-1] + sortedData[n/2]) / 2
	}
	return sortedData[n/2]
}

func Mode(data []float64) float64 {
	if len(data) == 0 {
		return 0
	}

	freq := make(map[float64]int)
	for _, v := range data {
		freq[v]++
	}

	maxFreq := 0
	var mode float64
	for v, f := range freq {
		if f > maxFreq {
			maxFreq = f
			mode = v
		}
	}

	return mode
}

func Variance(data []float64) float64 {
	if len(data) <= 1 {
		return 0
	}

	mean := Mean(data)
	sum := 0.0
	for _, v := range data {
		diff := v - mean
		sum += diff * diff
	}

	return sum / float64(len(data)-1)
}

func Skewness(data []float64, mean, stdDev float64) float64 {
	if len(data) == 0 || stdDev == 0 {
		return 0
	}

	sum := 0.0
	for _, v := range data {
		normalized := (v - mean) / stdDev
		sum += normalized * normalized * normalized
	}

	return sum / float64(len(data))
}

func Kurtosis(data []float64, mean, stdDev float64) float64 {
	if len(data) == 0 || stdDev == 0 {
		return 0
	}

	sum := 0.0
	for _, v := range data {
		normalized := (v - mean) / stdDev
		sum += normalized * normalized * normalized * normalized
	}

	return (sum / float64(len(data))) - 3.0 // Excess kurtosis
}

func Correlation(x, y []float64) (float64, error) {
	if len(x) != len(y) || len(x) == 0 {
		return 0, errors.New("arrays must be of same non-zero length")
	}

	meanX, meanY := Mean(x), Mean(y)

	var numerator, sumX2, sumY2 float64
	for i := range x {
		dx, dy := x[i]-meanX, y[i]-meanY
		numerator += dx * dy
		sumX2 += dx * dx
		sumY2 += dy * dy
	}

	denominator := math.Sqrt(sumX2 * sumY2)
	if denominator == 0 {
		return 0, errors.New("standard deviation is zero")
	}

	return numerator / denominator, nil
}
