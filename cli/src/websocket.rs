use anyhow::{anyhow, Result};
use colored::*;
use futures_util::{SinkExt, StreamExt};
use log::{debug, error, info, warn};
use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};
use tokio::{
    select, signal,
    sync::mpsc,
    time::{interval, sleep},
};
use tokio_tungstenite::{connect_async, tungstenite::Message};
use url::Url;

use crate::{
    config::{Config, PING_INTERVAL, RECONNECT_DELAY, MAX_RECONNECT_ATTEMPTS},
    types::{StockPrice, StockPrices, SubscribeMessage, TradeData},
};

pub struct WebSocketClient {
    config: Config,
    prices: StockPrices,
    running: Arc<AtomicBool>,
}

impl WebSocketClient {
    pub fn new(config: Config, prices: StockPrices, running: Arc<AtomicBool>) -> Self {
        Self {
            config,
            prices,
            running,
        }
    }

    pub async fn run(&self) -> Result<()> {
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
            return Err(anyhow!(
                "Failed to maintain connection after {} attempts",
                MAX_RECONNECT_ATTEMPTS
            ));
        }

        Ok(())
    }

    async fn connect_and_monitor(&self) -> Result<()> {
        let ws_url = Url::parse(&self.config.websocket_url())?;

        info!("Connecting to Finnhub WebSocket...");
        let (ws_stream, _) = connect_async(ws_url).await?;
        let (mut ws_sender, mut ws_receiver) = ws_stream.split();

        info!("Connected successfully! Subscribing to symbols...");

        // Subscribe to all symbols
        for symbol in &self.config.symbols {
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
                    stock_price
                        .timestamp
                        .format("%H:%M:%S UTC")
                        .to_string()
                        .dimmed()
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

                // Sending periodic pings
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

    async fn process_message(
        &self,
        text: &str,
        price_tx: &mpsc::UnboundedSender<StockPrice>,
    ) -> Result<()> {
        if let Ok(trade_data) = serde_json::from_str::<TradeData>(text) {
            if trade_data.msg_type == "trade" {
                for trade in trade_data.data {
                    let stock_price = StockPrice::from_trade(trade);

                    if let Err(e) = price_tx.send(stock_price) {
                        warn!("Failed to send price update: {}", e);
                    }
                }
            }
        }
        Ok(())
    }
}