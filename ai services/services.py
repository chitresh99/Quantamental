from typing import List, Dict
from fastapi import HTTPException
import tenacity
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import logging

from config import (
    get_client, 
    DEFAULT_TEMPERATURE, 
    DEFAULT_MAX_TOKENS, 
    MAX_RETRY_ATTEMPTS, 
    RETRY_MIN_WAIT, 
    RETRY_MAX_WAIT,
    DEFAULT_MODEL
)

logger = logging.getLogger(__name__)


@retry(
    stop=stop_after_attempt(MAX_RETRY_ATTEMPTS),
    wait=wait_exponential(multiplier=1, min=RETRY_MIN_WAIT, max=RETRY_MAX_WAIT),
    retry=retry_if_exception_type((Exception,)),
    before_sleep=lambda retry_state: logger.info(f"Retrying API call, attempt {retry_state.attempt_number}")
)
async def call_openrouter_api(messages: List[Dict[str, str]], model: str = DEFAULT_MODEL) -> str:
    """Call OpenRouter API with retry logic and error handling"""
    try:
        client = get_client()
        
        logger.info(f"Making API call to model: {model}")
        
        completion = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=DEFAULT_TEMPERATURE,
            max_tokens=DEFAULT_MAX_TOKENS
        )
        
        if not completion.choices or not completion.choices[0].message.content:
            raise Exception("Empty response from AI service")
            
        return completion.choices[0].message.content
        
    except tenacity.RetryError as e:
        logger.error(f"API call failed after all retries: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="AI service is currently unavailable after multiple attempts"
        )
    except Exception as e:
        logger.error(f"OpenRouter API call failed: {str(e)}")
        logger.error(f"Error type: {type(e).__name__}")
        
        if "401" in str(e) or "unauthorized" in str(e).lower():
            raise HTTPException(
                status_code=401, 
                detail="Invalid API key. Please check your OPENROUTER_API_KEY environment variable."
            )
        
        raise Exception(f"AI service error: {str(e)}")