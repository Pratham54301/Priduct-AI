# Trading Dashboard Upgrade Guide

## 🎯 Overview

Your dashboard has been upgraded with advanced trading features including:
- Live candlestick charts with TradingView-style interface
- AI-powered buy/sell/hold signals with confidence scores
- Enhanced live price cards with sparklines
- Multi-exchange support (NSE, BSE, Binance Crypto)
- Auto-refresh engine for real-time updates
- Modern, responsive UI with smooth animations

## 📁 New File Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── LivePriceCard.tsx      # Enhanced price card with sparkline
│   │   │   ├── SignalBox.tsx          # AI trading signals
│   │   │   ├── CandleChart.tsx       # TradingView-style candlestick chart
│   │   │   └── ExchangeSelector.tsx  # Exchange dropdown
│   │   └── page.tsx                  # Updated dashboard page
│   └── api/
│       ├── price/route.ts            # Updated for multi-exchange
│       ├── candles/route.ts          # NEW: Candlestick data endpoint
│       └── signal/route.ts           # NEW: AI signal endpoint
├── hooks/
│   └── useAutoRefresh.ts             # NEW: Centralized auto-refresh hook
└── types/
    └── market.ts                     # NEW: Market data types
```

## 🚀 Installation

### 1. Dependencies Installed

The following packages have been added:
- `lightweight-charts` - TradingView charting library
- `framer-motion` - Smooth animations

### 2. Environment Variables

Add these to your `.env.local` file:

```env
# Price API (for stocks)
PRICE_API_KEY=your_api_key_here
PRICE_API_PROVIDER=twelve-data

# Alternative naming (also supported)
MARKET_API_KEY=your_api_key_here
MARKET_PROVIDER=twelve-data

# Optional: Custom API URLs
PRICE_API_URL=https://api.example.com/price
CANDLE_API_URL=https://api.example.com/candles
CRYPTO_API_URL=https://api.binance.com

# Note: Binance crypto API doesn't require API key for public endpoints
```

### 3. Restart Dev Server

```bash
npm run dev
```

## 📊 Features

### 1. Live Candlestick Chart

**Component:** `CandleChart`

**Features:**
- Real-time OHLC (Open, High, Low, Close) data
- Volume bars
- Multiple timeframes: 1m, 5m, 15m, 30m, 1H, 4H, 1D
- Auto-refresh every 5-15 seconds (based on timeframe)
- Smooth transitions
- Dark/light mode support

**API Endpoint:** `/api/candles?symbol=RELIANCE&exchange=NSE&interval=1D`

**Usage:**
```tsx
<CandleChart 
  symbol="RELIANCE" 
  exchange="NSE" 
/>
```

### 2. AI Trading Signals

**Component:** `SignalBox`

**Features:**
- Buy/Sell/Hold signals
- Confidence percentage (0-100%)
- Technical indicators: RSI, MACD, EMA, SMA, Volume Pressure
- Color-coded signals (green=buy, red=sell, yellow=hold)
- Auto-refresh every 10 seconds

**API Endpoint:** `/api/signal?symbol=RELIANCE&exchange=NSE`

**Response Format:**
```json
{
  "success": true,
  "signal": "BUY",
  "confidence": 82,
  "reason": "Strong volume + EMA crossover",
  "indicators": {
    "rsi": 34.5,
    "macd": -0.12,
    "ema20": 192.2,
    "ema50": 190.5,
    "sma20": 191.8,
    "sma50": 189.2,
    "volumePressure": 15.3
  }
}
```

**Usage:**
```tsx
<SignalBox 
  symbol="RELIANCE" 
  exchange="NSE" 
/>
```

### 3. Enhanced Live Price Card

**Component:** `LivePriceCard`

**Features:**
- Live price with smooth animations
- Change and percent change
- Mini sparkline chart (7-point trend)
- Auto-refresh every 5 seconds
- "Refresh Now" button
- Last updated timestamp
- Green/red color coding

**Usage:**
```tsx
<LivePriceCard 
  symbol="RELIANCE" 
  exchange="NSE" 
  onRefresh={() => console.log('Refreshed')}
/>
```

### 4. Multi-Exchange Support

**Component:** `ExchangeSelector`

**Supported Exchanges:**
- **NSE** - National Stock Exchange (Indian stocks)
- **BSE** - Bombay Stock Exchange (Indian stocks)
- **Binance** - Cryptocurrency exchange

**Features:**
- Dropdown selector
- Automatic API routing
- Unified price format

**Usage:**
```tsx
<ExchangeSelector 
  value={exchange} 
  onChange={setExchange}
