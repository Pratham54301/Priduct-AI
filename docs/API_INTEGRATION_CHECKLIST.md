# Complete API Integration Checklist for Product.AI Dashboard

## 📋 Overview
This document provides a complete checklist of all APIs, parameters, data formats, and flows required to make your dashboard fully functional with real-time market data and AI predictions.

---

## 🔴 CRITICAL: Required API Endpoints

### 1. **Live Price API** (`/api/price`)
**Purpose:** Fetch real-time stock price for any Indian stock symbol (NSE/BSE)

#### Required Parameters:
```
GET /api/price?symbol={SYMBOL}&exchange={EXCHANGE}

Parameters:
- symbol (required): Stock symbol in uppercase (e.g., "RELIANCE", "POWERGRID", "TCS")
- exchange (required): Either "NSE" or "BSE"
```

#### Expected Response Format:
```json
{
  "success": true,
  "price": 2908.45,
  "change": -15.20,
  "percent": -0.52,
  "timestamp": "2024-01-15T10:30:00Z",
  "symbol": "RELIANCE",
  "exchange": "NSE"
}
```

#### Error Response Format:
```json
{
  "success": false,
  "message": "Price data not found or invalid in API response..."
}
```

#### Your API Provider Requirements:
- **Must support Indian stocks (NSE/BSE)**
- **Symbol format:** 
  - Twelve Data: `SYMBOL.EXCHANGE` (e.g., `RELIANCE.NSE`, `POWERGRID.BSE`)
  - Alpha Vantage: `SYMBOL.NS` (NSE) or `SYMBOL.BO` (BSE)
  - MarketStack: `SYMBOL` with exchange parameter
- **Must return:** `price`, `change`, `percent_change`, `timestamp`
- **Rate limits:** Minimum 100 requests/minute
- **Response time:** < 2 seconds

---

### 2. **Candlestick Data API** (`/api/candles`)
**Purpose:** Fetch historical OHLCV data for charts and technical analysis

#### Required Parameters:
```
GET /api/candles?symbol={SYMBOL}&exchange={EXCHANGE}&interval={TIMEFRAME}

Parameters:
- symbol (required): Stock symbol (e.g., "RELIANCE")
- exchange (required): "NSE" or "BSE"
- interval (required): One of: "1m", "5m", "15m", "30m", "1H", "4H", "1D"
```

#### Expected Response Format:
```json
{
  "success": true,
  "data": [
    {
      "time": 1705315200,
      "open": 2900.00,
      "high": 2915.50,
      "low": 2895.25,
      "close": 2908.45,
      "volume": 1250000
    },
    // ... more candles (minimum 50-100 candles)
  ],
  "symbol": "RELIANCE",
  "exchange": "NSE",
  "interval": "1D",
  "count": 100
}
```

#### Your API Provider Requirements:
- **Must support:** Historical data for Indian stocks
- **Time intervals:** 1m, 5m, 15m, 30m, 1H, 4H, 1D
- **Minimum data points:** 50-100 candles per request
- **Data format:** OHLCV (Open, High, Low, Close, Volume)
- **Time format:** Unix timestamp (seconds)
- **Rate limits:** Minimum 50 requests/minute

---

### 3. **Trading Signal API** (`/api/signal`)
**Purpose:** Generate AI trading signals (BUY/SELL/HOLD) based on technical indicators

#### Required Parameters:
```
GET /api/signal?symbol={SYMBOL}&exchange={EXCHANGE}

Parameters:
- symbol (required): Stock symbol
- exchange (required): "NSE" or "BSE"
```

#### Expected Response Format:
```json
{
  "success": true,
  "signal": "BUY",
  "confidence": 85,
  "reason": "RSI indicates oversold conditions with bullish MACD crossover. Strong volume support suggests upward momentum.",
  "indicators": {
    "rsi": 32.5,
    "macd": 15.2,
    "ema20": 2895.50,
    "ema50": 2875.25,
    "sma20": 2900.00,
    "sma50": 2850.00,
    "volumePressure": 12.5
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "symbol": "RELIANCE",
  "exchange": "NSE"
}
```

#### Signal Types:
- `BUY`: Strong buy signal
- `SELL`: Strong sell signal  
- `HOLD`: Neutral/no clear signal

#### Indicator Requirements:
- **RSI (Relative Strength Index):** 0-100
- **MACD:** Numeric value (positive = bullish, negative = bearish)
- **EMA20/EMA50:** Exponential Moving Averages
- **SMA20/SMA50:** Simple Moving Averages
- **Volume Pressure:** Percentage change in volume

