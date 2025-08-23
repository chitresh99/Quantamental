# CLI – Running Locally and with Docker

This guide explains how to run the CLI tool either with **Cargo**.

## Prerequisites

* [Rust & Cargo](https://www.rust-lang.org/tools/install) (for running locally).
* A valid **API token**.

## Run with Cargo (Locally)

From the project root, run:

```bash
cargo run -- --token MYTOKEN --symbols "AAPL,GOOGL,TSLA"
```

Explanation:

* `cargo run --` → Runs the CLI from source.
* `--token` → Pass your API token.
* `--symbols` → Comma-separated list of stock symbols.