# 🤖 AI Model Integration - Complete Checklist

## 📋 Overview

This checklist covers **all flows, dependencies, and requirements** for the OpenAI AI model integration in Product.AI. This document is based on a comprehensive analysis of the entire project codebase. Use this to verify everything is properly configured and working.

**Last Updated:** Based on full project analysis - 2024-01-15  
**Project Status:** ✅ Integration Complete - Ready for Testing

---

## ✅ 1. ENVIRONMENT VARIABLES

### **Backend (.env) - Required Variables**

```env
# ✅ CRITICAL: OpenAI Integration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o

# ✅ CRITICAL: Market Data API (Alpha Vantage)
PRICE_API_KEY=4FVYC4DLNN34O6ME
MARKET_API_KEY=4FVYC4DLNN34O6ME
MARKET_PROVIDER=alpha-vantage
PRICE_API_PROVIDER=alpha-vantage

# ✅ CRITICAL: Database Connection
MONGO_URI=your_mongodb_atlas_connection_string

# ✅ CRITICAL: Authentication
JWT_SECRET=your_jwt_secret_key_here

# ✅ Optional: Server Configuration
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
PORT=5000
```

**Verification Checklist:**
- [ ] `OPENAI_API_KEY` is set and valid (get from https://platform.openai.com/api-keys)
- [ ] `OPENAI_MODEL` is set (default: `gpt-4o`, alternatives: `gpt-4-turbo`, `gpt-4`, `gpt-3.5-turbo`)
- [ ] `PRICE_API_KEY` is set (Alpha Vantage: `4FVYC4DLNN34O6ME`)
- [ ] `MARKET_PROVIDER` is set to `alpha-vantage` (lowercase)
- [ ] `PRICE_API_PROVIDER` is set to `alpha-vantage` (lowercase)
- [ ] `MONGO_URI` is set and valid (MongoDB Atlas connection string)
- [ ] `JWT_SECRET` is set (strong random string for JWT signing)
- [ ] All environment variables are loaded (verify with `console.log(process.env.OPENAI_API_KEY)` in backend)
- [ ] `.env` file is in `.gitignore` (never commit API keys)

### **Frontend (.env.local) - Required Variables**

```env
# ✅ Required for Market Data (Next.js API routes)
PRICE_API_KEY=4FVYC4DLNN34O6ME
MARKET_API_KEY=4FVYC4DLNN34O6ME
MARKET_PROVIDER=alpha-vantage
PRICE_API_PROVIDER=alpha-vantage

# ✅ Required for Backend Communication
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

**Verification Checklist:**
- [ ] `NEXT_PUBLIC_BACKEND_URL` matches backend URL exactly
- [ ] Market API keys are set (same as backend)
- [ ] Environment variables are accessible (restart Next.js dev server after changes)
- [ ] `.env.local` file is in `.gitignore`

---

## ✅ 2. BACKEND DEPENDENCIES

### **Required NPM Packages (backend/package.json)**

**Critical Dependencies:**
- [ ] `openai` ^4.33.0 - OpenAI API client
- [ ] `axios` ^1.6.8 - HTTP client for Alpha Vantage API
- [ ] `mongoose` ^7.5.0 - MongoDB ODM
- [ ] `jsonwebtoken` ^9.0.2 - JWT authentication
- [ ] `express` ^4.18.2 - Web framework
- [ ] `dotenv` ^16.3.1 - Environment variable loader

**Additional Dependencies:**
- [ ] `bcryptjs` ^2.4.3 - Password hashing
- [ ] `cookie-parser` ^1.4.7 - Cookie parsing
- [ ] `cors` ^2.8.5 - CORS middleware
- [ ] `express-rate-limit` ^6.10.0 - Rate limiting
- [ ] `helmet` ^7.0.0 - Security headers
- [ ] `joi` ^17.13.0 - Input validation
- [ ] `node-cron` ^3.0.2 - Scheduled tasks
- [ ] `nodemailer` ^6.9.4 - Email sending

**Dev Dependencies:**
- [ ] `nodemon` ^3.0.1 - Auto-restart on file changes

**Verify Installation:**
```bash
cd backend
npm list openai axios mongoose jsonwebtoken express dotenv
```

**If Missing:**
```bash
cd backend
npm install openai axios mongoose jsonwebtoken express dotenv
```

---

## ✅ 3. BACKEND FILES & STRUCTURE

### **Core Files - Critical Path**

**Checklist:**
- [ ] `backend/controllers/predictController.js` exists and has OpenAI integration
- [ ] `backend/routes/predict.js` exists and routes to `predictController.js`
- [ ] `backend/models/Prediction.js` exists with correct schema
- [ ] `backend/utils/indicators.js` exists with all indicator functions
- [ ] `backend/middleware/auth.js` exists for JWT authentication
- [ ] `backend/server.js` has route `/api/predict` configured

### **File Verification - Detailed**

#### **1. `backend/controllers/predictController.js`**

**Required Imports:**
- [ ] `import Prediction from '../models/Prediction.js'`
- [ ] `import OpenAI from 'openai'`
- [ ] `import axios from 'axios'`
- [ ] `import { calculateRSI, calculateMACD, calculateEMA, calculateATR, identifyTrend } from '../utils/indicators.js'`

**Required Environment Variables:**
- [ ] `OPENAI_API_KEY` from `process.env.OPENAI_API_KEY`
- [ ] `OPENAI_MODEL` from `process.env.OPENAI_MODEL || 'gpt-4o'`
- [ ] `MARKET_API_KEY` from `process.env.PRICE_API_KEY || process.env.MARKET_API_KEY`
- [ ] `MARKET_PROVIDER` from `process.env.MARKET_PROVIDER || process.env.PRICE_API_PROVIDER || 'alpha-vantage'`

**Required Functions:**
- [ ] `getOpenAIClient()` - Lazy initialization of OpenAI client
  - [ ] Checks for `OPENAI_API_KEY` before initialization
  - [ ] Throws error if API key missing
  - [ ] Returns singleton OpenAI instance
- [ ] `fetchRealMarketData(symbol, exchange)` - Fetches from Alpha Vantage
  - [ ] Formats symbol: `SYMBOL.NS` (NSE) or `SYMBOL.BO` (BSE)
  - [ ] Fetches `GLOBAL_QUOTE` for current price
  - [ ] Fetches `TIME_SERIES_INTRADAY` (5min interval) for historical data
  - [ ] Handles Alpha Vantage errors ("Error Message", "Note" fields)
  - [ ] Calculates technical indicators from historical data
  - [ ] Returns structured market data object
- [ ] `predict(req, res)` - Main prediction function
  - [ ] Validates `symbol` (required, string)
  - [ ] Validates `exchange` (required, string, NSE/BSE only)
  - [ ] Validates `timeframe` (optional, defaults to '1day')
  - [ ] Calls `fetchRealMarketData(symbol, exchange)`
  - [ ] Calculates data freshness (status: 'ok', 'stale_data', 'insufficient_data')
  - [ ] Prepares OpenAI prompt (system message + user message)
  - [ ] Calls OpenAI API with:
    - [ ] Model: `OPENAI_MODEL` (default: `gpt-4o`)
    - [ ] Temperature: `0.2`
    - [ ] Response format: `json_object`
  - [ ] Validates OpenAI response:
    - [ ] `prediction_accuracy` in range (0.70-0.95)
    - [ ] `confidence` in range (0-100)
    - [ ] `stop_loss` calculated if missing (2-5% below entry_point)
  - [ ] Creates `Prediction` document
  - [ ] Saves to MongoDB
  - [ ] Returns `{ success: true, data: {...}, prediction: {...} }`
  - [ ] Handles errors with proper status codes and messages

#### **2. `backend/routes/predict.js`**

**Required Structure:**
- [ ] `import express from 'express'`
- [ ] `import auth from '../middleware/auth.js'`
- [ ] `import { predict } from '../controllers/predictController.js'`
- [ ] `const router = express.Router()`
- [ ] `router.post('/', auth, predict)` - Protected route
- [ ] `export default router`

#### **3. `backend/models/Prediction.js`**

**Required Schema Fields:**
- [ ] `symbol` (String, required, uppercase, trim)
- [ ] `exchange` (String, required, uppercase, trim)
- [ ] `timestamp` (Date, required)
- [ ] `status` (String, enum: ['ok', 'insufficient_data', 'stale_data'], required)
- [ ] `current_price` (Number, required)
- [ ] `entry_point` (Number, optional)
- [ ] `sell_point` (Number, optional)
- [ ] `target_1` (Number, optional)
- [ ] `target_2` (Number, optional)
- [ ] `stop_loss` (Number, optional)
- [ ] `indicators_used` (Array of Strings)
- [ ] `prediction_accuracy` (Number, min: 0.70, max: 0.95)
- [ ] `confidence` (Number, min: 0, max: 100)
- [ ] `rationale` (String, optional)
- [ ] `customer` (ObjectId, ref: 'User', optional)
- [ ] `createdAt` (Date, default: Date.now)

#### **4. `backend/utils/indicators.js`**

**Required Functions:**
- [ ] `calculateRSI(prices, period = 14)` - Returns RSI value (0-100)
- [ ] `calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9)` - Returns { macd_line, macd_signal, macd_hist }
- [ ] `calculateEMA(prices, period)` - Returns EMA value
- [ ] `calculateATR(highs, lows, closes, period = 14)` - Returns ATR value
- [ ] `identifyTrend(prices, period = 20)` - Returns 'uptrend', 'downtrend', or 'sideways'

#### **5. `backend/middleware/auth.js`**

**Required Functionality:**
- [ ] Checks for token in `Authorization` header (`Bearer <token>`)
- [ ] Falls back to `req.cookies?.token` if header missing
- [ ] Validates token using `jwt.verify(token, process.env.JWT_SECRET)`
- [ ] Sets `req.user = decoded.userId` on success
- [ ] Returns 401 error if token missing or invalid

#### **6. `backend/server.js`**

**Required Configuration:**
- [ ] `dotenv.config()` called at top
- [ ] CORS configured with frontend URL
- [ ] `express.json()` middleware
- [ ] `cookieParser()` middleware
- [ ] `app.use('/api/predict', predictRoutes)` - Prediction route
- [ ] MongoDB connection with `mongoose.connect(process.env.MONGO_URI)`
- [ ] Server listens on `process.env.PORT || 5000`

---

## ✅ 4. FRONTEND FILES & STRUCTURE

### **Core Files - Critical Path**

**Checklist:**
- [ ] `src/app/api/predict/route.ts` exists (Next.js API route)
- [ ] `src/app/dashboard/page.tsx` has prediction handling
- [ ] `src/components/PredictionCard.tsx` displays all fields
- [ ] `src/types/prediction.ts` has `StockPrediction` interface

### **File Verification - Detailed**

#### **1. `src/app/api/predict/route.ts`**

**Required Functionality:**
- [ ] Exports `POST` async function
- [ ] Reads `NEXT_PUBLIC_BACKEND_URL` from environment
- [ ] Validates JWT token from `Authorization` header
  - [ ] Returns 401 if token missing or invalid format
- [ ] Validates request body:
  - [ ] `symbol` (required, string)
  - [ ] `exchange` (optional, defaults to 'NSE')
  - [ ] `timeframe` (optional, defaults to '1day')
- [ ] Proxies request to backend `${BACKEND_URL}/api/predict`
  - [ ] Forwards `Authorization` header
  - [ ] Sends `Content-Type: application/json`
- [ ] Handles backend response:
  - [ ] Converts `{ success: true, data: {...} }` to `{ success: true, prediction: {...} }`
  - [ ] Returns error response if backend fails
- [ ] Error handling with try-catch

#### **2. `src/app/dashboard/page.tsx`**

**Required State:**
- [ ] `selectedStock` (Stock | null)
- [ ] `selectedExchange` (Exchange, default: 'NSE')
- [ ] `prediction` (StockPrediction | null)
- [ ] `isLoading` (boolean)
- [ ] `error` (string | null)

**Required Functions:**
- [ ] `handleGetPrediction()` async function:
  - [ ] Validates `selectedStock` exists
  - [ ] Validates `user` is logged in (from `useAuth()`)
  - [ ] Sets `isLoading = true`, `error = null`, `prediction = null`
  - [ ] Gets token from `localStorage.getItem('token')`
  - [ ] Calls `POST /api/predict` with:
    - [ ] `Authorization: Bearer ${token}`
    - [ ] Body: `{ symbol, exchange, timeframe: '1day' }`
  - [ ] Handles response:
    - [ ] Sets `prediction` state on success
    - [ ] Shows success toast
    - [ ] Sets `error` state on failure
    - [ ] Shows error toast
  - [ ] Sets `isLoading = false` in finally block

**Required UI:**
- [ ] "Get AI Prediction" button
- [ ] Loading state (spinner/disabled button)
- [ ] Error display
- [ ] PredictionCard component rendered when prediction exists

#### **3. `src/components/PredictionCard.tsx`**

**Required Props:**
- [ ] `prediction: StockPrediction | null`
- [ ] `onRerunPrediction: () => void`
- [ ] `isLoading: boolean`
- [ ] `error: string | null`

**Required Display:**
- [ ] Loading state (skeleton/spinner)
- [ ] Error state (error message + retry button)
- [ ] No prediction state (empty state message)
- [ ] Prediction display with all fields:
  - [ ] Symbol and Exchange (header)
  - [ ] Status badge (ok/stale_data/insufficient_data)
  - [ ] Current Price (large, formatted as INR)
  - [ ] Entry Point (formatted as INR)
  - [ ] Sell Point (formatted as INR)
  - [ ] Target 1 (formatted as INR)
  - [ ] Target 2 (formatted as INR)
  - [ ] Stop Loss (formatted as INR, red color)
  - [ ] Confidence Level (percentage)
  - [ ] Prediction Accuracy (percentage)
  - [ ] Indicators Used (comma-separated list)
  - [ ] Rationale (2-3 sentences, italic)
  - [ ] Last Updated (formatted timestamp)
  - [ ] "Re-run Prediction" button

#### **4. `src/types/prediction.ts`**

**Required Interface:**
```typescript
export interface StockPrediction {
  _id?: string;
  symbol: string;
  exchange: string;
  timestamp: string;
  status: "ok" | "insufficient_data" | "stale_data";
  current_price: number;
  entry_point?: number;
  sell_point?: number;
  target_1?: number;
  target_2?: number;
  stop_loss?: number;
  indicators_used: string[];
  prediction_accuracy: number;
  confidence?: number;
  rationale?: string;
  customer?: string;
  createdAt?: string;
}
```

---

## ✅ 5. API ROUTES & ENDPOINTS

### **Backend Routes**

**Primary Route:**
- [ ] `POST /api/predict` - Main prediction endpoint
  - [ ] **Authentication:** Required (JWT token in Authorization header)
  - [ ] **Request Body:**
    ```json
    {
      "symbol": "RELIANCE",
      "exchange": "NSE",
      "timeframe": "1day"
    }
    ```
  - [ ] **Success Response (200):**
    ```json
    {
      "success": true,
      "message": "Prediction generated successfully",
      "data": { /* Prediction object */ },
      "prediction": { /* Prediction object */ }
    }
    ```
  - [ ] **Error Responses:**
    - [ ] 400: Invalid input (missing symbol/exchange, invalid exchange)
    - [ ] 401: Authentication failed (no token, invalid token)
    - [ ] 500: Server error (OpenAI failure, MongoDB failure, etc.)

**Secondary Route (if exists):**
- [ ] `POST /api/predictions` - Alternative endpoint (uses `predictionController.js`)
  - [ ] **Note:** Frontend uses `/api/predict`, this is for compatibility
  - [ ] **Status:** Verify it doesn't conflict with main route

### **Frontend Routes (Next.js API)**

**Primary Route:**
- [ ] `POST /api/predict` - Next.js API route (proxies to backend)
  - [ ] **Authentication:** Required (JWT token in Authorization header)
  - [ ] **Request Body:** Same as backend
  - [ ] **Success Response (200):**
    ```json
    {
      "success": true,
      "message": "Prediction generated successfully",
      "prediction": { /* Prediction object */ }
    }
    ```
  - [ ] **Error Responses:** Same as backend

### **Route Conflict Check**

**⚠️ IMPORTANT:** Verify no route conflicts:
- [ ] `/api/predict` uses `predictController.js` (✅ Correct - Active)
- [ ] `/api/predictions` uses `predictionController.js` (⚠️ Legacy - Not used by frontend)
- [ ] Backend `server.js` has correct route order:
  ```javascript
  app.use('/api/predict', predictRoutes);  // ✅ Active
  app.use('/api', predictionRoutes);       // ⚠️ Creates /api/predictions
  ```

---

## ✅ 6. AUTHENTICATION FLOW

### **Complete JWT Token Flow**

**Step-by-Step Checklist:**
1. [ ] **User Login:** User logs in via `/api/auth/login`
2. [ ] **Token Generation:** Backend generates JWT token with `userId`
3. [ ] **Token Storage:** Frontend stores token in `localStorage.setItem('token', token)`
4. [ ] **Token Retrieval:** Frontend retrieves token with `localStorage.getItem('token')`
5. [ ] **Token Sending:** Frontend sends token in `Authorization: Bearer <token>` header
6. [ ] **Token Validation (Next.js):** `src/app/api/predict/route.ts` validates token format
7. [ ] **Token Forwarding:** Next.js API forwards token to backend
8. [ ] **Token Validation (Backend):** `backend/middleware/auth.js` validates token:
   - [ ] Extracts token from `Authorization` header or cookies
   - [ ] Verifies token using `jwt.verify(token, process.env.JWT_SECRET)`
   - [ ] Sets `req.user = decoded.userId`
9. [ ] **User Association:** Prediction saved with `customer: req.user`

### **Authentication Verification Test:**

1. [ ] Login to get token
2. [ ] Check token exists: `localStorage.getItem('token')` returns non-null
3. [ ] Make prediction request with token
4. [ ] Verify backend receives token (check logs)
5. [ ] Verify `req.user` is set (check logs or database)
6. [ ] Verify prediction saved with `customer` field matching user ID

---

## ✅ 7. COMPLETE DATA FLOW

### **End-to-End Prediction Flow (26 Steps)**

**Frontend Layer:**
1. [ ] **User Action:** User clicks "Get AI Prediction" button
2. [ ] **Validation:** `handleGetPrediction()` validates:
   - [ ] `selectedStock` exists
   - [ ] `user` is logged in
3. [ ] **State Update:** Sets `isLoading = true`, `error = null`, `prediction = null`
4. [ ] **Token Retrieval:** Gets token from `localStorage.getItem('token')`
5. [ ] **API Call:** Calls `POST /api/predict` with:
   - [ ] `Authorization: Bearer <token>`
   - [ ] Body: `{ symbol, exchange, timeframe: '1day' }`

**Next.js API Layer:**
6. [ ] **Request Receipt:** `src/app/api/predict/route.ts` receives request
7. [ ] **Token Validation:** Validates `Authorization` header format
8. [ ] **Body Validation:** Validates `symbol` and `exchange` in request body
9. [ ] **Backend Proxy:** Proxies to `${BACKEND_URL}/api/predict` with:
   - [ ] Forwarded `Authorization` header
   - [ ] `Content-Type: application/json`
   - [ ] Request body

**Backend Layer:**
10. [ ] **Route Handler:** `backend/routes/predict.js` receives request
11. [ ] **Auth Middleware:** `backend/middleware/auth.js` validates token:
    - [ ] Extracts token from header or cookies
    - [ ] Verifies with `jwt.verify(token, JWT_SECRET)`
    - [ ] Sets `req.user = decoded.userId`
12. [ ] **Controller Call:** `backend/controllers/predictController.js` `predict()` function called
13. [ ] **Input Validation:** Validates:
    - [ ] `symbol` (required, string)
    - [ ] `exchange` (required, string, NSE/BSE only)
    - [ ] `timeframe` (optional, defaults to '1day')

**Market Data Fetching:**
14. [ ] **Market Data Call:** `fetchRealMarketData(symbol, exchange)` called
15. [ ] **Alpha Vantage - Current Price:** Fetches `GLOBAL_QUOTE`:
    - [ ] URL: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SYMBOL.NS&apikey=KEY`
    - [ ] Parses response: `quote['05. price']`, `quote['02. open']`, etc.
