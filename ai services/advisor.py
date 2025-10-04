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
        
        FORMAT YOUR RESPONSE AS FOLLOWS:
        
        1. Start with a brief executive summary paragraph
        2. Use clear section headers with ## markdown syntax
        3. Use bullet points (- ) for lists of recommendations
        4. Be specific and actionable
        5. Include numerical data where relevant
        
        Your response will be parsed, so structure it clearly with:
        - A RECOMMENDATIONS section with bullet points
        - A RISK ASSESSMENT section
        - NEXT STEPS section with action items
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
        
        Please provide a structured analysis with the following sections:
        
        ## EXECUTIVE SUMMARY
        Brief overview of the portfolio's current state
        
        ## PORTFOLIO ANALYSIS
        Detailed analysis of holdings, performance, and allocation
        
        ## RECOMMENDATIONS
        - [List 4-6 specific, actionable recommendations as bullet points]
        
        ## RISK ASSESSMENT
        Detailed risk analysis considering user's profile and current holdings
        
        ## NEXT STEPS
        - [List 4-5 immediate action items as bullet points]
        
        Consider the user's age ({request.user_profile.age}), risk tolerance ({request.user_profile.risk_tolerance.value}), 
        goals, and time horizon ({request.user_profile.time_horizon} years) in your analysis.
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
        lines = response.split('\n')
        recommendations = []
        in_recommendations = False
        
        for line in lines:
            line = line.strip()
            
            # Look for the RECOMMENDATIONS section
            if 'RECOMMENDATION' in line.upper() and '##' in line:
                in_recommendations = True
                continue
            
            # Stop at next section
            if in_recommendations and line.startswith('##'):
                break
            
            # Extract bullet points
            if in_recommendations and line:
                if line.startswith('- '):
                    recommendations.append(line[2:].strip())
                elif line.startswith('• '):
                    recommendations.append(line[2:].strip())
                elif line.startswith('* '):
                    recommendations.append(line[2:].strip())
                elif line[0:1].isdigit() and '. ' in line:
                    # Handle numbered lists like "1. recommendation"
                    recommendations.append(line.split('. ', 1)[1].strip())
        
        # Fallback if extraction failed
        if not recommendations:
            recommendations = [
                "Diversify holdings across multiple asset classes",
                "Rebalance portfolio to match target allocation",
                "Review and adjust based on market conditions",
                "Consider tax-loss harvesting opportunities",
                "Maintain emergency fund before investing"
            ]
        
        return recommendations[:6]  # Return max 6 recommendations
    
    def _extract_next_steps(self, response: str) -> List[str]:
        """Extract next steps from AI response"""
        lines = response.split('\n')
        next_steps = []
        in_next_steps = False
        
        for line in lines:
            line = line.strip()
            
            # Look for NEXT STEPS section
            if 'NEXT STEP' in line.upper() and '##' in line:
                in_next_steps = True
                continue
            
            # Stop at next section or end
            if in_next_steps and line.startswith('##'):
                break
            
            # Extract bullet points
            if in_next_steps and line:
                if line.startswith('- '):
                    next_steps.append(line[2:].strip())
                elif line.startswith('• '):
                    next_steps.append(line[2:].strip())
                elif line.startswith('* '):
                    next_steps.append(line[2:].strip())
                elif line[0:1].isdigit() and '. ' in line:
                    next_steps.append(line.split('. ', 1)[1].strip())
        
        # Fallback
        if not next_steps:
            next_steps = [
                "Review and rebalance portfolio quarterly",
                "Set up automated contributions if possible",
                "Monitor holdings for significant changes",
                "Reassess goals and risk tolerance annually"
            ]
        
        return next_steps[:5]  # Return max 5 steps
    
    def _extract_risk_assessment(self, response: str) -> str:
        """Extract risk assessment from AI response"""
        lines = response.split('\n')
        risk_lines = []
        in_risk_section = False
        
        for line in lines:
            line = line.strip()
            
            # Look for RISK ASSESSMENT section
            if 'RISK ASSESSMENT' in line.upper() and '##' in line:
                in_risk_section = True
                continue
            
            # Stop at next section
            if in_risk_section and line.startswith('##'):
                break
            
            # Collect risk assessment content
            if in_risk_section and line and not line.startswith('#'):
                risk_lines.append(line)
        
        risk_assessment = ' '.join(risk_lines).strip()
        
        # Fallback
        if not risk_assessment or len(risk_assessment) < 50:
            risk_assessment = "Portfolio risk should be evaluated based on diversification, volatility, and alignment with investor's risk tolerance and time horizon."
        
        return risk_assessment
    
    def _generate_allocation_suggestions(self, profile: UserProfile) -> Dict[str, float]:
        """Generate suggested asset allocation based on user profile"""
        age = profile.age
        risk_tolerance = profile.risk_tolerance.value
        
        # Age-based rule of thumb: (100 - age)% in stocks
        stock_base = max(20, min(90, 100 - age))
        
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