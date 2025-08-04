package handler

import (
	"fmt"
	"math"
	"strings"
)

type Validator struct{}

func NewValidator() *Validator {
	return &Validator{}
}

func (v *Validator) IsValidFloat(f float64) bool {
	return !math.IsNaN(f) && !math.IsInf(f, 0)
}

func (v *Validator) IsValidFunction(fn string) bool {
	fn = strings.TrimSpace(fn)
	if fn == "" {
		return false
	}
	// Block obvious dangerous patterns
	dangerous := []string{"import", "os", "exec", "eval", "system"}
	lower := strings.ToLower(fn)
	for _, d := range dangerous {
		if strings.Contains(lower, d) {
			return false
		}
	}
	return true
}

func (v *Validator) ValidateMatrix(matrix [][]float64) error {
	if len(matrix) == 0 {
		return fmt.Errorf("matrix cannot be empty")
	}
	return nil
}

func (v *Validator) ValidateData(data []float64) error {
	if len(data) == 0 {
		return fmt.Errorf("data cannot be empty")
	}
	return nil
}

func (v *Validator) ValidateNormalParams(req NormalRequest) error {
	if !v.IsValidFloat(req.X) || !v.IsValidFloat(req.Mean) || !v.IsValidFloat(req.Std) {
		return fmt.Errorf("invalid numeric values")
	}
	if req.Std <= 0 {
		return fmt.Errorf("standard deviation must be positive")
	}
	return nil
}

func (val *Validator) ValidateFinancialParams(s, k, t, v float64) error {
	if s <= 0 || k <= 0 || t <= 0 || v <= 0 {
		return fmt.Errorf("financial parameters must be positive")
	}
	return nil
}
