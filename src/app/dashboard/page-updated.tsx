'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Clock, Sparkles, Loader2 } from 'lucide-react';
import StockSearchInput from '@/components/StockSearchInput';
import TrendingWidget from '@/components/TrendingWidget';
import PredictionCard from '@/components/PredictionCard';
import { Stock } from '@/types/stock';
import { StockPrediction } from '@/types/prediction';
import { SearchHistoryItem } from '@/services/searchHistoryService';
import searchHistoryService from '@/services/searchHistoryService';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Exchange } from '@/types/market';

// New components
import { ExchangeSelector } from './components/ExchangeSelector';
import { LivePriceCard } from './components/LivePriceCard';
import { SignalBox } from './components/SignalBox';
import { CandleChart } from './components/CandleChart';

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [selectedExchange, setSelectedExchange] = useState<Exchange>('NSE');
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [prediction, setPrediction] = useState<StockPrediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleGetPrediction = async () => {
    if (!selectedStock) {
      toast({
        title: "Error",
        description: "Please select a stock first",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to get predictions",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          symbol: selectedStock.symbol,
          exchange: selectedExchange,
          timeframe: '1day'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.message || result.error || 'Failed to generate prediction';
        throw new Error(errorMessage);
      }

      if (result.success && result.prediction) {
        setPrediction(result.prediction);
        await loadRecentSearches();
        
        toast({
          title: "Success",
          description: "Prediction fetched successfully",
        });
      } else {
        throw new Error(result.message || 'Failed to generate prediction');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictionRequest = async (stock: Stock) => {
    setSelectedStock(stock);
    setTimeout(() => {
      handleGetPrediction();
    }, 100);
  };

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

  const currentSymbol = selectedStock?.symbol || '';

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trading Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time market data, charts, and AI-powered signals
            </p>
          </div>
          <ExchangeSelector 
            value={selectedExchange} 
            onChange={setSelectedExchange}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-blue-500" />
                Stock Search & Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StockSearchInput
                onStockSelect={setSelectedStock}
                placeholder="Search for stocks to analyze..."
                className="w-full"
                showSectorFilter={true}
                trackSearchHistory={true}
              />
              
              {selectedStock && (
                <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedStock.symbol}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedStock.name}</p>
                    {selectedStock.sector && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">{selectedStock.sector}</p>
                    )}
                  </div>
                  <Button
                    onClick={handleGetPrediction}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Get AI Prediction
                      </>
                    )}
                  </Button>
                </div>
              )}
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

        {/* Live Price & Signal Row */}
        {currentSymbol && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <LivePriceCard 
              symbol={currentSymbol}
              exchange={selectedExchange}
              className="lg:col-span-2"
            />
            <SignalBox 
              symbol={currentSymbol}
              exchange={selectedExchange}
            />
          </div>
        )}

        {/* Candlestick Chart */}
        {currentSymbol && (
          <CandleChart 
            symbol={currentSymbol}
            exchange={selectedExchange}
          />
        )}

        {/* Prediction Card */}
        {prediction && (
          <PredictionCard
            prediction={prediction}
            onRerunPrediction={handleGetPrediction}
            isLoading={isLoading}
            error={error}
          />
        )}

        <TrendingWidget className="w-full" />
      </main>
      <Footer />
    </div>
  );
}

