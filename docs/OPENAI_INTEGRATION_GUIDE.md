# OpenAI Integration Guide for AI Predictions

## ✅ OpenAI Integration Complete!

Your OpenAI API has been successfully integrated into the prediction system.

## 🔑 Environment Variables

Add to your `backend/.env` file:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o  # or gpt-4-turbo, gpt-4, gpt-3.5-turbo

# Market Data API (Alpha Vantage)
PRICE_API_KEY=4FVYC4DLNN34O6ME
MARKET_API_KEY=4FVYC4DLNN34O6ME
MARKET_PROVIDER=alpha-vantage
```

## 🤖 How It Works

### **Complete Prediction Flow:**

1. **User requests prediction** → Frontend calls `/api/predict`
2. **Backend fetches real market data** → Alpha Vantage API
   - Current price (GLOBAL_QUOTE)
   - Historical data (TIME_SERIES_INTRADAY)
3. **Backend calculates technical indicators:**
   - RSI (Relative Strength Index)
   - MACD (Moving Average Convergence Divergence)
   - EMA (Exponential Moving Averages - 12 & 26)
   - ATR (Average True Range)
   - Trend identification
4. **Backend sends data to OpenAI** → GPT-4o model
5. **OpenAI generates prediction** → Returns structured JSON
6. **Backend saves to MongoDB** → Stores prediction
7. **Frontend displays** → PredictionCard component

## 📊 Prediction Output Format

The AI generates predictions with the following structure:

```json
{
  "success": true,
  "message": "Prediction generated successfully",
  "data": {
    "_id": "...",
    "symbol": "RELIANCE",
    "exchange": "NSE",
    "timestamp": "2024-01-15T10:30:00Z",
    "status": "ok",
    "current_price": 2908.45,
    "entry_point": 2890.00,
    "sell_point": 3050.00,
    "target_1": 2950.00,
    "target_2": 3000.00,
    "stop_loss": 2800.00,
    "indicators_used": ["RSI", "MACD", "EMA", "Bollinger Bands"],
    "prediction_accuracy": 0.85,
    "confidence": 85,
    "rationale": "Based on technical analysis, RSI shows oversold conditions at 32.5, indicating potential reversal. MACD crossover suggests bullish momentum. Strong support at 2890 level. Target 1 at 2950 (1.4% gain) and Target 2 at 3000 (3.1% gain). Stop loss at 2800 to limit downside risk.",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## 🎯 AI Model Configuration

### **Recommended Models:**

1. **gpt-4o** (Recommended)
   - Best accuracy
   - Good reasoning
   - Higher cost

2. **gpt-4-turbo**
   - Good balance
   - Faster responses
   - Lower cost than gpt-4o

3. **gpt-4**
   - Standard GPT-4
   - Reliable

4. **gpt-3.5-turbo**
   - Fastest
   - Lower cost
   - Less accurate

### **Current Configuration:**
- **Model:** `gpt-4o` (default)
- **Temperature:** `0.2` (low for consistent outputs)
- **Response Format:** `json_object` (structured output)

## 📝 OpenAI Prompt Structure

### **System Message:**
Defines the AI's role and output format requirements.

### **User Message:**
Contains:
- Stock symbol and exchange
- Current price and OHLC data
- Technical indicators (RSI, MACD, EMA, ATR, Trend)
- Rules for generating predictions

### **Output Requirements:**
- Entry point (recommended buy price)
- Sell point (recommended exit price)
- Target 1 (first profit target)
- Target 2 (second profit target)
- Stop loss (risk management)
- Confidence level (0-100%)
- Prediction accuracy (0.70-0.95)
- Rationale (2-3 sentence explanation)
- Indicators used (array of indicator names)

## ⚙️ Configuration Options

### **Temperature:**
- **Current:** `0.2` (low for consistency)
- **Range:** `0.0` (deterministic) to `2.0` (creative)
- **Recommendation:** Keep at 0.2 for financial predictions

### **Response Format:**
- **Current:** `json_object` (structured)
- **Ensures:** Valid JSON output every time

## 🔒 Security & Rate Limits

### **OpenAI Rate Limits:**
- **Free Tier:** Limited requests
- **Paid Tier:** Higher limits
- **Recommendation:** Monitor usage in OpenAI dashboard

### **Backend Rate Limiting:**
- **Current:** 5 predictions per 15 minutes per IP
- **Location:** `backend/routes/predict.js`

## 🧪 Testing

### **Test Prediction Generation:**

```bash
# Using curl
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "symbol": "RELIANCE",
    "exchange": "NSE",
    "timeframe": "1day"
  }'
```

### **Expected Response:**
```json
{
  "success": true,
  "message": "Prediction generated successfully",
  "data": {
    "symbol": "RELIANCE",
    "exchange": "NSE",
    "current_price": 2908.45,
    "entry_point": 2890.00,
    "target_1": 2950.00,
    "target_2": 3000.00,
    "stop_loss": 2800.00,
    "confidence": 85,
    ...
  }
}
```

## ⚠️ Important Notes

### **Data Requirements:**
1. **Alpha Vantage API** must be working (for market data)
2. **OpenAI API Key** must be valid
3. **MongoDB** must be connected (for saving predictions)
4. **JWT Token** required for authentication

### **Error Handling:**
- If Alpha Vantage fails → Error message returned
- If OpenAI fails → Error message returned
- If data is stale (>180s) → Status set to "stale_data"
- If insufficient data → Status set to "insufficient_data"

### **Cost Considerations:**
- **OpenAI API:** Charged per token
- **gpt-4o:** ~$2.50 per 1M input tokens, $10 per 1M output tokens
- **Average prediction:** ~500-1000 tokens
- **Cost per prediction:** ~$0.001-0.003

## 🚀 Next Steps

1. ✅ **Set OpenAI API Key** in `backend/.env`
2. ✅ **Set OpenAI Model** (default: gpt-4o)
3. ⏳ **Test with real symbols** (RELIANCE, TCS, etc.)
4. ⏳ **Monitor API usage** in OpenAI dashboard
5. ⏳ **Adjust temperature** if needed (currently 0.2)

## 📊 Prediction Quality

The AI generates predictions based on:
- ✅ Real-time market data (Alpha Vantage)
- ✅ Technical indicators (RSI, MACD, EMA, ATR)
- ✅ Trend analysis
- ✅ Risk management (stop loss)
- ✅ Indian market context

**All predictions include:**
- Entry point
- Current price (live)
- Stop loss
- Target 1 & Target 2
- Indicator used
- Reason (explanation)
- Confidence level
- Last updated time

---

**Status:** ✅ Integration Complete
**Model:** gpt-4o (configurable)
**Data Source:** Alpha Vantage (real-time)

