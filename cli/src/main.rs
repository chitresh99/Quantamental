use anyhow::{anyhow, Result};
use chrono::{DateTime, Utc};
use clap::{Arg, Command};
use colored::*;
use futures_util::{SinkExt, StreamExt};
use log::{debug, error, info, warn};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    },
    time::Duration,
};
use tokio::{
    select,
    signal,
    sync::{mpsc, RwLock},
    time::{interval, sleep},
};
use tokio_tungstenite::{connect_async, tungstenite::Message};
use url::Url;

// Configuration constants
const WS_URL: &str = "wss://ws.finnhub.io";
const RECONNECT_DELAY: Duration = Duration::from_secs(5);
const PING_INTERVAL: Duration = Duration::from_secs(30);
const MAX_RECONNECT_ATTEMPTS: u32 = 10;

#[derive(Debug, Serialize, Deserialize)]
struct SubscribeMessage {
    #[serde(rename = "type")]
    msg_type: String,
    symbol: String,
}

#[derive(Debug, Deserialize)]
struct TradeData {
    #[serde(rename = "type")]
    msg_type: String,
    data: Vec<Trade>,
}

#[derive(Debug, Deserialize)]
struct Trade {
    #[serde(rename = "s")]
    symbol: String,
    #[serde(rename = "p")]
    price: f64,
    #[serde(rename = "t")]
    timestamp: i64,
    #[serde(rename = "v")]
    volume: f64,
}

#[derive(Debug, Clone)]
struct StockPrice {
    symbol: String,
    price: f64,
    timestamp: DateTime<Utc>,
    volume: f64,
}

type StockPrices = Arc<RwLock<HashMap<String, StockPrice>>>;

#[derive(Clone)]
struct StockMonitor {
    api_token: String,
    symbols: Vec<String>,
    prices: StockPrices,
    running: Arc<AtomicBool>,
}

impl StockMonitor {
    fn new(api_token: String, symbols: Vec<String>) -> Self {
        Self {
            api_token,
            symbols,
            prices: Arc::new(RwLock::new(HashMap::new())),
            running: Arc::new(AtomicBool::new(true)),
        }
    }

    async fn run(&self) -> Result<()> {
        let mut reconnect_attempts = 0;

        while self.running.load(Ordering::Relaxed) && reconnect_attempts < MAX_RECONNECT_ATTEMPTS {
            match self.connect_and_monitor().await {
                Ok(_) => {
                    info!("WebSocket connection closed normally");
                    break;
                }
                Err(e) => {
                    reconnect_attempts += 1;
                    error!(
                        "Connection failed (attempt {}/{}): {}",
                        reconnect_attempts, MAX_RECONNECT_ATTEMPTS, e
                    );

                    if reconnect_attempts < MAX_RECONNECT_ATTEMPTS {
                        warn!("Reconnecting in {} seconds...", RECONNECT_DELAY.as_secs());
                        sleep(RECONNECT_DELAY).await;
                    }
                }
            }
        }

        if reconnect_attempts >= MAX_RECONNECT_ATTEMPTS {
            error!("Max reconnection attempts reached. Exiting.");
            return Err(anyhow!("Failed to maintain connection after {} attempts", MAX_RECONNECT_ATTEMPTS));
        }

        Ok(())
    }

    async fn connect_and_monitor(&self) -> Result<()> {
        let url = format!("{}?token={}", WS_URL, self.api_token);
        let ws_url = Url::parse(&url)?;
        
        info!("Connecting to Finnhub WebSocket...");
        let (ws_stream, _) = connect_async(ws_url).await?;
        let (mut ws_sender, mut ws_receiver) = ws_stream.split();

        info!("Connected successfully! Subscribing to symbols...");

        // Subscribe to all symbols
        for symbol in &self.symbols {
            let subscribe_msg = SubscribeMessage {
                msg_type: "subscribe".to_string(),
                symbol: symbol.clone(),
            };
            let msg = Message::Text(serde_json::to_string(&subscribe_msg)?);
            ws_sender.send(msg).await?;
            info!("Subscribed to {}", symbol.green().bold());
        }

        // Setup channels for communication
        let (price_tx, mut price_rx) = mpsc::unbounded_channel::<StockPrice>();
        let (ping_tx, mut ping_rx) = mpsc::unbounded_channel::<()>();
        let _running = self.running.clone();
        let running_ping = self.running.clone();
        let running_main = self.running.clone();
        let prices = self.prices.clone();

        // Spawn price update handler
        let update_prices = tokio::spawn(async move {
            while let Some(stock_price) = price_rx.recv().await {
                let mut prices = prices.write().await;
                prices.insert(stock_price.symbol.clone(), stock_price.clone());
                drop(prices);
                
                // Display the update
                println!(
                    "{} {} ${:.2} Vol: {:.0} @ {}",
                    "^".green(),
                    stock_price.symbol.cyan().bold(),
                    stock_price.price,
                    stock_price.volume,
                    stock_price.timestamp.format("%H:%M:%S UTC").to_string().dimmed()
                );
            }
        });

        // Setup ping interval
        let mut ping_interval = interval(PING_INTERVAL);
        
        // Spawn ping sender task
        tokio::spawn(async move {
            while running_ping.load(Ordering::Relaxed) {
                ping_interval.tick().await;
                if ping_tx.send(()).is_err() {
                    break;
                }
            }
        });

        // Main loop
        loop {
            select! {
                // Handle incoming WebSocket messages
                msg = ws_receiver.next() => {
                    match msg {
                        Some(Ok(Message::Text(text))) => {
                            debug!("Received: {}", text);
                            if let Err(e) = self.process_message(&text, &price_tx).await {
                                warn!("Failed to process message: {}", e);
                            }
                        }
                        Some(Ok(Message::Ping(data))) => {
                            debug!("Received ping, sending pong");
                            ws_sender.send(Message::Pong(data)).await?;
                        }
                        Some(Ok(Message::Close(_))) => {
                            info!("WebSocket closed by server");
                            break;
                        }
                        Some(Err(e)) => {
                            error!("WebSocket error: {}", e);
                            return Err(e.into());
                        }
                        None => {
                            warn!("WebSocket stream ended");
                            break;
                        }
                        _ => {}
                    }
                }
                
                // Send periodic pings
                _ = ping_rx.recv() => {
                    debug!("Sending ping");
                    if let Err(e) = ws_sender.send(Message::Ping(vec![])).await {
                        error!("Failed to send ping: {}", e);
                        return Err(e.into());
                    }
                }
                
                // Handle shutdown signal
                _ = signal::ctrl_c() => {
                    info!("Shutdown signal received");
                    running_main.store(false, Ordering::Relaxed);
                    break;
                }
            }

            if !running_main.load(Ordering::Relaxed) {
                break;
            }
        }

        // Cleanup
        update_prices.abort();
        Ok(())
    }

