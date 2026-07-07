//+------------------------------------------------------------------+
//|                                             Fibo50SwingEA.mq5    |
//|  Swing-based Fibonacci retracement Expert Advisor for MT5.       |
//|                                                                  |
//|  Strategy summary:                                               |
//|  - Find the latest confirmed swing high and swing low.           |
//|  - Treat low -> high as an uptrend impulse, high -> low as down. |
//|  - Trade a 50% retracement, stop at 70.7%, TP by Risk:Reward.    |
//|  - Filter by spread, session, slippage, magic number and risk.   |
//+------------------------------------------------------------------+
#property copyright "OpenAI"
#property version   "1.00"
#property strict

#include <Trade/Trade.mqh>

enum ENUM_LOT_MODE
{
   LOT_FIXED = 0,       // Use FixedLot
   LOT_RISK_PERCENT = 1 // Risk RiskPercent of balance per trade
};

input group "Swing And Fibonacci"
input int             LookbackBars          = 300;      // Bars scanned for swings
input int             SwingStrength         = 5;        // Bars on each side of a swing
input double          EntryFibLevel         = 0.500;    // Entry retracement level
input double          StopFibLevel          = 0.707;    // Stop retracement level
input int             EntryTolerancePoints  = 20;       // Touch tolerance in points
input bool            OneTradePerSwing      = true;     // Do not reuse same swing setup

input group "Risk And Orders"
input ENUM_LOT_MODE   LotMode               = LOT_RISK_PERCENT;
input double          FixedLot              = 0.01;     // Used when LotMode is LOT_FIXED
input double          RiskPercent           = 1.0;      // Balance risk per trade
input double          RiskRewardRatio       = 2.0;      // Default 1:2 RR
input ulong           MagicNumber           = 50707050;
input int             MaxSpreadPoints       = 300;      // Maximum allowed spread
input int             SlippagePoints        = 30;       // Maximum execution deviation

input group "Session Filter"
input bool            UseSessionFilter      = false;
input int             SessionStartHour      = 0;        // Broker/server hour
input int             SessionStartMinute    = 0;
input int             SessionEndHour        = 23;       // Broker/server hour
input int             SessionEndMinute      = 59;

input group "Trailing Stop"
input bool            UseTrailingStop       = false;
input int             TrailingStartPoints   = 500;      // Profit needed before trailing
input int             TrailingDistancePoints= 300;      // Distance from current price
input int             TrailingStepPoints    = 50;       // Minimum SL improvement

input group "Chart"
input bool            DrawFibonacci         = true;
input string          FiboObjectName        = "Fibo50SwingEA_CurrentSwing";

CTrade trade;

struct SwingSetup
{
   bool              valid;
   int               direction;       // 1 = buy setup, -1 = sell setup
   int               highShift;
   int               lowShift;
   datetime          highTime;
   datetime          lowTime;
   double            highPrice;
   double            lowPrice;
   double            entryPrice;
   double            stopPrice;
   double            takeProfitPrice;
   string            id;
};

datetime g_lastBarTime = 0;
string   g_lastTradedSetupId = "";
SwingSetup g_setup;

void ResetSetup(SwingSetup &setup)
{
   setup.valid = false;
   setup.direction = 0;
   setup.highShift = -1;
   setup.lowShift = -1;
   setup.highTime = 0;
   setup.lowTime = 0;
   setup.highPrice = 0.0;
   setup.lowPrice = 0.0;
   setup.entryPrice = 0.0;
   setup.stopPrice = 0.0;
   setup.takeProfitPrice = 0.0;
   setup.id = "";
}

//+------------------------------------------------------------------+
//| Expert initialization.                                           |
//+------------------------------------------------------------------+
int OnInit()
{
   if(LookbackBars < (SwingStrength * 2 + 20))
   {
      Print("LookbackBars is too small for the selected SwingStrength.");
      return INIT_PARAMETERS_INCORRECT;
   }

   if(EntryFibLevel <= 0.0 || EntryFibLevel >= 1.0 ||
      StopFibLevel <= EntryFibLevel || StopFibLevel >= 1.0)
   {
      Print("Fibonacci inputs must satisfy 0 < EntryFibLevel < StopFibLevel < 1.");
      return INIT_PARAMETERS_INCORRECT;
   }

   if(RiskRewardRatio <= 0.0)
   {
      Print("RiskRewardRatio must be greater than zero.");
      return INIT_PARAMETERS_INCORRECT;
   }

   trade.SetExpertMagicNumber(MagicNumber);
   trade.SetDeviationInPoints(SlippagePoints);
   trade.SetTypeFillingBySymbol(_Symbol);

   ResetSetup(g_setup);
   return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
//| Expert deinitialization.                                         |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   if(DrawFibonacci)
      ObjectDelete(0, FiboObjectName);
}