/>
```

### 5. Auto-Refresh Engine

**Hook:** `useAutoRefresh`

**Features:**
- Centralized interval management
- Automatic cleanup on unmount
- Configurable refresh intervals
- Manual refresh function

**Usage:**
```tsx
const { refresh } = useAutoRefresh(
  5000, // interval in ms
  async () => {
    await fetchData();
  },
  true // enabled
);
```

## 🔌 API Endpoints

### GET /api/price

Fetch live price for any symbol/exchange.

**Query Parameters:**
- `symbol` (required) - Stock/crypto symbol
- `exchange` (optional) - NSE, BSE, or BINANCE (default: NSE)

**Example:**
```bash
GET /api/price?symbol=RELIANCE&exchange=NSE
GET /api/price?symbol=BTC&exchange=BINANCE
```

**Response:**
```json
{
  "success": true,
  "price": 2900.50,
  "change": 10.25,
  "percent": 0.35,
  "timestamp": "2024-01-15T10:30:00Z",
  "symbol": "RELIANCE",
  "exchange": "NSE"
}
```

### GET /api/candles

Fetch candlestick (OHLCV) data.

**Query Parameters:**
- `symbol` (required) - Stock/crypto symbol
- `exchange` (optional) - NSE, BSE, or BINANCE (default: NSE)
- `interval` (optional) - 1m, 5m, 15m, 30m, 1H, 4H, 1D (default: 1D)

**Example:**
```bash
GET /api/candles?symbol=RELIANCE&exchange=NSE&interval=1D
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "time": 1705276800,
      "open": 2900.00,
      "high": 2910.50,
      "low": 2895.25,
      "close": 2905.75,
      "volume": 1234567
    }
  ],
  "symbol": "RELIANCE",
  "exchange": "NSE",
  "interval": "1D",
  "count": 100
}
```

### GET /api/signal

Get AI trading signal with technical indicators.

**Query Parameters:**
- `symbol` (required) - Stock symbol
- `exchange` (optional) - NSE, BSE (default: NSE)

**Example:**
```bash
GET /api/signal?symbol=RELIANCE&exchange=NSE
```

**Response:**
```json
{
  "success": true,
  "signal": "BUY",
  "confidence": 82,
  "reason": "Strong volume + EMA crossover",
  "indicators": {
    "rsi": 34.5,
    "macd": -0.12,
    "ema20": 192.2,
    "ema50": 190.5,
    "sma20": 191.8,
    "sma50": 189.2,
    "volumePressure": 15.3
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🎨 UI Components

All components are:
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Dark mode compatible
- ✅ Smooth animations with Framer Motion
- ✅ Accessible (ARIA labels, keyboard navigation)
- ✅ Error handling with user-friendly messages
- ✅ Loading states with spinners

## 🔧 Technical Details

### Chart Library

Using **TradingView Lightweight Charts**:
- High performance
- Customizable styling
- Real-time updates
- Volume overlay support

### Signal Algorithm

The AI signal engine uses:
- **RSI** (Relative Strength Index) - Momentum indicator
- **MACD** (Moving Average Convergence Divergence) - Trend indicator
- **EMA** (Exponential Moving Average) - 20 & 50 period
- **SMA** (Simple Moving Average) - 20 & 50 period
- **Volume Pressure** - Volume trend analysis

Signal scoring:
- Buy: RSI < 30, MACD bullish, EMA crossover up, price above MAs
- Sell: RSI > 70, MACD bearish, EMA crossover down, price below MAs
- Hold: Neutral conditions

### Auto-Refresh Intervals

- **Price:** 5 seconds
- **Candles:** 5-15 seconds (based on timeframe)
- **Signals:** 10 seconds

All intervals are automatically cleaned up on component unmount.

## 🐛 Troubleshooting

### Chart not displaying

1. Check browser console for errors
2. Verify symbol exists on selected exchange
3. Check API key is configured
4. Ensure `lightweight-charts` is installed

### Signals showing "Insufficient data"

- Need at least 50 candles for signal calculation
- Try selecting a different timeframe
- Check if symbol has enough historical data

### Price not updating

1. Check network tab for API calls
2. Verify auto-refresh is enabled
3. Check browser console for errors
4. Ensure exchange is correct for symbol

### Binance crypto not working

- Symbol must be valid (e.g., BTC, ETH, BNB)
- API automatically appends USDT if needed
- No API key required for public endpoints

## 📝 Testing

### Test Price API
```bash
curl "http://localhost:3000/api/price?symbol=RELIANCE&exchange=NSE"
curl "http://localhost:3000/api/price?symbol=BTC&exchange=BINANCE"
```

### Test Candles API
```bash
curl "http://localhost:3000/api/candles?symbol=RELIANCE&exchange=NSE&interval=1D"
```

### Test Signal API
```bash
curl "http://localhost:3000/api/signal?symbol=RELIANCE&exchange=NSE"
```

## 🎯 Next Steps

1. **Set up API keys** in `.env.local`
2. **Test with real symbols** (RELIANCE, TCS, etc.)
3. **Try crypto** (BTC, ETH with Binance exchange)
4. **Customize intervals** based on your needs
5. **Add more indicators** to signal algorithm if needed

## 📚 Additional Resources

- [TradingView Lightweight Charts Docs](https://tradingview.github.io/lightweight-charts/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Technical Analysis Indicators](https://www.investopedia.com/trading/indicators-and-oscillators/)

---

**All features are production-ready and fully integrated!** 🚀

