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
    // Validate inputs before making API call
    if (!symbol || typeof symbol !== 'string' || symbol.trim() === '') {
      console.error('[Frontend] Invalid symbol provided:', { symbol, type: typeof symbol });
      toast({
        title: 'Validation Error',
        description: 'Stock symbol is required and cannot be empty',
        variant: 'destructive',
      });
      setLivePriceData(null);
      return;
    }

    // Clean and validate symbol
    const cleanSymbol = symbol.trim().toUpperCase();
    const cleanExchange = (exchange || 'NSE').trim().toUpperCase();

    // DEBUG: Log cleaned values before API call
    console.log('[Frontend] Cleaned values before API call:', {
      originalSymbol: symbol,
      cleanSymbol,
      originalExchange: exchange,
      cleanExchange,
      symbolLength: cleanSymbol.length,
      exchangeLength: cleanExchange.length
    });

    // Additional validation
    if (cleanSymbol.length < 1 || cleanSymbol.length > 20) {
      console.error('[Frontend] Invalid symbol length:', { cleanSymbol, length: cleanSymbol.length });
      toast({
        title: 'Validation Error',
        description: 'Stock symbol must be between 1 and 20 characters',
        variant: 'destructive',
      });
      setLivePriceData(null);
      return;
    }

    try {
      setIsPriceLoading(true);
      setError(null);

      // Build URL with proper encoding
      const params = new URLSearchParams({
        symbol: cleanSymbol,
        exchange: cleanExchange
      });
      const apiUrl = `/api/price?${params.toString()}`;

      // DEBUG: Log final URL being fetched
      console.log('[Frontend] Final API URL:', apiUrl);
      console.log('[Frontend] Request params:', {
        symbol: cleanSymbol,
        exchange: cleanExchange,
        encodedSymbol: params.get('symbol'),
        encodedExchange: params.get('exchange')
      });

      const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      // DEBUG: Log response status
      console.log('[Frontend] Response status:', {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries())
      });

      // Check if response is ok
      if (!res.ok) {
        // Try to parse error response - read as text first to handle empty responses
        let errorMessage = `Failed to fetch live price (${res.status})`;
        let errorDetails: any = null;
        
        try {
          // Read response as text first to check if it has content
          const responseText = await res.text();
          console.log('[Frontend] Error response text:', responseText || '(empty)');
          
          if (responseText && responseText.trim().length > 0) {
            try {
              errorDetails = JSON.parse(responseText);
              
              // Check if parsed data has meaningful content
              const hasContent = errorDetails && 
                                typeof errorDetails === 'object' && 
                                Object.keys(errorDetails).length > 0;
              
              // Log parsed data only if it has content (never log empty objects)
              if (hasContent) {
                console.log('[Frontend] Parsed error data:', {
                  keys: Object.keys(errorDetails),
                  hasMessage: !!errorDetails.message,
                  hasError: !!errorDetails.error,
                  data: errorDetails
                });
              }
              
              // Always log with context, never log empty objects directly
              if (hasContent) {
                errorMessage = errorDetails.message || errorDetails.error || errorDetails.Message || errorMessage;
                console.error('[Frontend] API error response:', {
                  status: res.status,
                  statusText: res.statusText,
                  errorDataKeys: Object.keys(errorDetails),
                  errorData: errorDetails,
                  extractedMessage: errorMessage,
                  hasMessage: !!errorDetails.message,
                  hasError: !!errorDetails.error
                });
              } else {
                // Empty object or no meaningful data - log with warning
                console.error('[Frontend] API error response: empty or invalid object', {
                  status: res.status,
                  statusText: res.statusText,
                  parsedDataType: typeof errorDetails,
                  parsedDataKeys: errorDetails ? Object.keys(errorDetails) : [],
                  rawResponseText: responseText.substring(0, 200),
                  parsedDataStringified: JSON.stringify(errorDetails)
                });
                errorMessage = `Price API returned ${res.status}: ${res.statusText || 'Bad Request'}. The API may not support this symbol or exchange.`;
              }
            } catch (parseError: any) {
              // Not valid JSON, use the text as error message if it's meaningful
              console.error('[Frontend] Failed to parse error JSON:', {
                parseError: parseError.message,
                responseText: responseText.substring(0, 500)
              });
              if (responseText.length < 200) {
                errorMessage = responseText;
              } else {
                errorMessage = `Price API returned ${res.status}: ${res.statusText || 'Bad Request'}`;
              }
            }
          } else {
            // Empty response body
            console.error('[Frontend] API error response: empty body', {
              status: res.status,
              statusText: res.statusText
            });
            errorMessage = `Price API returned ${res.status}: ${res.statusText || 'Bad Request'}. The API returned an empty response. Please check your API configuration.`;
          }
        } catch (readError: any) {
          // If reading fails completely, use status text
          console.error('[Frontend] Failed to read error response:', {
            error: readError,
            message: readError?.message,
            stack: readError?.stack,
            name: readError?.name
          });
          errorMessage = `Price API returned ${res.status}: ${res.statusText || 'Bad Request'}`;
        }

        // Create a proper Error object with all details
        const apiError = new Error(errorMessage);
        (apiError as any).status = res.status;
        (apiError as any).statusText = res.statusText;
        (apiError as any).details = errorDetails;
        throw apiError;
      }

      // Parse JSON response (response is ok, so we can safely parse)
      let json: any;
      try {
        json = await res.json();
        console.log('[Frontend] Parsed JSON response:', json);
      } catch (parseError: any) {
        console.error('[Frontend] Failed to parse JSON response:', {
          error: parseError,
          message: parseError?.message,
          stack: parseError?.stack
        });
        throw new Error('Invalid JSON response from price API');
      }

      // Validate response structure
      if (!json || typeof json !== 'object') {
        console.error('[Frontend] Invalid response structure:', { json, type: typeof json });
        throw new Error('Invalid response format from price API');
      }

      // Check if response indicates an error (shouldn't happen if res.ok is true, but check anyway)
      if (!json.success) {
        const errorMsg = json.message || json.error || 'Failed to fetch live price';
        console.error('[Frontend] API returned error in success response:', json);
        throw new Error(errorMsg);
      }

      // Validate that price data exists
      if (json.price === undefined || json.price === null || isNaN(json.price)) {
        console.error('[Frontend] Invalid price data:', {
          price: json.price,
          type: typeof json.price,
          fullResponse: json
        });
        throw new Error('Invalid price data received from API');
      }

      console.log('[Frontend] Successfully fetched price:', {
        symbol: cleanSymbol,
        exchange: cleanExchange,
        price: json.price,
        change: json.change,
        percent: json.percent
      });

      setLivePriceData(json);
      setError(null);
    } catch (err: any) {
      // Extract all possible error information
      const errorInfo = {
        // Standard Error properties
        message: err?.message,
        name: err?.name,
        stack: err?.stack,
        // Custom properties
        status: err?.status,
        statusText: err?.statusText,
        details: err?.details,
        // Response properties (if it's a fetch error)
        response: err?.response,
        // String representation
        toString: err?.toString?.(),
        // Full error object (for debugging)
        fullError: err
      };

      // Build comprehensive error message
      let errorMessage = 'Failed to fetch live price. Please try again.';
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.status && err?.statusText) {
        errorMessage = `Price API returned ${err.status}: ${err.statusText}`;
      }

      // Build error log object with only meaningful data
      const errorLog: any = {
        symbol: cleanSymbol,
        exchange: cleanExchange,
        errorMessage,
        errorType: typeof err,
        isErrorInstance: err instanceof Error
      };

      // Only add errorInfo properties that have values
      if (errorInfo.message) errorLog.errorMessage = errorInfo.message;
      if (errorInfo.name) errorLog.errorName = errorInfo.name;
      if (errorInfo.status) errorLog.status = errorInfo.status;
      if (errorInfo.statusText) errorLog.statusText = errorInfo.statusText;
      if (errorInfo.stack) errorLog.stack = errorInfo.stack;
      if (errorInfo.details) errorLog.details = errorInfo.details;
      if (errorInfo.response) errorLog.response = errorInfo.response;
      
      // Add error keys for debugging
      if (err && typeof err === 'object') {
        errorLog.errorKeys = Object.keys(err);
      }

      // Log comprehensive error information (never empty)
      console.error('[Frontend] Error fetching live price:', errorLog);

      // Additional warning if error object appears malformed
      if (!errorInfo.message && !errorInfo.status && !errorInfo.name && err) {
        console.error('[Frontend] WARNING: Error object appears to be empty or malformed:', {
          errorType: typeof err,
          errorConstructor: err?.constructor?.name,
          errorStringified: JSON.stringify(err),
          errorToString: err?.toString?.(),
          hasMessage: 'message' in err,
          hasStack: 'stack' in err,
          errorValue: err
        });
      }

      setError(errorMessage);
      setLivePriceData(null);

      // Show user-friendly error message
      toast({
        title: 'Price Fetch Error',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000, // Show for 5 seconds
      });
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
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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
