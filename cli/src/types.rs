use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::Arc};
use tokio::sync::RwLock;

#[derive(Debug, Serialize, Deserialize)]
pub struct SubscribeMessage {
    #[serde(rename = "type")]
    pub msg_type: String,
    pub symbol: String,
}

#[derive(Debug, Deserialize)]
pub struct TradeData {
    #[serde(rename = "type")]
    pub msg_type: String,
    pub data: Vec<Trade>,
}

#[derive(Debug, Deserialize)]
pub struct Trade {
    #[serde(rename = "s")]
    pub symbol: String,
    #[serde(rename = "p")]
    pub price: f64,
    #[serde(rename = "t")]
    pub timestamp: i64,
    #[serde(rename = "v")]
    pub volume: f64,
}

#[derive(Debug, Clone)]
pub struct StockPrice {
    pub symbol: String,
    pub price: f64,
    pub timestamp: DateTime<Utc>,
    pub volume: f64,
}

impl StockPrice {
    pub fn from_trade(trade: Trade) -> Self {
        Self {
            symbol: trade.symbol,
            price: trade.price,
            timestamp: DateTime::from_timestamp_millis(trade.timestamp)
                .unwrap_or_else(Utc::now),
            volume: trade.volume,
        }
    }
}

pub type StockPrices = Arc<RwLock<HashMap<String, StockPrice>>>;