    async fn process_message(&self, text: &str, price_tx: &mpsc::UnboundedSender<StockPrice>) -> Result<()> {
        if let Ok(trade_data) = serde_json::from_str::<TradeData>(text) {
            if trade_data.msg_type == "trade" {
                for trade in trade_data.data {
                    let stock_price = StockPrice {
                        symbol: trade.symbol,
                        price: trade.price,
                        timestamp: DateTime::from_timestamp_millis(trade.timestamp)
                            .unwrap_or_else(Utc::now),
                        volume: trade.volume,
                    };
                    
                    if let Err(e) = price_tx.send(stock_price) {
                        warn!("Failed to send price update: {}", e);
                    }
                }
            }
        }
        Ok(())
    }

    async fn display_summary(&self) {
        let prices = self.prices.read().await;
        if prices.is_empty() {
            println!("{}", "No price data available yet.".yellow());
            return;
        }

        println!("\n{}", "$ Current Stock Prices".blue().bold());
        println!("{}", "─".repeat(60));
        
        for (symbol, price) in prices.iter() {
            println!(
                "{:<8} ${:>8.2} Vol: {:>10.0} {}",
                symbol.cyan().bold(),
                price.price,
                price.volume,
                price.timestamp.format("(%H:%M:%S UTC)").to_string().dimmed()
            );
        }
        println!("{}", "─".repeat(60));
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    env_logger::init();

    let matches = Command::new("Stock Price Monitor")
        .version("0.1.0")
        .author("Your Name")
        .about("Monitor live stock prices using Finnhub WebSocket API")
        .arg(
            Arg::new("token")
                .short('t')
                .long("token")
                .value_name("TOKEN")
                .help("Finnhub API token")
                .required(true)
        )
        .arg(
            Arg::new("symbols")
                .short('s')
                .long("symbols")
                .value_name("SYMBOLS")
                .help("Comma-separated list of stock symbols to monitor")
                .default_value("AAPL,GOOGL,MSFT,TSLA")
        )
        .arg(
            Arg::new("summary")
                .long("summary")
                .help("Show summary every 30 seconds")
                .action(clap::ArgAction::SetTrue)
        )
        .get_matches();

    let api_token = matches.get_one::<String>("token").unwrap().clone();
    let symbols_str = matches.get_one::<String>("symbols").unwrap();
    let show_summary = matches.get_flag("summary");
    
    let symbols: Vec<String> = symbols_str
        .split(',')
        .map(|s| s.trim().to_uppercase())
        .collect();

    println!("{}", "Quantamental CLI Starting".green().bold());
    println!("Monitoring symbols: {}", symbols.join(", ").cyan());
    println!("Press Ctrl+C to stop\n");

    let monitor = StockMonitor::new(api_token, symbols);
    
    // Optionally show periodic summaries
    if show_summary {
        let summary_monitor = monitor.clone();
        let running = monitor.running.clone();
        
        tokio::spawn(async move {
            let mut summary_interval = interval(Duration::from_secs(30));
            
            while running.load(Ordering::Relaxed) {
                summary_interval.tick().await;
                summary_monitor.display_summary().await;
            }
        });
    }

    // Run the main monitor
    if let Err(e) = monitor.run().await {
        error!("Monitor failed: {}", e);
        std::process::exit(1);
    }

    println!("{}", "Stock Price Monitor stopped".yellow());
    Ok(())
}