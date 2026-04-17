# Price API Configuration Guide

This guide explains how to configure the Price API service for PredictAI.

## Environment Variables

### Required Variables

Add these to your `.env.local` file in the **root directory** (for Next.js frontend):

```env
# Option 1: Use PRICE_API_* naming
PRICE_API_KEY=your_api_key_here
PRICE_API_PROVIDER=twelve-data  # or alpha-vantage, marketstack

# Option 2: Use MARKET_API_* naming (also supported)
MARKET_API_KEY=your_api_key_here
MARKET_PROVIDER=twelve-data

# Optional: Custom API URL (if using a custom provider)
PRICE_API_URL=https://api.example.com/live
```

### Supported API Providers

#### 1. Twelve Data (Recommended)
- **Provider Name**: `twelve-data`
- **API Endpoint**: `https://api.twelvedata.com/price`
- **API Key Parameter**: `apikey`
- **Symbol Format**: 
  - US stocks: `AAPL`
  - Indian stocks: `RELIANCE.NSE` or `RELIANCE.BSE`
- **Get API Key**: https://twelvedata.com/
- **Free Tier**: 800 requests/day

**Example Configuration:**
```env
PRICE_API_KEY=your_twelve_data_api_key
PRICE_API_PROVIDER=twelve-data
```

#### 2. Alpha Vantage
- **Provider Name**: `alpha-vantage`
- **API Endpoint**: `https://www.alphavantage.co/query`
- **API Key Parameter**: `apikey`
- **Symbol Format**: `AAPL` (US stocks only)
- **Get API Key**: https://www.alphavantage.co/support/#api-key
- **Free Tier**: 5 API requests per minute, 500 requests/day

**Example Configuration:**
```env
PRICE_API_KEY=your_alpha_vantage_api_key
PRICE_API_PROVIDER=alpha-vantage
```

#### 3. MarketStack
- **Provider Name**: `marketstack`
- **API Endpoint**: `https://api.marketstack.com/v1/tickers/{symbol}/intraday/latest`
- **API Key Parameter**: `access_key`
- **Symbol Format**: `AAPL` (US stocks)
- **Get API Key**: https://marketstack.com/
- **Free Tier**: 1,000 requests/month

**Example Configuration:**
```env
PRICE_API_KEY=your_marketstack_api_key
PRICE_API_PROVIDER=marketstack
```

## Troubleshooting

### Error: "Price API returned 400: Bad Request"

This error typically occurs due to:

1. **Missing or Invalid API Key**
   - Check that `PRICE_API_KEY` or `MARKET_API_KEY` is set in `.env.local`
   - Verify the API key is correct and active
   - Restart your Next.js dev server after adding environment variables

2. **Invalid Symbol Format**
   - For Twelve Data with Indian stocks, use format: `SYMBOL.EXCHANGE` (e.g., `RELIANCE.NSE`)
   - For US stocks, use plain symbol: `AAPL`
   - Ensure symbol is uppercase and valid

3. **Wrong API Provider**
   - Check `PRICE_API_PROVIDER` or `MARKET_PROVIDER` matches your API key's provider
   - Default is `twelve-data` if not specified

4. **API Rate Limits**
   - Check if you've exceeded your API's rate limits
   - Some providers have daily/monthly limits on free tiers

### Debug Logs

The backend now includes comprehensive debug logs. Check your Next.js server console for:

- `[Price API] Request received:` - Shows incoming symbol and exchange
- `[Price API] Incoming request:` - Shows cleaned parameters
- `[Price API] Final API URL:` - Shows the constructed API URL (with key redacted)
- `[Price API] Response status:` - Shows HTTP status from external API
- `[Price API] Error response body:` - Shows raw error from API

### Frontend Validation

The frontend now validates:
- Symbol is not empty
- Symbol length is between 1-20 characters
- Symbol is properly encoded in URL
- Response contains valid price data

## Testing

1. **Test with a valid symbol:**
   ```bash
   curl "http://localhost:3000/api/price?symbol=AAPL&exchange=NYSE"
   ```

2. **Check server logs** for debug information

3. **Verify environment variables** are loaded:
   ```bash
   # In your Next.js app, check if variables are available
   console.log(process.env.PRICE_API_KEY ? 'API Key loaded' : 'API Key missing')
   ```

## Example .env.local File

```env
# Next.js Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Price API Configuration (choose one provider)
PRICE_API_KEY=abc123xyz789
PRICE_API_PROVIDER=twelve-data

# Alternative naming (also works)
# MARKET_API_KEY=abc123xyz789
# MARKET_PROVIDER=twelve-data
```

## Notes

- Environment variables in `.env.local` are only available server-side in Next.js
- Restart your dev server after changing environment variables
- API keys should never be committed to version control
- Add `.env.local` to your `.gitignore` file