---

### 4. **AI Prediction API** (`/api/predict`)
**Purpose:** Generate comprehensive AI predictions with entry, targets, stop loss

#### Required Parameters:
```
POST /api/predict
Headers:
  Authorization: Bearer {JWT_TOKEN}
  Content-Type: application/json

Body:
{
  "symbol": "RELIANCE",
  "exchange": "NSE",
  "timeframe": "1day" (optional)
}
```

#### Expected Response Format:
```json
{
  "success": true,
  "message": "Prediction generated successfully",
  "prediction": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "symbol": "RELIANCE",
    "exchange": "NSE",
    "timestamp": "2024-01-15T10:30:00Z",
    "status": "ok",
    "current_price": 2908.45,
    "entry_point": 2890.00,
    "sell_point": 3050.00,
    "target_1": 2950.00,
    "target_2": 3000.00,
    "stop_loss": 2850.00,
    "indicators_used": ["RSI", "MACD", "EMA", "Bollinger Bands"],
    "prediction_accuracy": 0.85,
    "rationale": "Based on technical analysis, RSI shows oversold conditions at 32.5, indicating potential reversal. MACD crossover suggests bullish momentum. Strong support at 2890 level. Target 1 at 2950 (1.4% gain) and Target 2 at 3000 (3.1% gain). Stop loss at 2850 to limit downside risk.",
    "confidence": 85,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Prediction Card Required Fields:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `symbol` | string | ✅ | Stock symbol (e.g., "RELIANCE") |
| `exchange` | string | ✅ | "NSE" or "BSE" |
| `timestamp` | string (ISO) | ✅ | Last update time |
| `status` | string | ✅ | "ok", "insufficient_data", or "stale_data" |
| `current_price` | number | ✅ | Current live price in INR |
| `entry_point` | number | ✅ | Recommended entry price |
| `sell_point` | number | ✅ | Recommended exit/sell price |
| `target_1` | number | ✅ | First target price |
| `target_2` | number | ✅ | Second target price |
| `stop_loss` | number | ⚠️ | Stop loss price (currently missing, needs to be added) |
| `indicators_used` | string[] | ✅ | Array of indicator names |
| `prediction_accuracy` | number | ✅ | 0.70 to 0.95 (70% to 95%) |
| `rationale` | string | ✅ | Detailed explanation (2-3 sentences) |
| `confidence` | number | ⚠️ | 0-100 (currently missing, needs to be added) |

---

## 🔄 Complete Data Flow

### **Flow 1: Live Price Display**

```
User selects stock → Frontend calls /api/price
  ↓
Backend validates symbol & exchange
  ↓
Backend calls external price API (Twelve Data/Alpha Vantage)
  ↓
External API returns price data
  ↓
Backend parses & formats response
  ↓
Frontend displays: Current Price, Change, % Change
  ↓
Auto-refresh every 5 seconds
```

### **Flow 2: Candlestick Chart**

```
User selects stock → Frontend calls /api/candles
  ↓
Backend validates symbol, exchange, interval
  ↓
Backend calls external API for historical data
  ↓
External API returns OHLCV candles
  ↓
Backend converts to unified format
  ↓
Frontend renders chart using lightweight-charts
  ↓
Auto-refresh based on interval (5-15 seconds)
```

### **Flow 3: Trading Signal**

```
User selects stock → Frontend calls /api/signal
  ↓
Backend calls /api/candles internally
  ↓
Backend calculates technical indicators (RSI, MACD, EMA, etc.)
  ↓
Backend generates signal (BUY/SELL/HOLD) with confidence
  ↓
Frontend displays signal with indicators
  ↓
Auto-refresh every 10 seconds
```

### **Flow 4: AI Prediction**

```
User clicks "Get AI Prediction" → Frontend calls POST /api/predict
  ↓
Frontend includes JWT token in Authorization header
  ↓
Next.js API route validates token
  ↓
Next.js API route calls backend /api/predict
  ↓
Backend fetches:
  - Current price from /api/price
  - Historical data from /api/candles
  - Technical indicators
  ↓
Backend AI/ML model generates prediction:
  - Entry point
  - Targets (1 & 2)
  - Stop loss
  - Confidence score
  - Rationale
  ↓
Backend saves prediction to MongoDB
  ↓
Backend returns prediction object
  ↓
