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
  stop_loss?: number; // Stop loss price
  indicators_used: string[];
  prediction_accuracy: number;
  confidence?: number; // Confidence level (0-100)
  rationale?: string;
  customer?: string; // customer ID
  createdAt?: string;
}

export interface LivePriceData {
  success: boolean;
  price: number;
  change: number;
  percent: number;
  timestamp: string;
  message?: string;
}