16. [ ] **Alpha Vantage - Historical Data:** Fetches `TIME_SERIES_INTRADAY`:
    - [ ] URL: `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=SYMBOL.NS&interval=5min&apikey=KEY`
    - [ ] Extracts last 100 candles
    - [ ] Parses OHLCV data
17. [ ] **Indicator Calculation:** Calculates technical indicators:
    - [ ] RSI (14-period)
    - [ ] MACD (12, 26, 9)
    - [ ] EMA (12 and 26 periods)
    - [ ] ATR (14-period)
    - [ ] Trend identification

**OpenAI Integration:**
18. [ ] **Status Determination:** Determines data status:
    - [ ] 'ok' if data fresh (< 180 seconds old)
    - [ ] 'stale_data' if data > 180 seconds old
    - [ ] 'insufficient_data' if symbol or price missing
19. [ ] **Prompt Preparation:** Prepares OpenAI prompt:
    - [ ] System message (defines role, schema, rules)
    - [ ] User message (includes market data, indicators, rules)
20. [ ] **OpenAI API Call:** Calls OpenAI:
    - [ ] Model: `OPENAI_MODEL` (default: `gpt-4o`)
    - [ ] Temperature: `0.2`
    - [ ] Response format: `json_object`
    - [ ] Messages: [system, user]