//+------------------------------------------------------------------+
//| Expert tick handler.                                             |
//+------------------------------------------------------------------+
void OnTick()
{
   trade.SetExpertMagicNumber(MagicNumber);
   trade.SetDeviationInPoints(SlippagePoints);

   if(UseTrailingStop)
      ManageTrailingStop();

   if(IsNewBar())
   {
      SwingSetup setup;
      if(FindLatestSetup(setup))
      {
         g_setup = setup;
         if(DrawFibonacci)
            DrawCurrentFibonacci(g_setup);
      }
      else
      {
         g_setup.valid = false;
      }
   }

   if(!g_setup.valid)
      return;

   if(HasOpenPositionForSymbol())
      return;

   if(OneTradePerSwing && g_lastTradedSetupId == g_setup.id)
      return;

   if(!IsTradingSessionOpen())
      return;

   if(!IsSpreadAcceptable())
      return;

   TryOpenTrade(g_setup);
}

//+------------------------------------------------------------------+
//| Detect a new completed bar.                                      |
//+------------------------------------------------------------------+
bool IsNewBar()
{
   datetime currentBarTime = iTime(_Symbol, _Period, 0);
   if(currentBarTime == 0)
      return false;

   if(currentBarTime != g_lastBarTime)
   {
      g_lastBarTime = currentBarTime;
      return true;
   }

   return false;
}

//+------------------------------------------------------------------+
//| Find the latest swing high and swing low and build the setup.    |
//+------------------------------------------------------------------+
bool FindLatestSetup(SwingSetup &setup)
{
   ResetSetup(setup);

   MqlRates rates[];
   ArraySetAsSeries(rates, true);

   int barsNeeded = LookbackBars + SwingStrength + 10;
   int copied = CopyRates(_Symbol, _Period, 0, barsNeeded, rates);
   if(copied < SwingStrength * 2 + 20)
      return false;

   int latestHighShift = -1;
   int latestLowShift = -1;

   int lastShift = MathMin(copied - SwingStrength - 1, LookbackBars);
   for(int shift = SwingStrength + 1; shift <= lastShift; shift++)
   {
      if(latestHighShift < 0 && IsSwingHigh(rates, copied, shift))
         latestHighShift = shift;

      if(latestLowShift < 0 && IsSwingLow(rates, copied, shift))
         latestLowShift = shift;

      if(latestHighShift >= 0 && latestLowShift >= 0)
         break;
   }

   if(latestHighShift < 0 || latestLowShift < 0)
      return false;

   double high = rates[latestHighShift].high;
   double low = rates[latestLowShift].low;
   double range = high - low;
   if(range <= 0.0)
      return false;

   setup.highShift = latestHighShift;
   setup.lowShift = latestLowShift;
   setup.highTime = rates[latestHighShift].time;
   setup.lowTime = rates[latestLowShift].time;
   setup.highPrice = high;
   setup.lowPrice = low;

   // A more recent swing high after an older swing low is treated as an uptrend impulse.
   if(latestLowShift > latestHighShift)
   {
      setup.direction = 1;
      setup.entryPrice = high - range * EntryFibLevel;
      setup.stopPrice = high - range * StopFibLevel;
      double riskDistance = setup.entryPrice - setup.stopPrice;
      setup.takeProfitPrice = setup.entryPrice + riskDistance * RiskRewardRatio;
   }
   // A more recent swing low after an older swing high is treated as a downtrend impulse.
   else if(latestHighShift > latestLowShift)
   {
      setup.direction = -1;
      setup.entryPrice = low + range * EntryFibLevel;
      setup.stopPrice = low + range * StopFibLevel;
      double riskDistance = setup.stopPrice - setup.entryPrice;
      setup.takeProfitPrice = setup.entryPrice - riskDistance * RiskRewardRatio;
   }
   else
   {
      return false;
   }

   int digits = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);
   setup.entryPrice = NormalizeDouble(setup.entryPrice, digits);
   setup.stopPrice = NormalizeDouble(setup.stopPrice, digits);
   setup.takeProfitPrice = NormalizeDouble(setup.takeProfitPrice, digits);
   setup.id = StringFormat("%s_%s_%I64d_%I64d_%d",
                           _Symbol,
                           EnumToString(_Period),
                           (long)setup.highTime,
                           (long)setup.lowTime,
                           setup.direction);
   setup.valid = true;
   return true;
}

