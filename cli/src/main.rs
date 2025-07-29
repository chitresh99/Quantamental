use anyhow::Result;
use clap::{Arg, Command};
use colored::*;
use std::time::Duration;
use tokio::time::interval;

mod config;
mod monitor;
mod types;
mod websocket;

use config::Config;
use monitor::StockMonitor;

#[tokio::main]
async fn main() -> Result<()> {
    env_logger::init();

    let matches = Command::new("Stock Price Monitor")
        .version("0.1.0")
        .author("Me")
        .about("Monitor live stock prices")
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

    let config = Config::new(api_token, symbols);
    let monitor = StockMonitor::new(config);
    
    // periodic summaries (optional)
    if show_summary {
        let summary_monitor = monitor.clone();
        let running = monitor.is_running();
        
        tokio::spawn(async move {
            let mut summary_interval = interval(Duration::from_secs(30));
            
            while running.load(std::sync::atomic::Ordering::Relaxed) {
                summary_interval.tick().await;
                summary_monitor.display_summary().await;
            }
        });
    }

    // main monitor
    if let Err(e) = monitor.run().await {
        log::error!("Monitor failed: {}", e);
        std::process::exit(1);
    }

    println!("{}", "Quantamental CLI stopped".yellow());
    Ok(())
}