21. [ ] **Response Parsing:** Parses OpenAI JSON response
22. [ ] **Response Validation:** Validates and fixes:
    - [ ] `prediction_accuracy` in range (0.70-0.95)
    - [ ] `confidence` in range (0-100)
    - [ ] `stop_loss` calculated if missing (2-5% below entry_point)
    - [ ] All required fields present

**Database & Response:**
23. [ ] **Document Creation:** Creates `Prediction` document with all fields
24. [ ] **Database Save:** Saves to MongoDB with `customer: req.user`
25. [ ] **Response Formatting:** Returns:
    ```json
    {
      "success": true,
      "message": "Prediction generated successfully",
      "data": { /* Prediction object */ },
      "prediction": { /* Prediction object */ }
    }
    ```

**Frontend Display:**
26. [ ] **Response Handling:** Frontend receives response
27. [ ] **State Update:** Sets `prediction` state with response data
28. [ ] **UI Update:** `PredictionCard` component displays prediction
29. [ ] **Toast Notification:** Shows success toast
30. [ ] **Loading State:** Sets `isLoading = false`

---

## ✅ 8. ERROR HANDLING

### **Backend Error Handling**

**Error Scenarios:**
- [ ] **Missing OPENAI_API_KEY:**
  - [ ] Error: `"OPENAI_API_KEY environment variable is not set. Please add it to your .env file."`
  - [ ] Status: 500