//+------------------------------------------------------------------+
//| Confirm a swing high.                                            |
//+------------------------------------------------------------------+
bool IsSwingHigh(const MqlRates &rates[], const int total, const int shift)
{
   if(shift - SwingStrength < 0 || shift + SwingStrength >= total)
      return false;

   double pivot = rates[shift].high;
   for(int i = shift - SwingStrength; i <= shift + SwingStrength; i++)
   {
      if(i == shift)
         continue;

      if(rates[i].high >= pivot)
         return false;
   }

   return true;
}

//+------------------------------------------------------------------+
//| Confirm a swing low.                                             |
//+------------------------------------------------------------------+
bool IsSwingLow(const MqlRates &rates[], const int total, const int shift)
{
   if(shift - SwingStrength < 0 || shift + SwingStrength >= total)
      return false;

   double pivot = rates[shift].low;
   for(int i = shift - SwingStrength; i <= shift + SwingStrength; i++)
   {
      if(i == shift)
         continue;

      if(rates[i].low <= pivot)
         return false;
   }

   return true;
}

//+------------------------------------------------------------------+
//| Draw/update the active Fibonacci retracement.                    |
//+------------------------------------------------------------------+
void DrawCurrentFibonacci(const SwingSetup &setup)
{
   ObjectDelete(0, FiboObjectName);

   datetime firstTime;
   datetime secondTime;
   double firstPrice;
   double secondPrice;

   if(setup.direction == 1)
   {
      firstTime = setup.lowTime;
      firstPrice = setup.lowPrice;
      secondTime = setup.highTime;
      secondPrice = setup.highPrice;
   }
   else
   {
      firstTime = setup.highTime;
      firstPrice = setup.highPrice;
      secondTime = setup.lowTime;
      secondPrice = setup.lowPrice;
   }

   if(!ObjectCreate(0, FiboObjectName, OBJ_FIBO, 0, firstTime, firstPrice, secondTime, secondPrice))
      return;

   ObjectSetInteger(0, FiboObjectName, OBJPROP_COLOR, clrDodgerBlue);
   ObjectSetInteger(0, FiboObjectName, OBJPROP_STYLE, STYLE_SOLID);
   ObjectSetInteger(0, FiboObjectName, OBJPROP_WIDTH, 1);
   ObjectSetInteger(0, FiboObjectName, OBJPROP_RAY_RIGHT, true);
   ObjectSetInteger(0, FiboObjectName, OBJPROP_BACK, false);

   ObjectSetInteger(0, FiboObjectName, OBJPROP_LEVELS, 4);
   SetFiboLevel(FiboObjectName, 0, 0.000, "0.0%");
   SetFiboLevel(FiboObjectName, 1, EntryFibLevel, "50.0% Entry");
   SetFiboLevel(FiboObjectName, 2, StopFibLevel, "70.7% Stop");
   SetFiboLevel(FiboObjectName, 3, 1.000, "100.0%");
}

//+------------------------------------------------------------------+
//| Helper for configuring Fibonacci levels.                         |
//+------------------------------------------------------------------+
void SetFiboLevel(const string name, const int index, const double value, const string text)
{
   ObjectSetDouble(0, name, OBJPROP_LEVELVALUE, index, value);
   ObjectSetString(0, name, OBJPROP_LEVELTEXT, index, text);
   ObjectSetInteger(0, name, OBJPROP_LEVELCOLOR, index, clrDodgerBlue);
   ObjectSetInteger(0, name, OBJPROP_LEVELSTYLE, index, STYLE_DOT);
   ObjectSetInteger(0, name, OBJPROP_LEVELWIDTH, index, 1);
}

