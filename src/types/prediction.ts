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
  indicators_used: string[];
  prediction_accuracy: number;
  rationale?: string;
  customer?: string; // customer ID
  createdAt?: string;
}

export interface LivePriceData {
  symbol: string;
  exchange: string;
  current_price: number;
  timestamp: string;
  indicators: {
    rsi: number | null;
    macd: { macd_line: number; macd_signal: number; macd_hist: number } | null;
    ema_fast: number | null;
    ema_slow: number | null;
    atr: number | null;
    trend: "uptrend" | "downtrend" | "sideways" | null;
  };
}