- [ ] **Invalid Symbol/Exchange:**
  - [ ] Error: `"Symbol is required"` or `"Exchange is required"`
  - [ ] Status: 400
- [ ] **Invalid Exchange (not NSE/BSE):**
  - [ ] Error: `"Invalid exchange: X. Only NSE (National Stock Exchange) and BSE (Bombay Stock Exchange) are supported for Indian stock market."`
  - [ ] Status: 400
- [ ] **Alpha Vantage API Failure:**
  - [ ] Error: `"Failed to fetch market data: <error message>"`
  - [ ] Status: 500
  - [ ] Handles: "Error Message" field, "Note" field (rate limit), empty response
- [ ] **OpenAI API Failure:**
  - [ ] Error: `"Failed to generate prediction"` or OpenAI error message
  - [ ] Status: 500
- [ ] **MongoDB Save Failure:**
  - [ ] Error: Validation errors or duplicate key errors
  - [ ] Status: 500
- [ ] **Authentication Failure:**
  - [ ] Error: `"No token, authorization denied"` or `"Token is not valid"`
  - [ ] Status: 401

### **Frontend Error Handling**

**Error Scenarios:**
- [ ] **Network Errors:**
  - [ ] Shows: `"Failed to connect to backend. Please check your internet connection."`
  - [ ] Logs error to console
- [ ] **API Errors:**
  - [ ] Extracts error message from response
  - [ ] Shows error toast with message
  - [ ] Sets `error` state
- [ ] **Missing Token:**
  - [ ] Shows: `"Please log in to get predictions"`
  - [ ] Redirects to login (if implemented)
- [ ] **Invalid Response:**
  - [ ] Shows: `"Invalid response from backend"`
  - [ ] Logs error to console
- [ ] **Loading State:**
  - [ ] Shows spinner/skeleton loader
  - [ ] Disables "Get AI Prediction" button
- [ ] **Error State:**
  - [ ] Shows error message in PredictionCard
  - [ ] Shows "Try Again" button

### **Error Messages Reference:**

- [ ] `"OPENAI_API_KEY environment variable is not set. Please add it to your .env file."`
- [ ] `"Invalid exchange: X. Only NSE (National Stock Exchange) and BSE (Bombay Stock Exchange) are supported for Indian stock market."`
- [ ] `"Symbol is required"`
- [ ] `"Exchange is required"`
- [ ] `"Failed to fetch market data: <error>"`
- [ ] `"Failed to generate prediction"`
- [ ] `"No token, authorization denied"`
- [ ] `"Token is not valid"`
- [ ] `"Please select a stock first"`
- [ ] `"Please log in to get predictions"`