//+------------------------------------------------------------------+
//| Check spread in points.                                          |
//+------------------------------------------------------------------+
bool IsSpreadAcceptable()
{
   long spreadPoints = SymbolInfoInteger(_Symbol, SYMBOL_SPREAD);
   if(spreadPoints <= 0)
   {
      double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
      double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
      spreadPoints = (long)MathRound((ask - bid) / _Point);
   }

   return spreadPoints <= MaxSpreadPoints;
}

//+------------------------------------------------------------------+
//| Session filter using broker/server time.                         |
//+------------------------------------------------------------------+
bool IsTradingSessionOpen()
{
   if(!UseSessionFilter)
      return true;

   MqlDateTime tm;
   TimeToStruct(TimeCurrent(), tm);
   int nowMinutes = tm.hour * 60 + tm.min;
   int startMinutes = SessionStartHour * 60 + SessionStartMinute;
   int endMinutes = SessionEndHour * 60 + SessionEndMinute;

   if(startMinutes == endMinutes)
      return true;

   if(startMinutes < endMinutes)
      return nowMinutes >= startMinutes && nowMinutes <= endMinutes;

   return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
}

//+------------------------------------------------------------------+
//| Only one open position per symbol/magic.                         |
//+------------------------------------------------------------------+
bool HasOpenPositionForSymbol()
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0)
         continue;

      if(!PositionSelectByTicket(ticket))
         continue;

      if(PositionGetString(POSITION_SYMBOL) != _Symbol)
         continue;

      if((ulong)PositionGetInteger(POSITION_MAGIC) != MagicNumber)
         continue;

      return true;
   }

   return false;
}

//+------------------------------------------------------------------+
//| Open a buy or sell when price touches the 50% retracement.       |
//+------------------------------------------------------------------+
void TryOpenTrade(const SwingSetup &setup)
{
   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick))
      return;

   double tolerance = EntryTolerancePoints * _Point;
   double entry = setup.entryPrice;
   bool touched = false;

   if(setup.direction == 1)
      touched = tick.ask <= entry + tolerance && tick.ask >= setup.stopPrice;
   else if(setup.direction == -1)
      touched = tick.bid >= entry - tolerance && tick.bid <= setup.stopPrice;

   if(!touched)
      return;

   if(!StopsAreValid(setup.direction, setup.stopPrice, setup.takeProfitPrice))
      return;

   double volume = CalculateVolume(setup.stopPrice, setup.direction);
   if(volume <= 0.0)
      return;

   bool sent = false;
   if(setup.direction == 1)
      sent = trade.Buy(volume, _Symbol, 0.0, setup.stopPrice, setup.takeProfitPrice, "Fibo50 buy");
   else
      sent = trade.Sell(volume, _Symbol, 0.0, setup.stopPrice, setup.takeProfitPrice, "Fibo50 sell");

   if(sent)
   {
      g_lastTradedSetupId = setup.id;
      PrintFormat("Opened %s %.2f lots at fib %.5f, SL %.5f, TP %.5f, setup %s",
                  setup.direction == 1 ? "BUY" : "SELL",
                  volume,
                  setup.entryPrice,
                  setup.stopPrice,
                  setup.takeProfitPrice,
                  setup.id);
   }
   else
   {
      PrintFormat("Trade send failed. Retcode=%d, Description=%s",
                  trade.ResultRetcode(),
                  trade.ResultRetcodeDescription());
   }
}

//+------------------------------------------------------------------+
//| Ensure stops meet broker minimum distance.                       |
//+------------------------------------------------------------------+
bool StopsAreValid(const int direction, const double sl, const double tp)
{
   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick))
      return false;

   long stopsLevel = SymbolInfoInteger(_Symbol, SYMBOL_TRADE_STOPS_LEVEL);
   double minimumDistance = stopsLevel * _Point;

   if(direction == 1)
   {
      if(sl >= tick.bid || tp <= tick.ask)
         return false;

      if(minimumDistance > 0.0 &&
         (tick.bid - sl < minimumDistance || tp - tick.ask < minimumDistance))
         return false;
   }
   else
   {
      if(sl <= tick.ask || tp >= tick.bid)
         return false;

      if(minimumDistance > 0.0 &&
         (sl - tick.ask < minimumDistance || tick.bid - tp < minimumDistance))
         return false;
   }

   return true;
}