Frontend displays in PredictionCard component
```

---

## 📊 Symbol/Exchange Mapping Rules

### **NSE (National Stock Exchange)**
- **Format:** Uppercase symbol (e.g., `RELIANCE`, `TCS`, `HDFCBANK`)
- **API Format (Twelve Data):** `SYMBOL.NSE` (e.g., `RELIANCE.NSE`)
- **API Format (Alpha Vantage):** `SYMBOL.NS` (e.g., `RELIANCE.NS`)
- **Examples:**
  - RELIANCE → `RELIANCE.NSE` or `RELIANCE.NS`
  - POWERGRID → `POWERGRID.NSE` or `POWERGRID.NS`
  - TCS → `TCS.NSE` or `TCS.NS`

### **BSE (Bombay Stock Exchange)**
- **Format:** Uppercase symbol (e.g., `RELIANCE`, `TCS`)
- **API Format (Twelve Data):** `SYMBOL.BSE` (e.g., `RELIANCE.BSE`)
- **API Format (Alpha Vantage):** `SYMBOL.BO` (e.g., `RELIANCE.BO`)
- **Note:** Many stocks are primarily listed on NSE. If BSE fails, suggest NSE.

### **Symbol Validation Rules:**
1. ✅ Must be uppercase
2. ✅ Must be 2-20 characters
3. ✅ Must contain only letters and numbers
4. ✅ Must exist in your stock database
5. ✅ Must be available on selected exchange

---

## 🔧 Backend Implementation Requirements

### **1. Price API Route** (`src/app/api/price/route.ts`)
**Current Status:** ✅ Implemented
**Needs:**
- ✅ Symbol validation
- ✅ Exchange validation (NSE/BSE only)
- ✅ Error handling
- ⚠️ **MISSING:** API key configuration check
- ⚠️ **MISSING:** Rate limiting
- ⚠️ **MISSING:** Caching (optional but recommended)

### **2. Candles API Route** (`src/app/api/candles/route.ts`)
**Current Status:** ✅ Implemented
**Needs:**
- ✅ Symbol validation
- ✅ Exchange validation
- ✅ Interval validation
- ⚠️ **MISSING:** Minimum data point validation (ensure 50+ candles)
- ⚠️ **MISSING:** Data quality checks

### **3. Signal API Route** (`src/app/api/signal/route.ts`)
**Current Status:** ✅ Implemented
**Needs:**
- ✅ Calls candles API internally
- ✅ Calculates indicators
- ⚠️ **MISSING:** More sophisticated signal generation logic
- ⚠️ **MISSING:** Confidence calculation algorithm

### **4. Prediction API Route** (`src/app/api/predict/route.ts`)
**Current Status:** ✅ Implemented (proxies to backend)
**Needs:**
- ✅ Token validation
- ✅ Symbol validation
- ⚠️ **MISSING:** Integration with real AI/ML model
- ⚠️ **MISSING:** Stop loss calculation
- ⚠️ **MISSING:** Confidence score calculation

### **5. Backend Prediction Controller** (`backend/controllers/predictController.js`)
**Current Status:** ⚠️ Uses dummy data
**Needs:**
- ❌ **REPLACE:** Dummy prediction with real AI/ML model
- ❌ **ADD:** Stop loss calculation
- ❌ **ADD:** Confidence score (0-100)
- ❌ **ADD:** Real-time price fetching
- ❌ **ADD:** Historical data analysis
- ❌ **ADD:** Technical indicator calculations
- ❌ **ADD:** Risk assessment

---

## 🎨 Frontend Implementation Requirements

### **1. LivePriceCard Component**
**Status:** ✅ Implemented
**Displays:**
- Current price (₹ format)
- Change amount
- Change percentage
- Last updated time
- Mini sparkline chart

### **2. CandleChart Component**
**Status:** ✅ Implemented
**Displays:**
- Candlestick chart
- Volume histogram
- Timeframe selector
- Last updated time

### **3. SignalBox Component**
**Status:** ✅ Implemented
**Displays:**
- Signal (BUY/SELL/HOLD)
- Confidence percentage
- Reason
- Technical indicators (RSI, MACD, EMA, etc.)

### **4. PredictionCard Component**
**Status:** ✅ Implemented
**Displays:**
- ✅ Symbol & Exchange
- ✅ Current Price
- ✅ Entry Point
- ✅ Sell Point
- ✅ Target 1
- ✅ Target 2
- ✅ Indicators Used
- ✅ Rationale
- ✅ Accuracy (as percentage)
- ✅ Last Updated
- ❌ **MISSING:** Stop Loss (needs to be added)
- ❌ **MISSING:** Confidence Level (needs to be added)

---

## ⚠️ Missing Fields That Need to Be Added

### **1. Stop Loss in PredictionCard**
**Location:** `src/components/PredictionCard.tsx`
**Action Required:**
```typescript
// Add after Target 2:
<div>
  <p className="text-muted-foreground">Stop Loss:</p>
  <p className="font-medium text-red-600">
    {prediction.stop_loss?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
  </p>
</div>
```

### **2. Confidence Level in PredictionCard**
**Location:** `src/components/PredictionCard.tsx`
**Action Required:**
```typescript
// Add after Accuracy:
<div>
  <p className="text-muted-foreground">Confidence:</p>
  <p className="font-medium">
    {prediction.confidence || (prediction.prediction_accuracy * 100).toFixed(0)}%
  </p>
</div>
```

### **3. Stop Loss in StockPrediction Type**
**Location:** `src/types/prediction.ts`
**Action Required:**
```typescript
export interface StockPrediction {
  // ... existing fields
  stop_loss?: number;  // ADD THIS
  confidence?: number; // ADD THIS (0-100)
}
```

### **4. Stop Loss in Backend Model**
**Location:** `backend/models/Prediction.js`
**Action Required:**
```javascript
stop_loss: {
  type: Number,
},
confidence: {
  type: Number,
  min: 0,
  max: 100,
},
```

---

## 🔑 Environment Variables Required

### **Frontend (.env.local)**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### **Backend (.env)**
```env
# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Market Data API
PRICE_API_KEY=your_api_key_here
MARKET_API_KEY=your_api_key_here  # Alternative name
MARKET_PROVIDER=twelve-data  # or "alpha-vantage" or "marketstack"
PRICE_API_URL=  # Optional: custom API URL

# OpenAI (for AI predictions)
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o  # or gpt-4-turbo
```

---

## 📝 API Provider Comparison

### **Twelve Data** (Recommended for Indian Stocks)
- ✅ Excellent NSE/BSE support
- ✅ Format: `SYMBOL.EXCHANGE`
- ✅ Real-time and historical data
- ✅ Good documentation
- ⚠️ Paid plans required for production

### **Alpha Vantage**
- ⚠️ Limited Indian stock support
- ✅ Format: `SYMBOL.NS` (NSE) or `SYMBOL.BO` (BSE)
- ⚠️ Free tier has rate limits
- ⚠️ Some symbols may not be available

### **MarketStack**
- ⚠️ Limited Indian stock coverage
- ✅ Good for global markets
- ⚠️ May not have all NSE/BSE symbols

---

## ✅ Validation Checklist

Before providing your APIs, ensure:

- [ ] **Price API** returns data for at least 100+ Indian stocks (NSE)
- [ ] **Candles API** returns minimum 50 candles per request
- [ ] **All APIs** support both NSE and BSE exchanges
- [ ] **Response times** are < 2 seconds
- [ ] **Error messages** are clear and actionable
- [ ] **Rate limits** are sufficient (100+ requests/minute)
- [ ] **API keys** are properly configured
- [ ] **Symbol format** matches requirements (SYMBOL.EXCHANGE or SYMBOL.NS/BO)
- [ ] **Data format** matches expected JSON structure
- [ ] **Timestamps** are in ISO 8601 format
- [ ] **Prices** are in INR (Indian Rupees)

---

## 🚀 Next Steps

1. **Review this checklist** and identify which APIs you have available
2. **Provide your API details:**
   - API provider name
   - API endpoints/URLs
   - Authentication method
   - Symbol format requirements
   - Rate limits
   - Sample responses
3. **I will integrate** your APIs into the system
4. **Test** with real symbols (RELIANCE, TCS, POWERGRID, etc.)
5. **Deploy** to production

---

## 📞 Questions to Answer

Please provide:

1. **Which API provider are you using?** (Twelve Data, Alpha Vantage, MarketStack, or custom?)
2. **Do you have API keys?** (Yes/No - if yes, we'll configure them)
3. **What's your API endpoint format?** (e.g., `https://api.twelvedata.com/price`)
4. **What symbol format does your API use?** (e.g., `RELIANCE.NSE` or `RELIANCE.NS`)
5. **Do you have historical data API?** (For candlesticks)
6. **What are your rate limits?** (Requests per minute/hour)
7. **Do you have an AI/ML model for predictions?** (Or should we use OpenAI?)
8. **What's your MongoDB connection string?** (For saving predictions)

---

**Once you provide this information, I'll integrate everything perfectly! 🎯**

