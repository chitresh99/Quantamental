import asyncio
import websockets
import json
import sys
from datetime import datetime

async def test_connection(token):
    url = f"wss://ws.finnhub.io?token={token}"
    print(f"Connecting to Finnhub...")
    print(f"URL: {url[:30]}...{url[-10:]}")
    print(f"Current time: {datetime.now()}")
    print("Note: Market is closed on weekends - you'll only see ping messages\n")
    
    try:
        async with websockets.connect(url) as websocket:
            print("Connected successfully!")
            symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "BINANCE:BTCUSDT"]
            for symbol in symbols:
                subscribe_msg = json.dumps({"type": "subscribe", "symbol": symbol})
                print(f"Subscribing to {symbol}")
                await websocket.send(subscribe_msg)
                await asyncio.sleep(0.1)
            
            print("\nListening for messages (Ctrl+C to stop)...")
            print("During market hours (Mon-Fri 9:30 AM - 4:00 PM ET), you'll see trades")
            print("Outside market hours, you'll mainly see ping messages\n")
            
            ping_count = 0
            trade_count = 0
            
            while True:
                message = await websocket.recv()
                data = json.loads(message)
                
                if data.get("type") == "ping":
                    ping_count += 1
                    print(f"Ping #{ping_count} received at {datetime.now().strftime('%H:%M:%S')}")
                elif data.get("type") == "trade" and "data" in data:
                    trade_count += 1
                    print(f"\n TRADE DATA #{trade_count}:")
                    for trade in data["data"]:
                        symbol = trade.get('s', 'N/A')
                        price = trade.get('p', 0)
                        volume = trade.get('v', 0)
                        timestamp = trade.get('t', 0)
                        trade_time = datetime.fromtimestamp(timestamp/1000).strftime('%H:%M:%S') if timestamp else 'N/A'
                        print(f"  → {symbol}: ${price:.2f} | Volume: {volume} | Time: {trade_time}")
                elif data.get("type") == "error":
                    print(f" Error from server: {data.get('msg', 'Unknown error')}")
                else:
                    print(f"Other message: {data}")
                        
    except KeyboardInterrupt:
        print("\n\n Stopped by user")
        print(f" Summary: Received {ping_count} pings and {trade_count} trade messages")
    except websockets.exceptions.WebSocketException as e:
        print(f"WebSocket error: {e}")
    except Exception as e:
        print(f" Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python test_improved.py YOUR_API_TOKEN")
        sys.exit(1)
    
    token = sys.argv[1]

    if datetime.now().weekday() >= 5:
        print("It's the weekend - US stock market is closed")
        print("You'll only see ping messages, not trade data")
        print("Try on a weekday during market hours for live trade data\n")
    
    asyncio.run(test_connection(token))