# Quick Start Guide - Alpha Vantage Integration

## ✅ Alpha Vantage API Integrated!

Your Alpha Vantage API has been successfully integrated into the system.

## 🚀 Setup Steps

### 1. **Set Environment Variables**

Create or update `.env.local` in the root directory:

```env
# Market Data API - Alpha Vantage
PRICE_API_KEY=4FVYC4DLNN34O6ME
MARKET_API_KEY=4FVYC4DLNN34O6ME
MARKET_PROVIDER=alpha-vantage
PRICE_API_PROVIDER=alpha-vantage

# Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### 2. **Restart Your Development Server**

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 3. **Test the Integration**

#### Test Live Price:
Open your browser and navigate to:
```
http://localhost:3000/api/price?symbol=RELIANCE&exchange=NSE
```

Expected response:
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

#### Test Candlestick Data:
```
http://localhost:3000/api/candles?symbol=RELIANCE&exchange=NSE&interval=5m
```

#### Test Trading Signal:
```
http://localhost:3000/api/signal?symbol=RELIANCE&exchange=NSE
```

## 📊 Symbol Format

- **NSE:** `SYMBOL.NS` (e.g., `RELIANCE.NS`, `TCS.NS`)
- **BSE:** `SYMBOL.BO` (e.g., `RELIANCE.BO`)

The system automatically converts your symbols to this format.

## ⚠️ Important Notes

### Rate Limits
- **Free Tier:** 25 requests per day, 5 requests per minute
- **Recommendation:** 
  - Don't refresh too frequently
  - Consider implementing caching
  - Upgrade to premium if needed

### Symbol Availability
Alpha Vantage has limited coverage for Indian stocks. If a symbol doesn't work:
1. Try NSE instead of BSE (or vice versa)
2. Verify the symbol exists on the exchange
3. Check if the symbol is available on Alpha Vantage

### Common Working Symbols
- ✅ RELIANCE.NS
- ✅ TCS.NS
- ✅ HDFCBANK.NS
- ✅ INFY.NS
- ✅ ICICIBANK.NS

## 🎯 Next Steps

1. ✅ **Environment variables set** - Done
2. ✅ **API integrated** - Done
3. ⏳ **Test with real symbols** - Try RELIANCE, TCS on NSE
4. ⏳ **Configure OpenAI** - For AI predictions (if needed)
5. ⏳ **Set up MongoDB** - For saving predictions

## 🔧 Troubleshooting

### Error: "Invalid API call"
- Check your API key is correct
- Verify symbol format
- Check rate limits

### Error: "No data available"
- Symbol might not be available on Alpha Vantage
- Try a different exchange (NSE vs BSE)
- Try a different symbol

### Error: "Thank you for using Alpha Vantage! Our standard API call frequency..."
- You've hit the rate limit (5 calls/minute)
- Wait a minute before trying again
- Consider upgrading to premium

---

**Status:** ✅ Ready to use!
**API Key:** Configured
**Provider:** Alpha Vantage (Default)

