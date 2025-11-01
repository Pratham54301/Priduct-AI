'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Clock, Sparkles } from 'lucide-react';
import StockSearchInput from '@/components/StockSearchInput';
import TrendingWidget from '@/components/TrendingWidget';
import PredictionCard from '@/components/PredictionCard';
import { Stock } from '@/types/stock';
import { StockPrediction, LivePriceData } from '@/types/prediction';
import { SearchHistoryItem } from '@/services/searchHistoryService';
import searchHistoryService from '@/services/searchHistoryService';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [prediction, setPrediction] = useState<StockPrediction | null>(null);
  const [livePriceData, setLivePriceData] = useState<LivePriceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const priceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (user) {
      loadRecentSearches();
    }
  }, [user]);

  const loadRecentSearches = async () => {
    try {
      const data = await searchHistoryService.getRecentSearches();
      setRecentSearches(data);
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  };

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
  };

  const fetchLivePrice = async (symbol: string, exchange: string) => {
    try {
      const response = await fetch(`/api/price?symbol=${symbol}&exchange=${exchange}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch live price: ${response.statusText}`);
      }
      const data: LivePriceData = await response.json();
      setLivePriceData(data);
    } catch (err: any) {
      console.error('Error fetching live price:', err);
      // Optionally set an error state for live price fetching
    }
  };

  const handlePredictionRequest = async (stock: Stock) => {
    if (!user) {
      setError("Please log in to get predictions.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setLivePriceData(null);

    // Clear any existing price polling interval
    if (priceTimerRef.current != null) {
      clearInterval(priceTimerRef.current);
      priceTimerRef.current = null;
    }

    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ symbol: stock.symbol, exchange: 'NSE', timeframe: '1day' }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to get prediction');
      }

      const data: StockPrediction = await response.json();
      setPrediction(data);
      if (data.status === 'ok') {
        // Start polling for live price if prediction is successful
        fetchLivePrice(data.symbol, data.exchange);
        const id = window.setInterval(() => {
          fetchLivePrice(data.symbol, data.exchange);
        }, 10000); // Poll every 10 seconds
        priceTimerRef.current = id;
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup interval on component unmount or when prediction changes
  useEffect(() => {
    return () => {
      if (priceTimerRef.current != null) {
        clearInterval(priceTimerRef.current);
        priceTimerRef.current = null;
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  useEffect(() => {
    // Re-verify login/signup redirects to the home page.
    // This logic is primarily handled in AuthContext and AiPredictionMachineSection.
    // No specific changes needed here for this task, but keeping the comment for verification.
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Please log in to access the dashboard</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Search stocks, view predictions, and track trends
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-blue-500" />
                Stock Search & Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StockSearchInput
                onStockSelect={setSelectedStock}
                onPredictionRequest={handlePredictionRequest}
                placeholder="Search for stocks to analyze..."
                className="w-full"
                showSectorFilter={true}
                trackSearchHistory={true}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-500" />
                Recent Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSearches.length > 0 ? (
                  recentSearches.slice(0, 8).map((item) => (
                    <div
                      key={item._id}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedStock(item.selectedStock);
                        handlePredictionRequest(item.selectedStock);
                      }}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.selectedStock.symbol}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.selectedStock.name}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No recent searches
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <PredictionCard
          prediction={prediction}
          onRerunPrediction={selectedStock ? () => handlePredictionRequest(selectedStock) : () => {}}
          isLoading={isLoading}
          error={error}
        />

        {/* Display live price data separately or integrate into PredictionCard if needed */}
        {livePriceData && prediction && (livePriceData.symbol === prediction.symbol) && (
          <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Live Market Data for {livePriceData.symbol} ({livePriceData.exchange})
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Current Live Price:</p>
                <p className="text-2xl font-semibold">
                  {livePriceData.current_price?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">RSI:</p>
                  <p className="font-medium">{livePriceData.indicators.rsi?.toFixed(2) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">MACD Line:</p>
                  <p className="font-medium">{livePriceData.indicators.macd?.macd_line?.toFixed(2) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">MACD Signal:</p>
                  <p className="font-medium">{livePriceData.indicators.macd?.macd_signal?.toFixed(2) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">EMA Fast:</p>
                  <p className="font-medium">{livePriceData.indicators.ema_fast?.toFixed(2) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">EMA Slow:</p>
                  <p className="font-medium">{livePriceData.indicators.ema_slow?.toFixed(2) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ATR:</p>
                  <p className="font-medium">{livePriceData.indicators.atr?.toFixed(2) || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Trend:</p>
                  <p className="font-medium capitalize">{livePriceData.indicators.trend || 'N/A'}</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Live Data Timestamp: {livePriceData.timestamp ? format(new Date(livePriceData.timestamp), 'PPpp') : 'N/A'}
              </div>
            </CardContent>
          </Card>
        )}

        <TrendingWidget className="w-full" />
      </main>
      <Footer />
    </div>
  );
}
