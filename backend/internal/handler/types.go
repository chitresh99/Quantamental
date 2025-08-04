package handler

type MatrixRequest struct {
	MatrixA [][]float64 `json:"matrix_a"`
	MatrixB [][]float64 `json:"matrix_b"`
}

type SingleMatrixRequest struct {
	Matrix [][]float64 `json:"matrix"`
}

type DataRequest struct {
	Data []float64 `json:"data"`
}

type CorrelationRequest struct {
	DataX []float64 `json:"data_x"`
	DataY []float64 `json:"data_y"`
}

type NormalRequest struct {
	X    float64 `json:"x"`
	Mean float64 `json:"mean"`
	Std  float64 `json:"std"`
}

type MovingAverageRequest struct {
	Data   []float64 `json:"data"`
	Window int       `json:"window"`
}

type ExponentialAverageRequest struct {
	Data  []float64 `json:"data"`
	Alpha float64   `json:"alpha"`
}

type OptimizationRequest struct {
	Function string  `json:"function"`
	Lower    float64 `json:"lower"`
	Upper    float64 `json:"upper"`
	Tol      float64 `json:"tolerance"`
}

type BlackScholesRequest struct {
	S float64 `json:"spot_price"`
	K float64 `json:"strike_price"`
	T float64 `json:"time_to_expiry"`
	R float64 `json:"risk_free_rate"`
	V float64 `json:"volatility"`
}

type ImpliedVolatilityRequest struct {
	S           float64 `json:"spot_price"`
	K           float64 `json:"strike_price"`
	T           float64 `json:"time_to_expiry"`
	R           float64 `json:"risk_free_rate"`
	MarketPrice float64 `json:"market_price"`
	IsCall      bool    `json:"is_call"`
}

type DerivativeRequest struct {
	Function string  `json:"function"`
	X        float64 `json:"x"`
	H        float64 `json:"step_size"`
}

type IntegralRequest struct {
	Function string  `json:"function"`
	Lower    float64 `json:"lower"`
	Upper    float64 `json:"upper"`
	N        int     `json:"intervals"`
}

type MonteCarloRequest struct {
	Function   string                 `json:"function"`
	Parameters map[string]interface{} `json:"parameters"`
	Samples    int                    `json:"samples"`
}
