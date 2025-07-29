use std::time::Duration;

// config constants
pub const WS_URL: &str = "wss://ws.finnhub.io";
pub const RECONNECT_DELAY: Duration = Duration::from_secs(5);
pub const PING_INTERVAL: Duration = Duration::from_secs(30);
pub const MAX_RECONNECT_ATTEMPTS: u32 = 10;

#[derive(Clone, Debug)]
pub struct Config {
    pub api_token: String,
    pub symbols: Vec<String>,
}

impl Config {
    pub fn new(api_token: String, symbols: Vec<String>) -> Self {
        Self {
            api_token,
            symbols,
        }
    }
    
    pub fn websocket_url(&self) -> String {
        format!("{}?token={}", WS_URL, self.api_token)
    }
}