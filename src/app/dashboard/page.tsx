'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Clock, Sparkles, Loader2, RefreshCw } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [prediction, setPrediction] = useState<StockPrediction | null>(null);
  const [livePriceData, setLivePriceData] = useState<LivePriceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPriceLoading, setIsPriceLoading] = useState<boolean>(false);
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
    // Fetch live price when stock is selected
    if (stock) {
      fetchLivePrice(stock.symbol, 'NSE');
    }
  };

  const fetchLivePrice = async (symbol: string, exchange: string) => {
    try {
      setIsPriceLoading(true);
      const res = await fetch(`/api/price?symbol=${symbol}&exchange=${exchange}`);

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || 'Failed to fetch live price');
      }

      setLivePriceData(json);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch live price';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setLivePriceData(null);
    } finally {
      setIsPriceLoading(false);
    }
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
      const token = localStorage.getItem('token');
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          symbol: selectedStock.symbol,
          exchange: 'NSE',
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
        
        // Add to recent searches
        await loadRecentSearches();
        
        toast({
          title: "Success",
          description: "Prediction fetched successfully",
        });

        // Fetch live price if prediction is successful
        if (result.prediction.status === 'ok' && selectedStock) {
          fetchLivePrice(selectedStock.symbol, result.prediction.exchange || 'NSE');
          
          // Optional: Auto-refresh every 10 seconds
          if (priceTimerRef.current != null) {
            clearInterval(priceTimerRef.current);
          }
          const id = window.setInterval(() => {
            if (selectedStock) {
              fetchLivePrice(selectedStock.symbol, result.prediction.exchange || 'NSE');
            }
          }, 10000); // Poll every 10 seconds
          priceTimerRef.current = id;
        }
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
    // Set stock first, then get prediction
    setSelectedStock(stock);
    
    // Small delay to ensure state is set
    setTimeout(() => {
      handleGetPrediction();
    }, 100);
  };

  // Cleanup interval on component unmount or when stock changes
  useEffect(() => {
    return () => {
      if (priceTimerRef.current != null) {
        clearInterval(priceTimerRef.current);
        priceTimerRef.current = null;
      }
    };
  }, [selectedStock]); // Cleanup when stock changes or component unmounts

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

        {prediction && (
          <PredictionCard
            prediction={prediction}
            onRerunPrediction={handleGetPrediction}
            isLoading={isLoading}
            error={error}
          />
        )}

        {/* Live Price Display */}
        {selectedStock && (
          <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                Live Price - {selectedStock.symbol}
              </CardTitle>
              <Button
                onClick={() => fetchLivePrice(selectedStock.symbol, 'NSE')}
                disabled={isPriceLoading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {isPriceLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh Price
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {isPriceLoading && !livePriceData ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading live price...</span>
                </div>
              ) : livePriceData && livePriceData.success ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="text-2xl font-semibold">
                        ₹{livePriceData.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-muted-foreground">Change:</span>
                      <span className={`text-lg font-medium ${livePriceData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {livePriceData.change >= 0 ? '+' : ''}{livePriceData.change.toFixed(2)} ({livePriceData.percent >= 0 ? '+' : ''}{livePriceData.percent.toFixed(2)}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <span>Last updated:</span>
                      <span>
                        {livePriceData.timestamp ? format(new Date(livePriceData.timestamp), 'PPpp') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {selectedStock ? 'Click "Refresh Price" to fetch live price data' : 'Select a stock to view live price'}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <TrendingWidget className="w-full" />
      </main>
      <Footer />
    </div>
  );
}
