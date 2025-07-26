package linear

import (
	"errors"
	"math"
)

func Multiply(a, b [][]float64) ([][]float64, error) {
	if len(a) == 0 || len(b) == 0 {
		return nil, errors.New("matrices cannot be empty")
	}

	if len(a[0]) != len(b) {
		return nil, errors.New("incompatible matrix dimensions")
	}

	rows, cols := len(a), len(b[0])
	result := make([][]float64, rows)

	for i := 0; i < rows; i++ {
		result[i] = make([]float64, cols)
		for j := 0; j < cols; j++ {
			for k := 0; k < len(a[0]); k++ {
				result[i][j] += a[i][k] * b[k][j]
			}
		}
	}

	return result, nil
}

func Inverse(matrix [][]float64) ([][]float64, error) {
	n := len(matrix)
	if n == 0 || len(matrix[0]) != n {
		return nil, errors.New("matrix must be square")
	}

	// Create augmented matrix [A|I]
	augmented := make([][]float64, n)
	for i := 0; i < n; i++ {
		augmented[i] = make([]float64, 2*n)
		for j := 0; j < n; j++ {
			augmented[i][j] = matrix[i][j]
		}
		augmented[i][n+i] = 1.0
	}

	// Gaussian elimination
	for i := 0; i < n; i++ {
		// Find pivot
		maxRow := i
		for k := i + 1; k < n; k++ {
			if math.Abs(augmented[k][i]) > math.Abs(augmented[maxRow][i]) {
				maxRow = k
			}
		}

		// Swap rows
		if maxRow != i {
			augmented[i], augmented[maxRow] = augmented[maxRow], augmented[i]
		}

		// Check for singular matrix
		if math.Abs(augmented[i][i]) < 1e-10 {
			return nil, errors.New("matrix is singular")
		}

		// Scale pivot row
		pivot := augmented[i][i]
		for j := 0; j < 2*n; j++ {
			augmented[i][j] /= pivot
		}

		// Eliminate column
		for k := 0; k < n; k++ {
			if k != i {
				factor := augmented[k][i]
				for j := 0; j < 2*n; j++ {
					augmented[k][j] -= factor * augmented[i][j]
				}
			}
		}
	}

	// Extract inverse matrix
	result := make([][]float64, n)
	for i := 0; i < n; i++ {
		result[i] = make([]float64, n)
		for j := 0; j < n; j++ {
			result[i][j] = augmented[i][n+j]
		}
	}

	return result, nil
}

func Transpose(matrix [][]float64) [][]float64 {
	if len(matrix) == 0 {
		return nil
	}

	rows, cols := len(matrix), len(matrix[0])
	result := make([][]float64, cols)

	for i := 0; i < cols; i++ {
		result[i] = make([]float64, rows)
		for j := 0; j < rows; j++ {
			result[i][j] = matrix[j][i]
		}
	}

	return result
}