//+------------------------------------------------------------------+
//| Calculate fixed or risk-based position volume.                   |
//+------------------------------------------------------------------+
double CalculateVolume(const double stopPrice, const int direction)
{
   if(LotMode == LOT_FIXED)
      return NormalizeVolume(FixedLot);

   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick))
      return 0.0;

   double entryPrice = direction == 1 ? tick.ask : tick.bid;
   double stopDistance = MathAbs(entryPrice - stopPrice);
   if(stopDistance <= 0.0)
      return 0.0;

   double tickSize = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   double tickValue = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   if(tickSize <= 0.0 || tickValue <= 0.0)
      return NormalizeVolume(FixedLot);

   double balance = AccountInfoDouble(ACCOUNT_BALANCE);
   double riskMoney = balance * (RiskPercent / 100.0);
   if(riskMoney <= 0.0)
      return 0.0;

   double lossPerLot = (stopDistance / tickSize) * tickValue;
   if(lossPerLot <= 0.0)
      return 0.0;

   return NormalizeVolume(riskMoney / lossPerLot);
}

//+------------------------------------------------------------------+
//| Normalize volume to broker min/max/step.                         |
//+------------------------------------------------------------------+
double NormalizeVolume(const double requestedVolume)
{
   double minVolume = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double maxVolume = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double stepVolume = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);

   if(stepVolume <= 0.0)
      stepVolume = 0.01;

   double volume = MathMax(minVolume, MathMin(maxVolume, requestedVolume));
   volume = MathFloor(volume / stepVolume) * stepVolume;
   volume = MathMax(minVolume, MathMin(maxVolume, volume));

   int volumeDigits = 0;
   double step = stepVolume;
   while(step < 1.0 && volumeDigits < 8)
   {
      step *= 10.0;
      volumeDigits++;
   }

   return NormalizeDouble(volume, volumeDigits);
}

//+------------------------------------------------------------------+
//| Optional trailing stop management.                               |
//+------------------------------------------------------------------+
void ManageTrailingStop()
{
   if(TrailingStartPoints <= 0 || TrailingDistancePoints <= 0)
      return;

   MqlTick tick;
   if(!SymbolInfoTick(_Symbol, tick))
      return;

   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0 || !PositionSelectByTicket(ticket))
         continue;

      if(PositionGetString(POSITION_SYMBOL) != _Symbol)
         continue;

      if((ulong)PositionGetInteger(POSITION_MAGIC) != MagicNumber)
         continue;

      long type = PositionGetInteger(POSITION_TYPE);
      double openPrice = PositionGetDouble(POSITION_PRICE_OPEN);
      double currentSl = PositionGetDouble(POSITION_SL);
      double currentTp = PositionGetDouble(POSITION_TP);
      double newSl = currentSl;
      int digits = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);

      if(type == POSITION_TYPE_BUY)
      {
         double profitPoints = (tick.bid - openPrice) / _Point;
         if(profitPoints < TrailingStartPoints)
            continue;

         newSl = NormalizeDouble(tick.bid - TrailingDistancePoints * _Point, digits);
         if(currentSl > 0.0 && newSl <= currentSl + TrailingStepPoints * _Point)
            continue;

         if(newSl >= tick.bid)
            continue;
      }
      else if(type == POSITION_TYPE_SELL)
      {
         double profitPoints = (openPrice - tick.ask) / _Point;
         if(profitPoints < TrailingStartPoints)
            continue;

         newSl = NormalizeDouble(tick.ask + TrailingDistancePoints * _Point, digits);
         if(currentSl > 0.0 && newSl >= currentSl - TrailingStepPoints * _Point)
            continue;

         if(newSl <= tick.ask)
            continue;
      }
      else
      {
         continue;
      }

      if(!trade.PositionModify(ticket, newSl, currentTp))
      {
         PrintFormat("Trailing stop modify failed for ticket %I64u. Retcode=%d %s",
                     ticket,
                     trade.ResultRetcode(),
                     trade.ResultRetcodeDescription());
      }
   }
}
//+------------------------------------------------------------------+