---

## ✅ 9. OPENAI INTEGRATION DETAILS

### **OpenAI Client Setup**

**Implementation:**
- [ ] `getOpenAIClient()` function exists in `predictController.js`
- [ ] Lazy initialization (only creates client when needed)
- [ ] Singleton pattern (reuses same client instance)
- [ ] Checks for `OPENAI_API_KEY` before initialization
- [ ] Throws error if API key missing:
  ```javascript
  throw new Error('OPENAI_API_KEY environment variable is not set. Please add it to your .env file.');
  ```

### **OpenAI API Call Configuration**

**Required Settings:**
- [ ] **Model:** Configurable via `OPENAI_MODEL` env var
  - [ ] Default: `gpt-4o`
  - [ ] Alternatives: `gpt-4-turbo`, `gpt-4`, `gpt-3.5-turbo`
- [ ] **Temperature:** `0.2` (low for consistent, deterministic outputs)
- [ ] **Response Format:** `json_object` (ensures structured JSON output)
- [ ] **Messages:**
  - [ ] System message (defines role, schema, rules)
  - [ ] User message (includes market data, indicators, rules)

### **OpenAI Prompt Structure**

**System Message:**
- [ ] Defines AI role: "disciplined equity market analyst specializing in Indian stock markets (NSE/BSE)"
- [ ] Specifies output format: "Output ONLY valid minified JSON"
- [ ] Defines JSON schema with all required fields

**User Message:**
- [ ] Includes stock information: symbol, exchange, timestamp
- [ ] Includes market data: current_price, open, high, low, close, volume
- [ ] Includes technical indicators: RSI, MACD, EMA, ATR, Trend
- [ ] Includes rules for:
  - [ ] Status determination (stale_data, insufficient_data, ok)
  - [ ] Value ranges (prediction_accuracy: 0.70-0.95, confidence: 0-100)
  - [ ] Price calculations (stop_loss, targets, entry_point)
  - [ ] Rationale requirements (2-3 sentences)

### **OpenAI Response Validation**

**Validation Steps:**
- [ ] Parse JSON response from `response.choices[0].message.content`
- [ ] Validate `prediction_accuracy`:
  - [ ] Range: 0.70-0.95
  - [ ] Fix if out of range: `Math.random() * (0.95 - 0.70) + 0.70`
- [ ] Validate `confidence`:
  - [ ] Range: 0-100
  - [ ] Fix if missing: `Math.round(prediction_accuracy * 100)`
- [ ] Calculate `stop_loss` if missing:
  - [ ] Default: 3% below `entry_point`
  - [ ] Formula: `entry_point * (1 - 0.03)`
- [ ] Ensure all required fields present:
  - [ ] `symbol`, `exchange`, `timestamp`, `status`
  - [ ] `current_price`, `entry_point`, `sell_point`
  - [ ] `target_1`, `target_2`, `stop_loss`
  - [ ] `indicators_used`, `prediction_accuracy`, `confidence`, `rationale`

---

## ✅ 10. MARKET DATA INTEGRATION (ALPHA VANTAGE)

### **Alpha Vantage API Integration**

**Function: `fetchRealMarketData(symbol, exchange)`**

**Symbol Formatting:**
- [ ] NSE: `SYMBOL.NS` (e.g., `RELIANCE.NS`)
- [ ] BSE: `SYMBOL.BO` (e.g., `RELIANCE.BO`)

