# Price API Testing & Verification Guide

## Quick Start Testing

### 1. Verify Environment Setup

Create or update `.env.local` in the root directory:

```env
# Price API Configuration
PRICE_API_KEY=your_api_key_here
PRICE_API_PROVIDER=twelve-data

# Or use alternative naming
# MARKET_API_KEY=your_api_key_here
# MARKET_PROVIDER=twelve-data
```

**Restart your Next.js dev server** after adding/changing environment variables:
```bash
npm run dev
```

### 2. Test Backend API Directly

#### Test with Valid Symbol (Indian Stock)
```bash
curl "http://localhost:3000/api/price?symbol=RELIANCE&exchange=NSE"
```

**Expected Response (Success):**
```json
{
  "success": true,
  "price": 2900.00,
  "change": 10.50,
  "percent": 0.36,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Expected Response (Error - if API key invalid):**
```json
{
  "success": false,
  "message": "Price API returned 400: Bad Request. The API may not support this symbol or exchange."
}
```

#### Test with Missing Symbol
```bash
curl "http://localhost:3000/api/price?exchange=NSE"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Symbol parameter is required and cannot be empty"
}
```

#### Test with Empty Symbol
```bash
curl "http://localhost:3000/api/price?symbol=&exchange=NSE"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Symbol parameter is required and cannot be empty"
}
```

#### Test with US Stock
```bash
curl "http://localhost:3000/api/price?symbol=AAPL&exchange=NYSE"
```

### 3. Test Frontend Integration

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Open the dashboard:**
   - Navigate to `http://localhost:3000/dashboard`
   - Login if required

3. **Test Price Fetching:**
   - Search for a stock (e.g., "RELIANCE")
   - Select the stock from results
   - Click "Refresh Price" button
   - Check browser console for debug logs
   - Check server console for backend logs

### 4. Verify Debug Logs

#### Backend Console (Server Terminal)

You should see logs like:
```
[Price API] Raw incoming request params: { symbol: 'RELIANCE', exchange: 'NSE', ... }
[Price API] Cleaned params: { cleanSymbol: 'RELIANCE', cleanExchange: 'NSE', ... }
[Price API] buildApiUrl called with: { cleanSymbol: 'RELIANCE', ... }
[Price API] Final external API URL: https://api.twelvedata.com/price?symbol=RELIANCE.NSE&apikey=***REDACTED***
[Price API] Response status: 200 OK
[Price API] Success response: { price: 2900.00, ... }
```

#### Frontend Console (Browser DevTools)

You should see logs like:
```
[Frontend] Cleaned values before API call: { cleanSymbol: 'RELIANCE', cleanExchange: 'NSE', ... }
[Frontend] Final API URL: /api/price?symbol=RELIANCE&exchange=NSE
[Frontend] Response status: { ok: true, status: 200, ... }
[Frontend] Successfully fetched price: { symbol: 'RELIANCE', price: 2900.00, ... }
```

### 5. Error Scenario Testing

#### Test API Key Missing
1. Remove `PRICE_API_KEY` from `.env.local`
2. Restart server
3. Make API call
4. **Expected:** Error message about API key not configured

#### Test Invalid Symbol
```bash
curl "http://localhost:3000/api/price?symbol=INVALID123456789012345&exchange=NSE"
```
**Expected:** Validation error about symbol length

#### Test Network Error
1. Disconnect internet
2. Try fetching price
3. **Expected:** Network error message

### 6. Verify Error Handling

#### Test Empty Error Object Fix
1. Make a request that returns 400
2. Check browser console
3. **Verify:** Error log should NOT be `{}`
4. **Verify:** Error log should contain:
   - `errorInfo` object with properties
   - `errorMessage` string
   - `errorType`, `isErrorInstance`, `errorKeys`

Example of good error log:
```javascript
[Frontend] Error fetching live price: {
  symbol: 'RELIANCE',
  exchange: 'NSE',
  errorInfo: {
    message: 'Price API returned 400: Bad Request...',
    status: 400,
    statusText: 'Bad Request',
    ...
  },
  errorMessage: 'Price API returned 400: Bad Request...',
  errorType: 'object',
  isErrorInstance: true,
  errorKeys: ['message', 'status', 'statusText', 'details']
}
```

### 7. Performance Testing

#### Test Response Time
```bash
time curl "http://localhost:3000/api/price?symbol=RELIANCE&exchange=NSE"
```

#### Test Concurrent Requests
```bash
# Test 5 concurrent requests
for i in {1..5}; do
  curl "http://localhost:3000/api/price?symbol=RELIANCE&exchange=NSE" &
done
wait
```

### 8. Provider-Specific Testing

#### Twelve Data
```env
PRICE_API_KEY=your_twelve_data_key
PRICE_API_PROVIDER=twelve-data
```
Test with: `RELIANCE.NSE` format (automatically formatted)

#### Alpha Vantage
```env
PRICE_API_KEY=your_alpha_vantage_key
PRICE_API_PROVIDER=alpha-vantage
```
Test with: `AAPL` (US stocks only)

#### MarketStack
```env
PRICE_API_KEY=your_marketstack_key
PRICE_API_PROVIDER=marketstack
```
Test with: `AAPL` (US stocks)

## Troubleshooting Checklist

- [ ] Environment variables set in `.env.local` (root directory)
- [ ] Server restarted after adding env vars
- [ ] API key is valid and active
- [ ] Provider matches API key type
- [ ] Symbol format is correct for provider
- [ ] Network connection is active
- [ ] Check server console for backend logs
- [ ] Check browser console for frontend logs
- [ ] Verify no CORS issues
- [ ] Check API rate limits

## Common Issues & Solutions

### Issue: "API key is not configured"
**Solution:** 
- Check `.env.local` exists in root directory
- Verify variable name: `PRICE_API_KEY` or `MARKET_API_KEY`
- Restart dev server

### Issue: "Price API returned 400"
**Solution:**
- Check API key is valid
- Verify symbol format (e.g., `RELIANCE.NSE` for Twelve Data)
- Check API rate limits
- Review server logs for detailed error

### Issue: Empty error object `{}`
**Solution:**
- Should be fixed with latest code
- Check browser console for comprehensive error info
- Verify error extraction code is working

### Issue: "Symbol parameter is required"
**Solution:**
- Ensure symbol is passed in query params
- Check symbol is not empty string
- Verify URL encoding

## Success Criteria

✅ All API calls return proper JSON responses
✅ Error messages are descriptive and helpful
✅ Debug logs provide complete visibility
✅ No empty error objects in console
✅ Frontend displays user-friendly error messages
✅ Backend validates all inputs
✅ All error paths return proper responses

## Next Steps

1. **Set up your API key** in `.env.local`
2. **Test with a known valid symbol**
3. **Monitor console logs** for debugging
4. **Verify error handling** with invalid inputs
5. **Check user experience** in the dashboard

If you encounter any issues, check the debug logs first - they now provide comprehensive information about what's happening at each step.

