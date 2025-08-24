#!/usr/bin/env python3
"""
Test script for OpenRouter API connection
Run this to verify your API key and connection before using the main app
"""

import os
from openai import OpenAI

def test_openrouter_connection():
    """Test OpenRouter API connection"""
    
    # Check if API key is set
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("❌ OPENROUTER_API_KEY environment variable not set")
        print("Please set it with: export OPENROUTER_API_KEY='your-key-here'")
        return False
    
    print(f"✅ API key found: {api_key[:10]}...")
    
    try:
        # Initialize client with minimal parameters
        print("🔄 Initializing OpenAI client...")
        client = OpenAI(
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1"
        )
        print("✅ Client initialized successfully")
        
        # Test a simple API call
        print("🔄 Testing API call...")
        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say hello in exactly 5 words."}
        ]
        
        response = client.chat.completions.create(
            model="deepseek/deepseek-chat-v3.1",
            messages=messages,
            temperature=0.7,
            max_tokens=50
        )
        
        if response.choices and response.choices[0].message.content:
            print("✅ API call successful!")
            print(f"Response: {response.choices[0].message.content}")
            return True
        else:
            print("❌ Empty response from API")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        
        # Check for common errors
        if "401" in str(e):
            print("🔍 This looks like an authentication error. Check your API key.")
        elif "quota" in str(e).lower():
            print("🔍 This looks like a quota/billing error. Check your OpenRouter account.")
        elif "proxies" in str(e):
            print("🔍 This looks like a client library compatibility issue.")
            print("Try updating openai library: pip install --upgrade openai")
        
        return False

if __name__ == "__main__":
    print("🚀 Testing OpenRouter API connection...\n")
    
    success = test_openrouter_connection()
    
    print("\n" + "="*50)
    if success:
        print("🎉 All tests passed! Your API is ready to use.")
        print("You can now run: python main.py")
    else:
        print("💥 Tests failed. Please fix the issues above.")
        print("\nTroubleshooting steps:")
        print("1. Verify your API key is correct")
        print("2. Check your OpenRouter account balance")
        print("3. Try: pip install --upgrade openai")
    print("="*50)