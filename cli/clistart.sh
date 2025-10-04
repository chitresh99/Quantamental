#!/bin/bash

cd src || exit 1

if [ -f ../.env ]; then
  export $(grep -v '^#' ../.env | xargs)
fi

cargo run -- --token "$FINHUB_API_KEY" --symbols "BINANCE:BTCUSDT"