**API Endpoints:**
- [ ] **Current Price:** `GLOBAL_QUOTE`
  - [ ] URL: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SYMBOL.NS&apikey=KEY`
  - [ ] Response parsing:
    - [ ] `quote['05. price']` → current_price
    - [ ] `quote['02. open']` → open
    - [ ] `quote['03. high']` → high
    - [ ] `quote['04. low']` → low
    - [ ] `quote['06. volume']` → volume
    - [ ] `quote['07. latest trading day']` → timestamp
- [ ] **Historical Data:** `TIME_SERIES_INTRADAY`
  - [ ] URL: `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=SYMBOL.NS&interval=5min&apikey=KEY&outputsize=compact`
  - [ ] Response parsing:
    - [ ] Finds time series key (contains "Time Series")
    - [ ] Extracts last 100 candles
    - [ ] Parses: `['1. open']`, `['2. high']`, `['3. low']`, `['4. close']`, `['5. volume']`

**Error Handling:**
- [ ] Handles "Error Message" field in response
- [ ] Handles "Note" field (rate limit warning)
- [ ] Handles empty response
- [ ] Handles missing quote data
- [ ] Throws descriptive error messages

**Timeout:**
- [ ] Alpha Vantage API timeout: 10 seconds
- [ ] Error handling for timeout

### **Technical Indicators Calculation**

**From Historical Data:**
- [ ] **RSI:** `calculateRSI(prices, 14)`
  - [ ] Returns: RSI value (0-100)
  - [ ] Default: 50 if calculation fails
- [ ] **MACD:** `calculateMACD(prices, 12, 26, 9)`
  - [ ] Returns: `{ macd_line, macd_signal, macd_hist }`
  - [ ] Default: `{ macd_line: 0, macd_signal: 0, macd_hist: 0 }` if calculation fails
- [ ] **EMA Fast:** `calculateEMA(prices, 12)`
  - [ ] Returns: EMA value
  - [ ] Default: current_price if calculation fails
- [ ] **EMA Slow:** `calculateEMA(prices, 26)`
  - [ ] Returns: EMA value
  - [ ] Default: current_price if calculation fails
- [ ] **ATR:** `calculateATR(highs, lows, closes, 14)`
  - [ ] Returns: ATR value
  - [ ] Default: `high - low` if calculation fails
- [ ] **Trend:** `identifyTrend(prices, 20)`
  - [ ] Returns: 'uptrend', 'downtrend', or 'sideways'
  - [ ] Default: 'sideways' if calculation fails

**Included in OpenAI Prompt:**
- [ ] All indicator values included in user message
- [ ] Indicator names included in `indicators_used` array

---

## ✅ 11. DATABASE INTEGRATION (MONGODB)

### **MongoDB Connection**

**Configuration:**
- [ ] `MONGO_URI` set in `backend/.env`
- [ ] Connection in `backend/server.js`:
  ```javascript
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
  ```
- [ ] Connection successful on server start
- [ ] Error handling for connection failures

### **Prediction Model Usage**

**Document Creation:**
- [ ] `Prediction` model imported in `predictController.js`
- [ ] Prediction document created with all fields:
  ```javascript
  const prediction = new Prediction({
    symbol: cleanSymbol,
    exchange: cleanExchange,
    timestamp: new Date(),
    status: status,
    current_price: marketData.current_price,
    entry_point: predictionOutput.entry_point || ...,
    sell_point: predictionOutput.sell_point || ...,
    target_1: predictionOutput.target_1 || ...,
    target_2: predictionOutput.target_2 || ...,
    stop_loss: predictionOutput.stop_loss || ...,
    indicators_used: predictionOutput.indicators_used || ...,
    prediction_accuracy: predictionOutput.prediction_accuracy || ...,
    confidence: predictionOutput.confidence || ...,
    rationale: predictionOutput.rationale || ...,
    customer: req.user || null,
  });
  ```
- [ ] Document saved with `await prediction.save()`
- [ ] Error handling:
  - [ ] Validation errors (400)
  - [ ] Duplicate key errors (handled)
  - [ ] Database connection errors (500)

**Customer Association:**
- [ ] `customer` field set from `req.user` (JWT decoded userId)
- [ ] `customer` is optional (null if not authenticated)
- [ ] `customer` references 'User' model (ObjectId)

---

## ✅ 12. TESTING CHECKLIST

### **Manual Testing - Basic Flow**

**Test 1: Successful Prediction Generation**
- [ ] Start backend: `cd backend && npm run dev`
- [ ] Start frontend: `npm run dev`
- [ ] Login to dashboard
- [ ] Search for stock: "RELIANCE"
- [ ] Select exchange: "NSE"
- [ ] Click "Get AI Prediction" button
- [ ] Verify loading state appears (spinner/disabled button)
- [ ] Wait for prediction (10-30 seconds)
- [ ] Verify prediction appears in PredictionCard
- [ ] Verify all fields display correctly:
  - [ ] Symbol and Exchange
  - [ ] Current Price (₹ format)
  - [ ] Entry Point
  - [ ] Sell Point
  - [ ] Target 1
  - [ ] Target 2
  - [ ] Stop Loss
  - [ ] Confidence Level
  - [ ] Prediction Accuracy
  - [ ] Indicators Used
  - [ ] Rationale
  - [ ] Last Updated
- [ ] Verify success toast appears
- [ ] Check backend logs for successful flow
- [ ] Check MongoDB for saved prediction

**Test 2: Error Handling**
- [ ] Test with invalid symbol → Error message displayed
- [ ] Test with invalid exchange (not NSE/BSE) → Error message displayed
- [ ] Test without login → Error message or redirect
- [ ] Test with missing token → 401 error
- [ ] Test with invalid token → 401 error
- [ ] Test with missing OPENAI_API_KEY → Error message in logs
- [ ] Test with Alpha Vantage rate limit → Error message displayed

**Test 3: Data Validation**
- [ ] Verify `current_price` is a positive number
- [ ] Verify `entry_point` is a positive number
- [ ] Verify `stop_loss` is a positive number (less than entry_point)
- [ ] Verify `target_1` and `target_2` are positive numbers (greater than entry_point)
- [ ] Verify `confidence` is 0-100
- [ ] Verify `prediction_accuracy` is 0.70-0.95
- [ ] Verify `indicators_used` is an array of strings
- [ ] Verify `rationale` is a non-empty string
- [ ] Verify `status` is one of: 'ok', 'stale_data', 'insufficient_data'

**Test 4: API Endpoint Testing**

**Backend Direct Test:**
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "symbol": "RELIANCE",
    "exchange": "NSE",
    "timeframe": "1day"
  }'
```

- [ ] Backend responds with 200 status
- [ ] Response includes `success: true`
- [ ] Response includes `data` and `prediction` fields
- [ ] All required fields present in prediction object

**Frontend API Test:**
```bash
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "symbol": "RELIANCE",
    "exchange": "NSE",
    "timeframe": "1day"
  }'
```

- [ ] Frontend API responds with 200 status
- [ ] Response includes `success: true`
- [ ] Response includes `prediction` field
- [ ] Response format matches frontend expectations

---

## ✅ 13. PERFORMANCE & OPTIMIZATION

### **Rate Limiting**

**Current Status:**
- [ ] Rate limiting configured in `backend/routes/prediction.js` (for `/api/predictions`)
- [ ] Limits: 5 requests per 15 minutes per IP
- [ ] **Note:** `/api/predict` route may not have rate limiting (verify)

**Recommendations:**
- [ ] Add rate limiting to `/api/predict` route if not present
- [ ] Configure reasonable limits (e.g., 5-10 requests per 15 minutes)
- [ ] Error messages for rate limit exceeded

### **Caching**

**Current Status:**
- [ ] Market data caching not implemented in `predictController.js`
- [ ] `predictionController.js` has in-memory cache (10 seconds TTL) for live price

**Recommendations:**
- [ ] Implement caching for Alpha Vantage API responses
- [ ] Cache TTL: 10-30 seconds for market data
- [ ] Cache key: `${symbol}:${exchange}`
- [ ] Cache invalidation on new requests

### **Timeout Handling**

**Current Configuration:**
- [ ] Alpha Vantage API timeout: 10 seconds (in `fetchRealMarketData`)
- [ ] OpenAI API timeout: Not explicitly set (uses default)
- [ ] Frontend request timeout: Not explicitly set (uses default ~60 seconds)

**Recommendations:**
- [ ] Set OpenAI API timeout: 30 seconds
- [ ] Set frontend request timeout: 60 seconds
- [ ] Error messages for timeout scenarios

---

## ✅ 14. LOGGING & DEBUGGING

### **Backend Logging**

**Current Logging:**
- [ ] `console.log('[Predict] Fetching market data for ${symbol} on ${exchange}...')`
- [ ] `console.log('[Predict] Generating AI prediction using OpenAI (${OPENAI_MODEL})...')`
- [ ] `console.log('[Predict] Prediction generated successfully for ${symbol} on ${exchange}')`
- [ ] `console.error('[Predict] Error:', err)`
- [ ] `console.error('[fetchRealMarketData] Error:', error.message)`

**Recommended Additional Logging:**
- [ ] Log API URLs being called (Alpha Vantage, OpenAI)
- [ ] Log response status codes
- [ ] Log prediction data (without sensitive info)
- [ ] Log timing information (how long each step takes)

### **Frontend Logging**

**Current Logging:**
- [ ] `console.error('Failed to load recent searches:', error)`
- [ ] Error logging in catch blocks

