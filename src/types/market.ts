// Market data types for Indian stock market dashboard (NSE + BSE only)

export type Exchange = 'NSE' | 'BSE';

export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1H' | '4H' | '1D';

export type SignalType = 'BUY' | 'SELL' | 'HOLD';

export interface CandleData {
  time: number; // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SignalData {
  signal: SignalType;
  confidence: number; // 0-100
  reason: string;
  indicators: {
    rsi?: number;
    macd?: number;
    ema20?: number;
    ema50?: number;
    sma20?: number;
    sma50?: number;
    volumePressure?: number;
  };
  timestamp?: string;
}

export interface LivePriceData {
  success: boolean;
  price: number;
  change: number;
  percent: number;
  timestamp: string;
  message?: string;
  symbol?: string;
  exchange?: Exchange;
  requestedExchange?: Exchange;
  formattedSymbol?: string;
  autoSwitched?: boolean;
}

export interface PriceHistory {
  time: number;
  price: number;
}

