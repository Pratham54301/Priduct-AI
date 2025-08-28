export interface Stock {
  symbol: string;
  name: string;
  sector?: string;
  exchange?: string;
}

export interface StockPrediction {
  ticker: string;
  currentPrice: number;
  entryPoint: number;
  sellPoint: number;
  target1: number;
  target2: number;
  indicator: string;
  timestamp: string;
}

export interface StockSearchResult {
  stocks: Stock[];
  total: number;
  hasMore: boolean;
}