**Recommended Additional Logging:**
- [ ] Log API requests (method, URL, body)
- [ ] Log API responses (status, data)
- [ ] Log errors with full context
- [ ] Use `console.warn` for expected errors (API rate limits, etc.)
- [ ] Use `console.error` for unexpected errors

---

## ✅ 15. SECURITY

### **Authentication Security**

**JWT Token Security:**
- [ ] JWT tokens required for all prediction requests
- [ ] Tokens validated on every request (no caching)
- [ ] Invalid tokens rejected immediately
- [ ] No token → 401 error (not 500)
- [ ] Token stored securely in `localStorage` (frontend)
- [ ] Token not exposed in URLs or logs

**JWT Secret:**
- [ ] `JWT_SECRET` is strong random string
- [ ] `JWT_SECRET` is in environment variables (not hardcoded)
- [ ] `JWT_SECRET` is different for development and production

### **Input Validation**

**Symbol Validation:**
- [ ] Symbol is non-empty string
- [ ] Symbol is trimmed and uppercased
- [ ] Symbol length validation (if needed)

**Exchange Validation:**
- [ ] Exchange is non-empty string
- [ ] Exchange is trimmed and uppercased
- [ ] Exchange is exactly "NSE" or "BSE" (no other values)

**SQL Injection Prevention:**
- [ ] Using MongoDB (NoSQL) - not vulnerable to SQL injection
- [ ] Mongoose ODM provides built-in protection

**XSS Prevention:**
- [ ] Input sanitization (if user input displayed)
- [ ] React automatically escapes content
- [ ] No `dangerouslySetInnerHTML` used with user input

### **API Key Security**

**Environment Variables:**
- [ ] All API keys in environment variables (not hardcoded)
- [ ] `.env` and `.env.local` files in `.gitignore`
- [ ] No API keys in code, logs, or version control
- [ ] API keys not exposed in frontend code (only backend)

**API Key Rotation:**
- [ ] Plan for rotating API keys if compromised
- [ ] Document process for updating keys

---

## ✅ 16. DEPLOYMENT CHECKLIST

### **Environment Variables (Production)**

**Backend Production:**
- [ ] `OPENAI_API_KEY` set in production environment
- [ ] `OPENAI_MODEL` set (default: `gpt-4o`)
- [ ] `PRICE_API_KEY` set (Alpha Vantage)
- [ ] `MARKET_PROVIDER` set to `alpha-vantage`
- [ ] `MONGO_URI` set (production MongoDB connection string)
- [ ] `JWT_SECRET` set (strong random string, different from dev)
- [ ] `BACKEND_URL` set (production backend URL)
- [ ] `FRONTEND_URL` set (production frontend URL)
- [ ] `PORT` set (production port, usually 5000 or environment-specific)

**Frontend Production:**
- [ ] `NEXT_PUBLIC_BACKEND_URL` set (production backend URL)
- [ ] `PRICE_API_KEY` set (if needed for Next.js API routes)
- [ ] `MARKET_PROVIDER` set (if needed for Next.js API routes)

### **Build & Deploy**

**Backend:**
- [ ] Backend builds successfully (`npm install` in backend/)
- [ ] No missing dependencies
- [ ] Server starts successfully (`npm run dev` or `npm start`)
- [ ] MongoDB connection works
- [ ] API endpoints accessible
- [ ] Health check endpoint works (if implemented)

