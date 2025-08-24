# LYSA Wealth Advisor - Postman Testing Guide

## Quick Setup

### Option 1: Import Collection (Recommended)
1. Copy the JSON collection from the artifact above
2. Open Postman → **Import** → Paste the JSON
3. The entire collection will be imported with all requests ready to use

### Option 2: Manual Setup
Create requests manually using the examples below.

---

## Individual Request Examples

### 1. **GET /** - API Info
```
Method: GET
URL: http://localhost:8000/
Headers: None
```

**Expected Response:**
```json
{
  "service": "Quantum Wealth Advisor API",
  "version": "1.0.0",
  "description": "AI-powered investment advisory platform",
  "endpoints": {...},
  "status": "running"
}
```

---

### 2. **GET /health** - Health Check
```
Method: GET
URL: http://localhost:8000/health
Headers: None
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "Quantum Wealth Advisor API",
  "version": "1.0.0",
  "timestamp": "2025-01-XX...",
  "cors_enabled": true
}
```

---

### 3. **GET /asset-types** - Available Asset Types
```
Method: GET
URL: http://localhost:8000/asset-types
Headers: None
```

---

### 4. **GET /risk-profiles** - Risk Tolerance Profiles
```
Method: GET
URL: http://localhost:8000/risk-profiles
Headers: None
```

---

### 5. **GET /investment-goals** - Available Investment Goals
```
Method: GET
URL: http://localhost:8000/investment-goals
Headers: None
```

---

### 6. **GET /market-summary** - AI Market Analysis
```
Method: GET
URL: http://localhost:8000/market-summary
Headers: None
```

**Note:** This requires your OPENROUTER_API_KEY to be set!

---

### 7. **POST /analyze-portfolio** - Main Portfolio Analysis

#### Conservative Investor Example:
```
Method: POST
URL: http://localhost:8000/analyze-portfolio
Headers: 
  Content-Type: application/json
```

**Body (JSON):**
```json
{
  "user_profile": {
    "age": 45,
    "annual_income": 85000,
    "investment_experience": "intermediate",
    "risk_tolerance": "conservative",
    "investment_goals": ["retirement", "capital_preservation"],
    "time_horizon": 20,
    "liquidity_needs": 15.0
  },
  "holdings": [
    {
      "symbol": "VOO",
      "name": "Vanguard S&P 500 ETF",
      "asset_type": "etf",
      "quantity": 50,
      "current_price": 420.0,
      "purchase_price": 380.0,
      "purchase_date": "2023-01-15"
    },
    {
      "symbol": "BND",
      "name": "Vanguard Total Bond Market ETF",
      "asset_type": "etf",
      "quantity": 100,
      "current_price": 78.5,
      "purchase_price": 82.0,
      "purchase_date": "2023-02-01"
    }
  ],
  "additional_context": "Looking to retire in 20 years and want to preserve capital while maintaining some growth potential."
}
```

#### Aggressive Young Investor Example:
```json
{
  "user_profile": {
    "age": 28,
    "annual_income": 75000,
    "investment_experience": "beginner",
    "risk_tolerance": "aggressive",
    "investment_goals": ["wealth_building"],
    "time_horizon": 35,
    "liquidity_needs": 5.0
  },
  "holdings": [
    {
      "symbol": "TSLA",
      "name": "Tesla Inc",
      "asset_type": "stock",
      "quantity": 10,
      "current_price": 210.0,
      "purchase_price": 180.0,
      "purchase_date": "2024-01-20"
    },
    {
      "symbol": "NVDA",
      "name": "NVIDIA Corporation",
      "asset_type": "stock",
      "quantity": 5,
      "current_price": 450.0,
      "purchase_price": 400.0,
      "purchase_date": "2024-02-15"
    },
    {
      "symbol": "BTC",
      "name": "Bitcoin",
      "asset_type": "crypto",
      "quantity": 0.1,
      "current_price": 45000.0,
      "purchase_price": 42000.0,
      "purchase_date": "2024-03-01"
    }
  ],
  "additional_context": "Young professional looking to build wealth aggressively over the long term."
}
```

---

## 🔧 Testing Tips

### Environment Variables in Postman
1. Create an **Environment** in Postman
2. Add variable: `base_url` = `http://localhost:8000`
3. Use `{{base_url}}` in your requests

### Testing Different Scenarios

**Asset Types to Test:**
- `stock` - Individual stocks
- `bond` - Government/corporate bonds  
- `etf` - Exchange-traded funds
- `crypto` - Cryptocurrency
- `real_estate` - REITs
- `commodity` - Gold, oil, etc.
- `cash` - Cash equivalents

**Risk Tolerance Options:**
- `conservative`
- `moderate` 
- `aggressive`

**Investment Experience:**
- `beginner`
- `intermediate`
- `advanced`

**Investment Goals:**
- `retirement`
- `wealth_building`
- `income_generation`
- `capital_preservation`
- `education`

---

## Troubleshooting

### Common Issues:

1. **Connection Error**: Make sure your API is running on port 8000
2. **API Key Error**: Set `OPENROUTER_API_KEY` environment variable
3. **Validation Error**: Check that all required fields are included
4. **Date Format**: Use `YYYY-MM-DD` format for purchase_date

### Test Endpoints First:
1. Start with `GET /health` to verify the API is running
2. Test `GET /` to see the API info
3. Try simple `GET` endpoints before `POST`

---

## Expected Response Format

The portfolio analysis endpoint returns:
```json
{
  "analysis": "Detailed AI analysis text...",
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "risk_assessment": "Risk analysis text...",
  "diversification_score": 7.5,
  "suggested_allocations": {
    "stocks": 60.0,
    "bonds": 30.0,
    "alternatives": 10.0
  },
  "next_steps": ["Step 1", "Step 2"],
  "confidence_score": 0.85,
  "timestamp": "2025-01-XX..."
}
```

Happy testing!