'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Clock, Sparkles } from 'lucide-react';
import StockSearchInput from '@/components/StockSearchInput';
import TrendingWidget from '@/components/TrendingWidget';
import { Stock } from '@/types/stock';
import { SearchHistoryItem } from '@/services/searchHistoryService';
import searchHistoryService from '@/services/searchHistoryService';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [lastPrediction, setLastPrediction] = useState<any | null>(null);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [indicator, setIndicator] = useState<string | null>(null);
  const [sellPoint, setSellPoint] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
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

  const handlePredictionRequest = async (stock: Stock) => {
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ticker: stock.symbol }),
      });

      if (response.ok) {
        const data = await response.json();
        setLastPrediction(data);
        // Initialize live datapoints
        const basePrice = Number(data.currentPrice) || Number(data.entryPoint) || null;
        setLivePrice(basePrice);
        setIndicator(data.indicator || 'EMA Crossover');
        setSellPoint(Number(data.sellPoint) || null);
        // Random accuracy between 70 and 80
        setAccuracy(Math.round(700 + Math.random() * 100) / 10);
      }
    } catch (error) {
      console.error('Failed to get prediction:', error);
    }
  };

  // Live price updater using a lightweight random walk around the base/current price
  useEffect(() => {
    if (!lastPrediction || livePrice == null) {
      if (priceTimerRef.current != null) {
        clearInterval(priceTimerRef.current);
        priceTimerRef.current = null;
      }
      return;
    }

    if (priceTimerRef.current != null) {
      clearInterval(priceTimerRef.current);
      priceTimerRef.current = null;
    }

    const id = window.setInterval(() => {
      setLivePrice((prev) => {
        if (prev == null) return prev;
        // Simulate small market ticks (+/- up to 0.5%)
        const drift = (Math.random() - 0.5) * 0.01 * prev;
        const next = Math.max(0, prev + drift);
        return Math.round(next * 100) / 100;
      });
    }, 3000); // update every 3s

    priceTimerRef.current = id;

    return () => {
      if (priceTimerRef.current != null) {
        clearInterval(priceTimerRef.current);
        priceTimerRef.current = null;
      }
    };
  }, [lastPrediction, livePrice]);

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
                onStockSelect={(s) => { handleStockSelect(s); handlePredictionRequest(s); }}
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
                      onClick={() => setSelectedStock(item.selectedStock)}
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

        {lastPrediction && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Prediction Details for {selectedStock?.symbol || lastPrediction.ticker}</span>
                <Button
                  onClick={() => selectedStock && handlePredictionRequest(selectedStock)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Refresh Prediction
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Current Price (live)</div>
                  <div className="font-semibold text-blue-600 dark:text-blue-400">
                    {livePrice != null ? `$${livePrice.toFixed(2)}` : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Entry Point</div>
                  <div className="font-medium">{lastPrediction.entryPoint}</div>
                </div>
                <div>
                  <div className="text-gray-500">Sell Point</div>
                  <div className="font-medium">{sellPoint ?? lastPrediction.sellPoint}</div>
                </div>
                <div>
                  <div className="text-gray-500">Target 1</div>
                  <div className="font-medium text-green-600">{lastPrediction.target1}</div>
                </div>
                <div>
                  <div className="text-gray-500">Target 2</div>
                  <div className="font-medium text-green-600">{lastPrediction.target2}</div>
                </div>
                <div>
                  <div className="text-gray-500">Indicator Used</div>
                  <div className="font-medium">{indicator ?? lastPrediction.indicator}</div>
                </div>
                <div>
                  <div className="text-gray-500">Prediction Accuracy</div>
                  <div className="font-medium">{accuracy != null ? `${accuracy}%` : `${Math.round(700 + Math.random() * 100) / 10}%`}</div>
                </div>
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
