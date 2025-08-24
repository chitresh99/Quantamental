from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class AssetType(str, Enum):
    STOCK = "stock"
    BOND = "bond"
    ETF = "etf"
    CRYPTO = "crypto"
    REAL_ESTATE = "real_estate"
    COMMODITY = "commodity"
    CASH = "cash"


class RiskTolerance(str, Enum):
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"


class InvestmentGoal(str, Enum):
    RETIREMENT = "retirement"
    WEALTH_BUILDING = "wealth_building"
    INCOME_GENERATION = "income_generation"
    CAPITAL_PRESERVATION = "capital_preservation"
    EDUCATION = "education"


class PortfolioHolding(BaseModel):
    symbol: str = Field(..., description="Stock/Asset symbol")
    name: str = Field(..., description="Asset name")
    asset_type: AssetType
    quantity: float = Field(..., gt=0)
    current_price: float = Field(..., gt=0)
    purchase_price: float = Field(..., gt=0)
    purchase_date: str = Field(..., description="YYYY-MM-DD format")
    
    @validator('purchase_date')
    def validate_date(cls, v):
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError('Date must be in YYYY-MM-DD format')


class UserProfile(BaseModel):
    age: int = Field(..., ge=18, le=100)
    annual_income: float = Field(..., gt=0)
    investment_experience: str = Field(..., pattern="^(beginner|intermediate|advanced)$")
    risk_tolerance: RiskTolerance
    investment_goals: List[InvestmentGoal]
    time_horizon: int = Field(..., ge=1, le=50, description="Investment time horizon in years")
    liquidity_needs: float = Field(..., ge=0, description="Percentage of portfolio needed as liquid assets")


class PortfolioAnalysisRequest(BaseModel):
    user_profile: UserProfile
    holdings: List[PortfolioHolding]
    additional_context: Optional[str] = None


class AdvisorResponse(BaseModel):
    analysis: str
    recommendations: List[str]
    risk_assessment: str
    diversification_score: float = Field(..., ge=0, le=10)
    suggested_allocations: Dict[str, float]
    next_steps: List[str]
    confidence_score: float = Field(..., ge=0, le=1)
    timestamp: datetime