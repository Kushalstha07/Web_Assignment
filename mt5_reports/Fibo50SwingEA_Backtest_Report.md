# Fibo50SwingEA BTCUSD Backtest Report

Generated: 2026-07-07

## EA Build Status

- Source created: `/Users/kushalshrestha/Documents/developer/api/Web_Assignment/Fibo50SwingEA.mq5`
- Installed source: `/Users/kushalshrestha/Library/Application Support/net.metaquotes.wine.metatrader5/drive_c/Program Files/MetaTrader 5/MQL5/Experts/Fibo50SwingEA.mq5`
- Compiled EA: `/Users/kushalshrestha/Library/Application Support/net.metaquotes.wine.metatrader5/drive_c/Program Files/MetaTrader 5/MQL5/Experts/Fibo50SwingEA.ex5`
- Compile result: successful. MT5 produced `Fibo50SwingEA.ex5`.

## Requested Test Window

- Symbol: `BTCUSD`
- From: 2025-07-07
- To: 2026-07-07
- Deposit: 10,000 USD
- Risk mode: 1% balance risk per trade
- Risk:Reward: 1:2
- Optimization: disabled
- Timeframes prepared: M1, M3, M5, M15, M30, H1

## Tester Result

The Strategy Tester could not start the BTCUSD test because the connected MetaQuotes-Demo server does not expose a symbol named `BTCUSD`.

MT5 tester log excerpt:

```text
Tester: cannot select symbol in market watch
Tester: "Fibo50SwingEA.ex5" X64
Tester: symbol BTCUSD not exist
Terminal: tester didn't start
Terminal: shutdown with ... (tester symbol does not exist)
```

Because the test never started, MT5 did not generate performance metrics, an equity curve, monthly performance, a trade list, or an optimization table.

## Metric Summary

| Timeframe | Status | Total Net Profit | Profit Factor | Win Rate | Trades | Expected Payoff | Maximum Drawdown | Sharpe Ratio |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| M1 | Not run: `BTCUSD` missing | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| M3 | Not run: `BTCUSD` missing | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| M5 | Not run: `BTCUSD` missing | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| M15 | Not run: `BTCUSD` missing | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| M30 | Not run: `BTCUSD` missing | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| H1 | Not run: `BTCUSD` missing | N/A | N/A | N/A | N/A | N/A | N/A | N/A |

## Ranking

No valid ranking can be produced yet. The requested ranking requires completed Strategy Tester reports for all six timeframes.

## Next Step

Log into a broker/server in MT5 that has a BTC symbol, then either:

1. Rename the configs from `BTCUSD` to the broker's exact symbol name, such as `BTCUSDm`, `BTCUSD.`, `BTCUSD#`, or another crypto CFD symbol.
2. Re-run `/Users/kushalshrestha/Documents/developer/api/Web_Assignment/mt5_tester_configs/run_all_backtests.sh`.

After MT5 produces reports in `/Users/kushalshrestha/Documents/developer/api/Web_Assignment/mt5_reports`, the timeframe ranking can be calculated from the actual results.
