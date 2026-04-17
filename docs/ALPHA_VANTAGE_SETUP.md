# Alpha Vantage API Integration Setup

## ✅ Configuration Complete

Your Alpha Vantage API has been integrated into the system.

## 🔑 API Key Configuration

**API Key:** `4FVYC4DLNN34O6ME`

### Environment Variables

Add to your `.env.local` (frontend) or `.env` (backend):

```env
# Market Data API - Alpha Vantage
PRICE_API_KEY=4FVYC4DLNN34O6ME
MARKET_API_KEY=4FVYC4DLNN34O6ME
MARKET_PROVIDER=alpha-vantage
PRICE_API_PROVIDER=alpha-vantage
```

## 📊 Symbol Format

Alpha Vantage uses the following format for Indian stocks:

- **NSE (National Stock Exchange):** `SYMBOL.NS`
  - Example: `RELIANCE.NS`, `TCS.NS`, `POWERGRID.NS`
  
- **BSE (Bombay Stock Exchange):** `SYMBOL.BO`
  - Example: `RELIANCE.BO`, `TCS.BO`

## 🔌 API Endpoints Used

### 1. **Live Price API**
**Endpoint:** `https://www.alphavantage.co/query`
**Function:** `GLOBAL_QUOTE`
**Example Request:**
```
GET https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=RELIANCE.NS&apikey=4FVYC4DLNN34O6ME
```

**Response Format:**
```json
{
  "Global Quote": {
    "01. symbol": "RELIANCE.NS",
    "02. open": "2900.00",
    "03. high": "2915.50",
    "04. low": "2895.25",
    "05. price": "2908.45",
    "06. volume": "1250000",
    "07. latest trading day": "2024-01-15",
    "08. previous close": "2923.65",
    "09. change": "-15.20",
    "10. change percent": "-0.5200%"
  }
}
```

### 2. **Candlestick Data API**
**Endpoint:** `https://www.alphavantage.co/query`
**Function:** `TIME_SERIES_INTRADAY`
**Example Request:**
```
GET https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=RELIANCE.NS&interval=5min&apikey=4FVYC4DLNN34O6ME&outputsize=compact
```

**Supported Intervals:**
- `1min` (1 minute)
- `5min` (5 minutes)
- `15min` (15 minutes)
- `30min` (30 minutes)
- `60min` (1 hour)

**Response Format:**
```json
{
  "Meta Data": {
    "1. Information": "Intraday (5min) open, high, low, close prices and volume",
    "2. Symbol": "RELIANCE.NS",
    "3. Last Refreshed": "2024-01-15 15:30:00",
    "4. Interval": "5min",
    "5. Output Size": "Compact",
    "6. Time Zone": "UTC"
  },
  "Time Series (5min)": {
    "2024-01-15 15:30:00": {
      "1. open": "2908.45",
      "2. high": "2910.00",
      "3. low": "2905.00",
      "4. close": "2909.00",
      "5. volume": "125000"
    }
  }
}
```

## ⚠️ Important Notes

### Rate Limits
- **Free Tier:** 25 requests per day, 5 requests per minute
- **Premium Tier:** Higher limits available
- **Recommendation:** Implement caching to reduce API calls

### Limitations
1. **Indian Stock Coverage:** Alpha Vantage has limited coverage for Indian stocks compared to Twelve Data
2. **Some symbols may not be available** - If a symbol fails, try:
   - Different exchange (NSE vs BSE)
   - Verify symbol exists on the exchange
   - Check Alpha Vantage symbol database

### Error Handling
Alpha Vantage returns errors in this format:
```json
{
  "Error Message": "Invalid API call. Please retry or visit the documentation..."
}
```
or
```json
{
  "Note": "Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute..."
}
```

The system now handles these errors gracefully.

## 🧪 Testing

### Test Live Price
```bash
curl "http://localhost:3000/api/price?symbol=RELIANCE&exchange=NSE"
```

### Test Candles
```bash
curl "http://localhost:3000/api/candles?symbol=RELIANCE&exchange=NSE&interval=5m"
```

### Test Signal
```bash
curl "http://localhost:3000/api/signal?symbol=RELIANCE&exchange=NSE"
```

## 📝 Next Steps

1. **Set Environment Variables:** Add the API key to your `.env` files
2. **Test with Real Symbols:** Try RELIANCE, TCS, HDFCBANK on NSE
3. **Monitor Rate Limits:** Watch for rate limit errors
4. **Consider Caching:** Implement caching for frequently accessed symbols
5. **Upgrade if Needed:** If hitting rate limits, consider Alpha Vantage premium

## 🔄 Symbol Availability

**Common Indian Stocks on Alpha Vantage:**
- ✅ RELIANCE.NS
- ✅ TCS.NS
- ✅ HDFCBANK.NS
- ✅ INFY.NS
- ✅ ICICIBANK.NS
- ⚠️ Some symbols may not be available

**If a symbol doesn't work:**
1. Check if it's listed on NSE/BSE
2. Verify the symbol format (uppercase, no spaces)
3. Try the other exchange
4. Check Alpha Vantage documentation for symbol availability

---

**Status:** ✅ Integration Complete
**Provider:** Alpha Vantage
**Default Provider:** Yes (set as default)

