from fastapi import APIRouter, HTTPException
from datetime import datetime
import logging

from models import (
    PortfolioAnalysisRequest, 
    AdvisorResponse, 
    AssetType, 
    RiskTolerance, 
    InvestmentGoal
)
from advisor import LysaWealthAdvisor
from services import call_openrouter_api

logger = logging.getLogger(__name__)

router = APIRouter()
advisor = LysaWealthAdvisor()


@router.get("/")
async def root():
    """Simple API info endpoint"""
    return {
        "service": "Lysa Wealth Advisor",
        "version": "1.0.0",
        "description": "AI-powered investment advisory",
        "endpoints": {
            "analyze_portfolio": "/analyze-portfolio",
            "health": "/health",
            "market_summary": "/market-summary",
            "docs": "/docs"
        },
        "status": "running"
    }


@router.post("/analyze-portfolio", response_model=AdvisorResponse)
async def analyze_portfolio(request: PortfolioAnalysisRequest):
    """Analyze user's portfolio and provide AI-powered recommendations"""
    try:
        logger.info(f"Analyzing portfolio for user with {len(request.holdings)} holdings")
        result = await advisor.analyze_portfolio(request)
        logger.info("Portfolio analysis completed successfully")
        return result
    except Exception as e:
        logger.error(f"Portfolio analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Quantum Wealth Advisor API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "cors_enabled": True
    }


@router.get("/market-summary")
async def get_market_summary():
    """Get AI-generated market summary"""
    try:
        messages = [
            {
                "role": "system", 
                "content": "You are a financial market analyst. Provide a concise market summary."
            },
            {
                "role": "user", 
                "content": "Provide a brief summary of current market conditions and key trends."
            }
        ]
        
        summary = await call_openrouter_api(messages)
        return {
            "summary": summary,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Market summary unavailable: {str(e)}")


@router.get("/asset-types")
async def get_asset_types():
    """Get available asset types"""
    return {
        "asset_types": [asset_type.value for asset_type in AssetType],
        "descriptions": {
            "stock": "Individual company stocks",
            "bond": "Government and corporate bonds",
            "etf": "Exchange-traded funds",
            "crypto": "Cryptocurrency holdings",
            "real_estate": "Real estate investments",
            "commodity": "Commodities like gold, oil, etc.",
            "cash": "Cash and cash equivalents"
        }
    }


@router.get("/risk-profiles")
async def get_risk_profiles():
    """Get available risk tolerance profiles"""
    return {
        "risk_profiles": [risk.value for risk in RiskTolerance],
        "descriptions": {
            "conservative": "Low risk, stable returns, capital preservation focus",
            "moderate": "Balanced risk/return, moderate growth potential",
            "aggressive": "Higher risk tolerance, growth-focused investments"
        }
    }


@router.get("/investment-goals")
async def get_investment_goals():
    """Get available investment goals"""
    return {
        "investment_goals": [goal.value for goal in InvestmentGoal],
        "descriptions": {
            "retirement": "Long-term retirement planning",
            "wealth_building": "General wealth accumulation",
            "income_generation": "Focus on dividend/income producing assets",
            "capital_preservation": "Protecting existing wealth",
            "education": "Saving for education expenses"
        }
    }