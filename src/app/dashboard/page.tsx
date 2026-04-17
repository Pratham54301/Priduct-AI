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
import { useRouter } from 'next/navigation';
import { PremiumUpgradeModal } from '@/components/PremiumUpgradeModal';

// New components
import { ExchangeSelector } from './components/ExchangeSelector';
import { LivePriceCard } from './components/LivePriceCard';
import { SignalBox } from './components/SignalBox';
import { CandleChart } from './components/CandleChart';

const normalizePredictionErrorMessage = (rawMessage?: string) => {
  const message = String(rawMessage || '').trim();
  if (!message) return 'Unable to generate prediction right now. Please try again.';

  const lower = message.toLowerCase();
  if (
    lower.includes('googlegenerativeai error') ||
    lower.includes('quota exceeded') ||
    lower.includes('too many requests') ||
    lower.includes('retrydelay')
  ) {
    return 'AI service is temporarily busy. A fallback model will be used when available, or please retry in about 1 minute.';
  }

  return message.length > 220 ? `${message.slice(0, 220)}...` : message;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [selectedExchange, setSelectedExchange] = useState<Exchange>('NSE');
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [prediction, setPrediction] = useState<StockPrediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

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
      console.log('[Dashboard] Requesting prediction:', {
        symbol: selectedStock.symbol,
        exchange: selectedExchange,
        timeframe: '1day'
      });

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

      console.log('[Dashboard] Prediction response status:', response.status);

      let result: any;
      try {
        const responseText = await response.text();
        console.log('[Dashboard] Prediction response (first 500 chars):', responseText.substring(0, 500));
        
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error('[Dashboard] Failed to parse prediction response:', parseError);
          throw new Error('Invalid response from prediction API');
        }
      } catch (parseError: any) {
        console.error('[Dashboard] Error reading prediction response:', parseError);
        throw new Error(parseError.message || 'Failed to read prediction response');
      }

      if (!response.ok) {
        if (result.code === 'PREDICTION_LIMIT_REACHED') {
          setShowPremiumModal(true);
        }
        const errorMessage = normalizePredictionErrorMessage(
          result.message || result.error || `Failed to generate prediction (${response.status})`
        );
        throw new Error(errorMessage);
      }

      if (result.success && result.prediction) {
        console.log('[Dashboard] Prediction received successfully');
        setPrediction(result.prediction);
        setError(null);
        await loadRecentSearches();
        
        toast({
          title: "Success",
          description: "Prediction generated successfully",
        });
      } else if (result.success && result.data) {
        // Handle case where backend returns 'data' instead of 'prediction'
        console.log('[Dashboard] Prediction received in data field');
        setPrediction(result.data);
        setError(null);
        await loadRecentSearches();
        
        toast({
          title: "Success",
          description: "Prediction generated successfully",
        });
      } else {
        const errorMessage = normalizePredictionErrorMessage(result.message || 'Failed to generate prediction');
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = normalizePredictionErrorMessage(
        err?.message || 'An unexpected error occurred while generating prediction'
      );
      setError(errorMessage);
      setPrediction(null);
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
              Indian Stock Market Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time NSE & BSE data, charts, and AI-powered signals
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
                Indian Stock Search & Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StockSearchInput
                onStockSelect={setSelectedStock}
                exchange={selectedExchange}
                placeholder="Search Indian stocks (NSE/BSE)..."
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
              onExchangeSwitch={(newExchange) => {
                setSelectedExchange(newExchange as Exchange);
                toast({
                  title: "Exchange Auto-Switched",
                  description: `Data not available on ${selectedExchange}. Switched to ${newExchange} automatically.`,
                });
              }}
              className="lg:col-span-2"
            />
            <SignalBox 
              symbol={currentSymbol}
              exchange={selectedExchange}
              onExchangeSwitch={(newExchange) => {
                setSelectedExchange(newExchange as Exchange);
                toast({
                  title: "Exchange Auto-Switched",
                  description: `Data not available on ${selectedExchange}. Switched to ${newExchange} automatically.`,
                });
              }}
            />
          </div>
        )}

        {/* Candlestick Chart */}
        {currentSymbol && (
          <CandleChart 
            symbol={currentSymbol}
            exchange={selectedExchange}
            onExchangeSwitch={(newExchange) => {
              setSelectedExchange(newExchange as Exchange);
              toast({
                title: "Exchange Auto-Switched",
                description: `Data not available on ${selectedExchange}. Switched to ${newExchange} automatically.`,
              });
            }}
          />
        )}

        {/* Prediction Card */}
        {(prediction || isLoading || error) && (
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
      <PremiumUpgradeModal
        open={showPremiumModal}
        onOpenChange={setShowPremiumModal}
        onUpgrade={() => {
          setShowPremiumModal(false);
          router.push('/customer/profile');
        }}
      />
    </div>
  );
}

