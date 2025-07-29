use anyhow::Result;
use colored::*;
use std::{
    collections::HashMap,
    sync::{
        atomic::AtomicBool,
        Arc,
    },
};
use tokio::sync::RwLock;

use crate::{
    config::Config,
    types::StockPrices,
    websocket::WebSocketClient,
};

#[derive(Clone)]
pub struct StockMonitor {
    config: Config,
    prices: StockPrices,
    running: Arc<AtomicBool>,
}

impl StockMonitor {
    pub fn new(config: Config) -> Self {
        Self {
            config,
            prices: Arc::new(RwLock::new(HashMap::new())),
            running: Arc::new(AtomicBool::new(true)),
        }
    }

    pub fn is_running(&self) -> Arc<AtomicBool> {
        self.running.clone()
    }

    pub async fn run(&self) -> Result<()> {
        let websocket_client = WebSocketClient::new(
            self.config.clone(),
            self.prices.clone(),
            self.running.clone()
        );
        
        websocket_client.run().await
    }

    pub async fn display_summary(&self) {
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
                price
                    .timestamp
                    .format("(%H:%M:%S UTC)")
                    .to_string()
                    .dimmed()
            );
        }
        println!("{}", "─".repeat(60));
    }
}