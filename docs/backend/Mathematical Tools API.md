## Mathematical Tools API

**Base URL:** `http://localhost:8000`

A comprehensive API collection for mathematical operations used in quantitative finance and data analysis.


### Introduction

* **GET** `/api/mathematicaltools`
  *Returns overview of the mathematical tools available.*



## Linear Algebra

### Matrix Multiply

* **POST** `/api/linear/matrix-multiply`
* **Body:**

```json
{
  "matrix_a": [[1, 2, 3], [4, 5, 6]],
  "matrix_b": [[7, 8], [9, 10], [11, 12]]
}
```

### Matrix Inverse

* **POST** `/api/linear/matrix-inverse`
* **Body:**

```json
{
  "matrix": [[4, 7], [2, 6]]
}
```

---

## Statistics

### Descriptive Statistics

* **POST** `/api/stats/descriptive`
* **Body:**

```json
{
  "data": [1.2, 2.3, 3.4, 4.5, 5.6, 6.7, 7.8, 8.9, 9.1, 10.2]
}
```

### Correlation Analysis

* **POST** `/api/stats/correlation`
* **Body:**

```json
{
  "data_x": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "data_y": [2.1, 3.9, 6.2, 7.8, 10.1, 12.3, 13.9, 16.2, 18.1, 20.3]
}
```

---

## Probability Distributions

### Normal PDF

* **POST** `/api/dist/normal-pdf`
* **Body:**

```json
{
  "x": 1.5,
  "mean": 0,
  "std": 1
}
```

### Normal CDF

* **POST** `/api/dist/normal-cdf`
* **Body:**

```json
{
  "x": 1.96,
  "mean": 0,
  "std": 1
}
```

---

## Time Series Analysis

### Moving Average

* **POST** `/api/timeseries/moving-average`
* **Body:**

```json
{
  "data": [100, 102, 98, 105, 107, 103, 99, 101, 104, 106, 108, 102],
  "window": 3
}
```

### Exponential Moving Average (EMA)

* **POST** `/api/timeseries/exponential-average`
* **Body:**

```json
{
  "data": [100, 102, 98, 105, 107, 103, 99, 101, 104, 106, 108, 102],
  "alpha": 0.3
}
```

---

## Optimization

### Golden Section Search

* **POST** `/api/opt/golden-section`
* **Body:**

```json
{
  "function": "quadratic",
  "lower": 0,
  "upper": 5,
  "tolerance": 0.001
}
```

---

## Financial Mathematics

### Black-Scholes Option Pricing

* **POST** `/api/finmath/black-scholes`
* **Body:**

```json
{
  "spot_price": 100,
  "strike_price": 105,
  "time_to_expiry": 0.25,
  "risk_free_rate": 0.05,
  "volatility": 0.2
}
```

### Implied Volatility (Call)

* **POST** `/api/finmath/implied-volatility`
* **Body:**

```json
{
  "spot_price": 100,
  "strike_price": 105,
  "time_to_expiry": 0.25,
  "risk_free_rate": 0.05,
  "market_price": 2.5,
  "is_call": true
}
```

### Implied Volatility (Put)

* **POST** `/api/finmath/implied-volatility`
* **Body:**

```json
{
  "spot_price": 100,
  "strike_price": 105,
  "time_to_expiry": 0.25,
  "risk_free_rate": 0.05,
  "market_price": 6.8,
  "is_call": false
}
```


## ∫ Calculus

### Numerical Derivative

* **POST** `/api/calculus/derivative`
* **Body:**

```json
{
  "function": "quadratic",
  "x": 2.0,
  "step_size": 0.001
}
```

### Numerical Integration

* **POST** `/api/calculus/integral`
* **Body:**

```json
{
  "function": "quadratic",
  "lower": 0,
  "upper": 2,
  "intervals": 1000
}
```

## Monte Carlo Simulations

### Basic Monte Carlo (Pi Estimation)

* **POST** `/api/sim/monte-carlo`
* **Body:**

```json
{
  "function": "pi_estimation",
  "parameters": {},
  "samples": 10000
}
```