**Frontend:**
- [ ] Frontend builds successfully (`npm run build`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No linting errors (`npm run lint`)
- [ ] All dependencies installed
- [ ] Next.js server starts successfully
- [ ] API routes work correctly

### **Post-Deployment Verification**

- [ ] Test prediction generation in production
- [ ] Verify OpenAI API calls work
- [ ] Verify Alpha Vantage API calls work
- [ ] Verify MongoDB connection and saves work
- [ ] Verify authentication works
- [ ] Check logs for errors
- [ ] Monitor API usage (OpenAI, Alpha Vantage)

---

## 🚨 COMMON ISSUES & SOLUTIONS

### **Issue 1: "OPENAI_API_KEY is not set"**

**Symptoms:**
- Error: `"OPENAI_API_KEY environment variable is not set. Please add it to your .env file."`
- Prediction fails immediately

**Solution:**
- [ ] Check `backend/.env` file exists
- [ ] Verify `OPENAI_API_KEY=your_key_here` is in `.env`
- [ ] Restart backend server after adding key
- [ ] Verify with: `console.log(process.env.OPENAI_API_KEY)` in backend
- [ ] Check `.env` file is in `backend/` directory (not root)
- [ ] Ensure no spaces around `=` sign

### **Issue 2: "Invalid exchange"**

**Symptoms:**
- Error: `"Invalid exchange: X. Only NSE and BSE are supported"`
- Request fails with 400 status

**Solution:**
- [ ] Ensure exchange is exactly "NSE" or "BSE" (uppercase)
- [ ] Check frontend sends correct exchange value
- [ ] Verify `selectedExchange` state in dashboard
- [ ] Check `ExchangeSelector` component sets correct value

### **Issue 3: "Failed to fetch market data"**

**Symptoms:**
- Error: `"Failed to fetch market data: <error message>"`
- Alpha Vantage API call fails

**Solution:**
- [ ] Check Alpha Vantage API key is valid
- [ ] Check symbol exists on exchange (try NSE if BSE fails)
- [ ] Check rate limits (25 requests/day for free tier)
- [ ] Verify symbol format: `SYMBOL.NS` (NSE) or `SYMBOL.BO` (BSE)
- [ ] Check network connectivity
- [ ] Verify Alpha Vantage API is not down
- [ ] Check API key has sufficient quota/credits
- [ ] Try different symbol if current one doesn't exist

### **Issue 4: "No token, authorization denied"**

**Symptoms:**
- Error: `"No token, authorization denied"` or `"Token is not valid"`
- Request fails with 401 status

**Solution:**
- [ ] Ensure user is logged in
- [ ] Check token exists: `localStorage.getItem('token')` returns non-null
- [ ] Verify token is sent in `Authorization: Bearer <token>` header
- [ ] Check token format (should start with "Bearer ")
- [ ] Verify `JWT_SECRET` matches between frontend and backend
- [ ] Check token hasn't expired
- [ ] Try logging out and logging back in to get new token

### **Issue 5: "Prediction not displaying"**

**Symptoms:**
- Prediction generated successfully but doesn't appear in UI
- No errors in console
- Prediction state is null

**Solution:**
- [ ] Check frontend receives `prediction` field in response
- [ ] Verify response format: `{ success: true, prediction: {...} }`
- [ ] Check `PredictionCard` receives correct props
- [ ] Verify TypeScript types match (`StockPrediction` interface)
- [ ] Check console for React errors
- [ ] Verify `setPrediction(result.prediction)` is called
- [ ] Check conditional rendering logic in dashboard

### **Issue 6: "OpenAI API rate limit exceeded"**

**Symptoms:**
- Error from OpenAI API about rate limits
- Predictions fail intermittently

**Solution:**
- [ ] Check OpenAI API usage in dashboard
- [ ] Implement request queuing or retry logic
- [ ] Add exponential backoff for retries
- [ ] Consider upgrading OpenAI plan for higher limits
- [ ] Implement client-side rate limiting

### **Issue 7: "MongoDB connection failed"**

**Symptoms:**
- Error: `"MongoDB connection failed"` or connection timeout
- Predictions can't be saved

**Solution:**
- [ ] Check `MONGO_URI` is correct in `.env`
- [ ] Verify MongoDB Atlas IP whitelist includes server IP
- [ ] Check MongoDB Atlas cluster is running
- [ ] Verify network connectivity to MongoDB
- [ ] Check MongoDB credentials are correct
- [ ] Verify MongoDB connection string format

---

## 📊 FINAL VERIFICATION

### **Complete End-to-End Test**

**Prerequisites:**
1. [ ] Backend server running (`cd backend && npm run dev`)
2. [ ] Frontend server running (`npm run dev`)
3. [ ] All environment variables set
4. [ ] MongoDB connected
5. [ ] User logged in

**Test Steps:**
1. [ ] **Login:** Login to dashboard and verify token stored
2. [ ] **Search Stock:** Search for "RELIANCE" in stock search
3. [ ] **Select Exchange:** Select "NSE" from exchange selector
4. [ ] **Get Prediction:** Click "Get AI Prediction" button
5. [ ] **Verify Loading:** Loading state appears (spinner/disabled button)
6. [ ] **Wait for Response:** Wait 10-30 seconds for prediction
7. [ ] **Verify Prediction:** Prediction appears in PredictionCard
8. [ ] **Verify Fields:** All fields display correctly:
   - [ ] Symbol: "RELIANCE"
   - [ ] Exchange: "NSE"
   - [ ] Current Price: ₹X,XXX.XX format
   - [ ] Entry Point: Valid number
   - [ ] Sell Point: Valid number
   - [ ] Target 1: Valid number
   - [ ] Target 2: Valid number
   - [ ] Stop Loss: Valid number (less than entry)
   - [ ] Confidence: 0-100%
   - [ ] Prediction Accuracy: 70-95%
   - [ ] Indicators Used: Array of strings
   - [ ] Rationale: Non-empty string
   - [ ] Last Updated: Valid timestamp
9. [ ] **Verify Database:** Check MongoDB for saved prediction
10. [ ] **Verify Customer:** Prediction has `customer` field matching user ID
11. [ ] **Verify Logs:** No errors in backend or frontend console
12. [ ] **Test Re-run:** Click "Re-run Prediction" and verify it works

### **Success Criteria**

- [ ] ✅ Prediction generated successfully (no errors)
- [ ] ✅ All fields displayed correctly in PredictionCard
- [ ] ✅ No console errors (backend or frontend)
- [ ] ✅ Prediction saved to MongoDB
- [ ] ✅ Customer ID associated with prediction
- [ ] ✅ User can re-run prediction
- [ ] ✅ Error handling works correctly
- [ ] ✅ Loading states work correctly
- [ ] ✅ Toast notifications appear

---

## 📝 ADDITIONAL NOTES

### **OpenAI Model Configuration**

- **Default Model:** `gpt-4o` (best accuracy, higher cost)
- **Alternative Models:**
  - `gpt-4-turbo` (good balance)
  - `gpt-4` (standard)
  - `gpt-3.5-turbo` (faster, lower cost, less accurate)
- **Temperature:** `0.2` (low for consistent outputs)
- **Response Format:** `json_object` (structured output)

### **Alpha Vantage Rate Limits**

- **Free Tier:** 25 requests/day, 5 requests/minute
- **Premium Tier:** Higher limits (check Alpha Vantage pricing)
- **Recommendation:** Implement caching to reduce API calls

### **Cost Estimates**

- **OpenAI gpt-4o:** ~$0.001-0.003 per prediction
- **OpenAI gpt-4-turbo:** ~$0.0005-0.001 per prediction
- **OpenAI gpt-3.5-turbo:** ~$0.0001-0.0003 per prediction
- **Alpha Vantage:** Free tier available, premium plans available

### **Symbol Format Rules**

- **NSE:** `SYMBOL.NS` (e.g., `RELIANCE.NS`)
- **BSE:** `SYMBOL.BO` (e.g., `RELIANCE.BO`)
- **Validation:** Only NSE and BSE exchanges supported

### **Data Freshness Rules**

- **Status: 'ok':** Data is < 180 seconds old
- **Status: 'stale_data':** Data is > 180 seconds old
- **Status: 'insufficient_data':** Symbol or current_price missing

### **Prediction Accuracy Range**

- **Range:** 0.70 - 0.95 (70% - 95%)
- **Validation:** Automatically fixed if out of range
- **Default:** 0.75 if missing

### **Confidence Level Range**

- **Range:** 0 - 100 (percentage)
- **Validation:** Automatically calculated from prediction_accuracy if missing
- **Default:** `Math.round(prediction_accuracy * 100)`

### **Stop Loss Calculation**

- **Default:** 3% below entry_point
- **Formula:** `entry_point * (1 - 0.03)`
- **Range:** 2-5% below entry_point (configurable)

---

## 🔗 RELATED DOCUMENTATION

- **OpenAI Integration Guide:** `docs/OPENAI_INTEGRATION_GUIDE.md`
- **API Integration Checklist:** `docs/API_INTEGRATION_CHECKLIST.md`
- **Alpha Vantage Setup:** `docs/ALPHA_VANTAGE_SETUP.md`
- **Complete Setup Summary:** `docs/COMPLETE_SETUP_SUMMARY.md`
- **Route Conflict Analysis:** `docs/ROUTE_CONFLICT_ANALYSIS.md`
- **AI Integration Summary:** `docs/AI_INTEGRATION_SUMMARY.md`

---

**Status:** ✅ Complete Integration Checklist (Based on Full Project Analysis)  
**Last Updated:** 2024-01-15  
**Version:** 2.0  
**Total Checklist Items:** 500+ verification points