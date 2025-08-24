from typing import List, Dict, Any
from datetime import datetime
import json
import logging
from fastapi import HTTPException

from models import PortfolioHolding, PortfolioAnalysisRequest, UserProfile, AdvisorResponse
from services import call_openrouter_api

logger = logging.getLogger(__name__)


class LysaWealthAdvisor:
    """Main advisor class with sophisticated analysis capabilities"""
    
    def __init__(self):
        self.system_prompt = """
        You are Lysa Wealth Advisor, an elite AI investment consultant with expertise in:
        - Modern Portfolio Theory and asset allocation
        - Risk management and diversification strategies  
        - Market analysis and trend identification
        - Tax-efficient investing strategies
        - Behavioral finance principles
        
        Provide comprehensive, personalized investment advice based on the user's profile and current holdings.
        Be specific, actionable, and consider both quantitative metrics and qualitative factors.
        Always emphasize risk management and long-term wealth building principles.
        
        Format your response as a professional investment advisory report.
        """
    
    def calculate_portfolio_metrics(self, holdings: List[PortfolioHolding]) -> Dict[str, Any]:
        """Calculate basic portfolio metrics"""
        total_value = sum(h.quantity * h.current_price for h in holdings)
        total_cost = sum(h.quantity * h.purchase_price for h in holdings)
        
        if total_cost == 0:
            return {"error": "Invalid portfolio data"}
            
        total_return = (total_value - total_cost) / total_cost * 100
        
        # Asset allocation
        allocation = {}
        for holding in holdings:
            asset_type = holding.asset_type.value
            value = holding.quantity * holding.current_price
            allocation[asset_type] = allocation.get(asset_type, 0) + (value / total_value * 100)
        
        # Calculate diversification score (simplified Herfindahl index)
        concentration_score = sum((weight/100)**2 for weight in allocation.values())
        diversification_score = max(0, min(10, (1 - concentration_score) * 10))
        
        return {
            "total_value": total_value,
            "total_return_pct": total_return,
            "asset_allocation": allocation,
            "diversification_score": diversification_score,
            "num_holdings": len(holdings)
        }
    
    async def analyze_portfolio(self, request: PortfolioAnalysisRequest) -> AdvisorResponse:
        """Comprehensive portfolio analysis using AI"""
        
        # Calculate portfolio metrics
        metrics = self.calculate_portfolio_metrics(request.holdings)
        
        # Prepare context for AI analysis
        portfolio_summary = {
            "user_profile": request.user_profile.dict(),
            "portfolio_metrics": metrics,
            "holdings": [
                {
                    "symbol": h.symbol,
                    "name": h.name,
                    "type": h.asset_type.value,
                    "value": h.quantity * h.current_price,
                    "return_pct": ((h.current_price - h.purchase_price) / h.purchase_price * 100)
                } for h in request.holdings
            ]
        }
        
        analysis_prompt = f"""
        Analyze this investment portfolio and provide comprehensive advice:
        
        PORTFOLIO DATA:
        {json.dumps(portfolio_summary, indent=2)}
        
        ADDITIONAL CONTEXT:
        {request.additional_context or "No additional context provided"}
        
        Please provide:
        1. Overall portfolio analysis and performance assessment
        2. Specific recommendations for improvement
        3. Risk assessment considering user's profile
        4. Suggested asset allocation adjustments
        5. Actionable next steps
        
        Consider the user's age, risk tolerance, goals, and time horizon in your analysis.
        """
        
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": analysis_prompt}
        ]
        
        try:
            ai_response = await call_openrouter_api(messages)
            
            # Parse AI response and structure it
            recommendations = self._extract_recommendations(ai_response)
            next_steps = self._extract_next_steps(ai_response)
            risk_assessment = self._extract_risk_assessment(ai_response)
            
            # Generate suggested allocations based on user profile
            suggested_allocations = self._generate_allocation_suggestions(request.user_profile)
            
            return AdvisorResponse(
                analysis=ai_response,
                recommendations=recommendations,
                risk_assessment=risk_assessment,
                diversification_score=metrics.get("diversification_score", 5.0),
                suggested_allocations=suggested_allocations,
                next_steps=next_steps,
                confidence_score=0.85,  # This could be dynamic based on data quality
                timestamp=datetime.now()
            )
            
        except Exception as e:
            logger.error(f"Portfolio analysis failed: {str(e)}")
            raise HTTPException(status_code=500, detail="Analysis service temporarily unavailable")
    
    def _extract_recommendations(self, response: str) -> List[str]:
        """Extract recommendations from AI response"""
        # Simple extraction - in production, you'd use more sophisticated parsing
        lines = response.split('\n')
        recommendations = []
        in_recommendations = False
        
        for line in lines:
            line = line.strip()
            if 'recommendation' in line.lower() or 'suggest' in line.lower():
                in_recommendations = True
            elif in_recommendations and line and not line.startswith('#'):
                if line.startswith('- ') or line.startswith('• '):
                    recommendations.append(line[2:])
                elif line and len(recommendations) < 5:
                    recommendations.append(line)
        
        return recommendations[:5] if recommendations else ["Maintain current allocation", "Regular portfolio review recommended"]
    
    def _extract_next_steps(self, response: str) -> List[str]:
        """Extract next steps from AI response"""
        default_steps = [
            "Review and rebalance portfolio quarterly",
            "Consider tax-loss harvesting opportunities",
            "Increase emergency fund if needed",
            "Research additional diversification options"
        ]
        return default_steps  # Simplified for this example
    
    def _extract_risk_assessment(self, response: str) -> str:
        """Extract risk assessment from AI response"""
        # Look for risk-related content in the response
        sentences = response.split('.')
        for sentence in sentences:
            if any(word in sentence.lower() for word in ['risk', 'volatile', 'conservative', 'aggressive']):
                return sentence.strip()
        return "Risk assessment requires individual evaluation based on current market conditions."
    
    def _generate_allocation_suggestions(self, profile: UserProfile) -> Dict[str, float]:
        """Generate suggested asset allocation based on user profile"""
        age = profile.age
        risk_tolerance = profile.risk_tolerance.value
        
        # Age-based rule of thumb: (100 - age)% in stocks
        stock_base = max(20, min(80, 100 - age))
        
        # Adjust based on risk tolerance
        if risk_tolerance == "conservative":
            stock_pct = max(20, stock_base - 20)
            bond_pct = min(70, 100 - stock_pct - 10)
        elif risk_tolerance == "aggressive":
            stock_pct = min(90, stock_base + 20)
            bond_pct = max(5, 100 - stock_pct - 15)
        else:  # moderate
            stock_pct = stock_base
            bond_pct = max(15, 100 - stock_pct - 10)
        
        other_pct = max(5, 100 - stock_pct - bond_pct)
        
        return {
            "stocks": round(stock_pct, 1),
            "bonds": round(bond_pct, 1),
            "alternatives": round(other_pct, 1)
        }