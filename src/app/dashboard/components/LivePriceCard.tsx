'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { LivePriceData, PriceHistory } from '@/types/market';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

interface LivePriceCardProps {
  symbol: string;
  exchange: string;
  onRefresh?: () => void;
  onExchangeSwitch?: (newExchange: string) => void;
  className?: string;
}

export function LivePriceCard({ symbol, exchange, onRefresh, onExchangeSwitch, className }: LivePriceCardProps) {
  const [priceData, setPriceData] = useState<LivePriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async () => {
    if (!symbol) return;

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        symbol,
        exchange,
      });
      
      let res: Response;
      try {
        res = await fetch(`/api/price?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
      } catch (networkError: any) {
        // Network error (no internet, CORS, etc.)
        setError('Failed to connect to price API. Please check your internet connection.');
        console.error('[LivePriceCard] Network error:', networkError);
        return;
      }

      if (!res.ok) {
        let errorMessage = `Failed to fetch price (${res.status})`;
        try {
          const errorData = await res.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // Response is not JSON, use status text
          errorMessage = `Price API returned ${res.status}: ${res.statusText || 'Error'}`;
        }
        setError(errorMessage);
        console.warn('[LivePriceCard] API error:', { status: res.status, message: errorMessage });
        return;
      }

      let data: LivePriceData;
      try {
        data = await res.json();
      } catch (parseError) {
        setError('Invalid response from price API');
        console.error('[LivePriceCard] JSON parse error:', parseError);
        return;
      }

      if (data.success && data.price) {
        setPriceData(data);
        
        // If exchange was auto-switched, notify parent to update exchange selector
        if (data.autoSwitched && data.exchange && data.exchange !== exchange) {
          console.log(`[LivePriceCard] Exchange auto-switched from ${exchange} to ${data.exchange}`);
          onExchangeSwitch?.(data.exchange);
        }
        
        // Update price history for sparkline (keep last 7 points)
        setPriceHistory(prev => {
          const newHistory = [
            ...prev,
            { time: Date.now(), price: data.price }
          ].slice(-7);
          return newHistory;
        });

        onRefresh?.();
      } else {
        const errorMsg = data.message || 'Invalid price data received';
        setError(errorMsg);
        console.warn('[LivePriceCard] Invalid data:', { success: data.success, hasPrice: !!data.price, message: data.message });
      }
    } catch (err: any) {
      // Unexpected error
      const errorMsg = err?.message || 'An unexpected error occurred while fetching price';
      setError(errorMsg);
      console.error('[LivePriceCard] Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh every 5 seconds
  useAutoRefresh(5000, fetchPrice, !!symbol);

  // Initial fetch
  useEffect(() => {
    if (symbol) {
      fetchPrice();
    }
  }, [symbol, exchange]);

  if (!symbol) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Select a symbol to view live price</p>
        </CardContent>
      </Card>
    );
  }

  const isPositive = priceData ? priceData.change >= 0 : false;
  const priceColor = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  // Calculate sparkline data
  const sparklinePoints = priceHistory.length > 1
    ? priceHistory.map((p, i) => {
        const min = Math.min(...priceHistory.map(h => h.price));
        const max = Math.max(...priceHistory.map(h => h.price));
        const range = max - min || 1;
        return {
          x: (i / (priceHistory.length - 1)) * 100,
          y: 100 - ((p.price - min) / range) * 100,
        };
      })
    : [];

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Live Price - {symbol}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchPrice}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="space-y-2">
            <div className="text-sm text-destructive">{error}</div>
            {exchange === 'BSE' && error.toLowerCase().includes('bse') && (
              <div className="text-xs text-muted-foreground">
                💡 Tip: Many Indian stocks are primarily listed on NSE. Try switching to NSE exchange.
              </div>
            )}
          </div>
        ) : priceData ? (
          <>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground text-sm">Price</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={priceData.price}
                    initial={{ scale: 1.2, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`text-2xl font-bold ${priceColor}`}
                  >
                    ₹
                    {priceData.price.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Change</span>
                <div className={`flex items-center gap-1 ${priceColor}`}>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {isPositive ? '+' : ''}
                    {priceData.change.toFixed(2)} ({isPositive ? '+' : ''}
                    {priceData.percent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* Mini Sparkline */}
              {sparklinePoints.length > 1 && (
                <div className="h-12 w-full relative">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      points={sparklinePoints.map(p => `${p.x},${p.y}`).join(' ')}
                      fill="none"
                      stroke={isPositive ? '#22c55e' : '#ef4444'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <span>Last updated</span>
                <span>
                  {priceData.timestamp
                    ? format(new Date(priceData.timestamp), 'HH:mm:ss')
                    : 'N/A'}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

