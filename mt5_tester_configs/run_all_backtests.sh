#!/usr/bin/env zsh
set -euo pipefail

ROOT="/Users/kushalshrestha/Documents/developer/api/Web_Assignment"
WINE="/Applications/MetaTrader 5.app/Contents/SharedSupport/wine/bin/wine"
PREFIX="/Users/kushalshrestha/Library/Application Support/net.metaquotes.wine.metatrader5"
TERMINAL='C:\Program Files\MetaTrader 5\terminal64.exe'

for tf in M1 M3 M5 M15 M30 H1; do
  config="Z:\\Users\\kushalshrestha\\Documents\\developer\\api\\Web_Assignment\\mt5_tester_configs\\Fibo50SwingEA_BTCUSD_${tf}.ini"
  echo "Running BTCUSD ${tf}"
  /usr/bin/env WINEPREFIX="${PREFIX}" "${WINE}" "${TERMINAL}" "/config:${config}"
done
