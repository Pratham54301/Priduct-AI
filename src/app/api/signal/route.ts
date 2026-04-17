import { NextRequest, NextResponse } from 'next/server';

type SignalType = 'BUY' | 'SELL' | 'HOLD';

/**
 * Calculate RSI (Relative Strength Index)
 */
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
  const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

/**
 * Calculate EMA (Exponential Moving Average)
 */
function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1];

  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }

  return ema;
}

/**
 * Calculate SMA (Simple Moving Average)
 */
function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) {
    return prices.reduce((a, b) => a + b, 0) / prices.length;
  }
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

/**
 * Calculate MACD
 */
function calculateMACD(prices: number[]): number {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  return ema12 - ema26;
}

/**
 * Calculate Volume Pressure
 */
function calculateVolumePressure(volumes: number[]): number {
  if (volumes.length < 2) return 0;
  const recent = volumes.slice(-5).reduce((a, b) => a + b, 0) / 5;
  const older = volumes.slice(-20, -5).reduce((a, b) => a + b, 0) / 15;
  if (older === 0) return 0;
  return ((recent - older) / older) * 100;
}

/**
 * Generate trading signal based on technical indicators
 */
function generateSignal(
  candles: Array<{ close: number; volume: number }>
): {
  signal: SignalType;
  confidence: number;
  reason: string;
  indicators: {
    rsi: number;
    macd: number;
    ema20: number;
    ema50: number;
    sma20: number;
    sma50: number;
    volumePressure: number;
  };
} {
  if (candles.length < 50) {
    return {
      signal: 'HOLD',
      confidence: 50,
      reason: 'Insufficient data for analysis',
      indicators: {
        rsi: 50,
        macd: 0,
        ema20: candles[candles.length - 1]?.close || 0,
        ema50: candles[candles.length - 1]?.close || 0,
        sma20: candles[candles.length - 1]?.close || 0,
        sma50: candles[candles.length - 1]?.close || 0,
        volumePressure: 0,
      },
    };
  }

  const closes = candles.map(c => c.close);
  const volumes = candles.map(c => c.volume);

  const rsi = calculateRSI(closes);
  const macd = calculateMACD(closes);
  const ema20 = calculateEMA(closes, 20);
  const ema50 = calculateEMA(closes, 50);
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  const volumePressure = calculateVolumePressure(volumes);

  const currentPrice = closes[closes.length - 1];
  const previousPrice = closes[closes.length - 2];

  // Signal logic
  let buyScore = 0;
  let sellScore = 0;
  const reasons: string[] = [];

  // RSI signals
  if (rsi < 30) {
    buyScore += 25;
    reasons.push('RSI oversold');
  } else if (rsi > 70) {
    sellScore += 25;
    reasons.push('RSI overbought');
  }

  // MACD signals
  if (macd > 0 && macd > calculateMACD(closes.slice(0, -1))) {
    buyScore += 20;
    reasons.push('MACD bullish');
  } else if (macd < 0 && macd < calculateMACD(closes.slice(0, -1))) {
    sellScore += 20;
    reasons.push('MACD bearish');
  }

  // EMA crossover
  if (ema20 > ema50 && previousPrice <= ema50) {
    buyScore += 20;
    reasons.push('EMA bullish crossover');
  } else if (ema20 < ema50 && previousPrice >= ema50) {
    sellScore += 20;
    reasons.push('EMA bearish crossover');
  }

  // Price vs moving averages
  if (currentPrice > ema20 && currentPrice > sma20) {
    buyScore += 15;
    reasons.push('Price above MAs');
  } else if (currentPrice < ema20 && currentPrice < sma20) {
    sellScore += 15;
    reasons.push('Price below MAs');
  }

  // Volume pressure
  if (volumePressure > 20) {
    buyScore += 10;
    reasons.push('High volume pressure');
  } else if (volumePressure < -20) {
    sellScore += 10;
    reasons.push('Low volume pressure');
  }

  // Trend strength
  const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
  if (priceChange > 1) {
    buyScore += 10;
  } else if (priceChange < -1) {
    sellScore += 10;
  }

  // Determine signal
  let signal: SignalType;
  let confidence: number;

  if (buyScore > sellScore && buyScore >= 40) {
    signal = 'BUY';
    confidence = Math.min(95, 50 + buyScore);
  } else if (sellScore > buyScore && sellScore >= 40) {
    signal = 'SELL';
    confidence = Math.min(95, 50 + sellScore);
  } else {
    signal = 'HOLD';
    confidence = 50 + Math.abs(buyScore - sellScore);
  }

  const reason = reasons.length > 0 
    ? reasons.slice(0, 3).join(' + ')
    : 'Neutral market conditions';

  return {
    signal,
    confidence: Math.round(confidence),
    reason,
    indicators: {
      rsi: Math.round(rsi * 100) / 100,
      macd: Math.round(macd * 100) / 100,
      ema20: Math.round(ema20 * 100) / 100,
      ema50: Math.round(ema50 * 100) / 100,
      sma20: Math.round(sma20 * 100) / 100,
      sma50: Math.round(sma50 * 100) / 100,
      volumePressure: Math.round(volumePressure * 100) / 100,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const exchange = searchParams.get('exchange') || 'NSE';

    if (!symbol || symbol.trim() === '') {
      return NextResponse.json({
        success: false,
        message: 'Symbol parameter is required'
      }, { status: 400 });
    }

    const cleanSymbol = symbol.trim().toUpperCase();
    const cleanExchange = exchange.trim().toUpperCase();

    // Validate exchange is NSE or BSE only
    if (cleanExchange !== 'NSE' && cleanExchange !== 'BSE') {
      return NextResponse.json({
        success: false,
        message: `Invalid exchange: ${exchange}. Only NSE and BSE are supported for Indian stock market.`
      }, { status: 400 });
    }

    // Fetch candle data from this same Next.js app to avoid backend/Next route mismatches.
    const baseUrl = request.nextUrl.origin;
    
    const candleUrl = new URL('/api/candles', baseUrl);
    candleUrl.searchParams.set('symbol', cleanSymbol);
    candleUrl.searchParams.set('exchange', cleanExchange);
    candleUrl.searchParams.set('interval', '1D');

    let candleResponse: Response;
    try {
      candleResponse = await fetch(candleUrl.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });
    } catch (error: any) {
      console.error('[Signal API] Failed to fetch candles:', {
        error: error.message,
        name: error.name,
        url: candleUrl.toString(),
      });
      
      let errorMessage = 'Failed to fetch historical data for signal calculation';
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        errorMessage = 'Request timeout while fetching historical data. Please try again.';
      } else if (error.message?.includes('fetch')) {
        errorMessage = 'Network error while fetching historical data. Please check your connection.';
      }
      
      return NextResponse.json({
        success: false,
        message: errorMessage
      }, { status: 503 });
    }

    if (!candleResponse.ok) {
      let errorMessage = 'Failed to fetch historical data';
      try {
        const errorData = await candleResponse.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        // Response is not JSON
        errorMessage = `Historical data API returned ${candleResponse.status}: ${candleResponse.statusText || 'Error'}`;
      }
      
      console.warn('[Signal API] Candle API error:', {
        status: candleResponse.status,
        message: errorMessage,
        symbol: cleanSymbol,
        exchange: cleanExchange,
      });
      
      return NextResponse.json({
        success: false,
        message: errorMessage
      }, { status: candleResponse.status >= 500 ? 502 : candleResponse.status });
    }

    let candleData: any;
    try {
      candleData = await candleResponse.json();
    } catch (parseError) {
      console.error('[Signal API] Failed to parse candle response:', parseError);
      return NextResponse.json({
        success: false,
        message: 'Invalid response from historical data API'
      }, { status: 502 });
    }
    
    if (!candleData.success || !candleData.data || candleData.data.length === 0) {
      return NextResponse.json({
        success: false,
        message: candleData.message || 'Insufficient historical data for signal calculation. Please try again later.'
      }, { status: 404 });
    }

    // Generate signal
    const signal = generateSignal(candleData.data);

    // Pass through auto-switched exchange if candles API switched it
    const actualExchange = candleData.exchange || cleanExchange;
    const wasAutoSwitched = candleData.autoSwitched || false;

    return NextResponse.json({
      success: true,
      signal: signal.signal,
      confidence: signal.confidence,
      reason: signal.reason,
      indicators: signal.indicators,
      timestamp: new Date().toISOString(),
      symbol: cleanSymbol,
      exchange: actualExchange,
      autoSwitched: wasAutoSwitched,
    });

  } catch (error: any) {
    console.error('[Signal API] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}

