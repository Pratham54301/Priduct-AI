'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SignalData, SignalType } from '@/types/market';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { motion } from 'framer-motion';

interface SignalBoxProps {
  symbol: string;
  exchange: string;
  onExchangeSwitch?: (newExchange: string) => void;
  className?: string;
}

const signalColors: Record<SignalType, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  BUY: {
    bg: 'bg-green-500/10 dark:bg-green-500/20',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-500/50',
    icon: <TrendingUp className="h-5 w-5" />,
  },
  SELL: {
    bg: 'bg-red-500/10 dark:bg-red-500/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-500/50',
    icon: <TrendingDown className="h-5 w-5" />,
  },
  HOLD: {
    bg: 'bg-yellow-500/10 dark:bg-yellow-500/20',
    text: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-500/50',
    icon: <Minus className="h-5 w-5" />,
  },
};

export function SignalBox({ symbol, exchange, onExchangeSwitch, className }: SignalBoxProps) {
  const [signalData, setSignalData] = useState<SignalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSignal = async () => {
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
        res = await fetch(`/api/signal?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
      } catch (networkError: any) {
        // Network error (no internet, CORS, etc.)
        setError('Failed to connect to signal API. Please check your internet connection.');
        console.error('[SignalBox] Network error:', networkError);
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        let errorMessage = `Failed to fetch signal (${res.status})`;
        try {
          const errorData = await res.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // Response is not JSON, use status text
          errorMessage = `Signal API returned ${res.status}: ${res.statusText || 'Error'}`;
        }
        setError(errorMessage);
        console.warn('[SignalBox] API error:', { status: res.status, message: errorMessage });
        setIsLoading(false);
        return;
      }

      let data: any;
      try {
        data = await res.json();
      } catch (parseError) {
        setError('Invalid response from signal API');
        console.error('[SignalBox] JSON parse error:', parseError);
        setIsLoading(false);
        return;
      }

      if (data.success) {
        // If exchange was auto-switched, notify parent
        if (data.autoSwitched && data.exchange && data.exchange !== exchange) {
          console.log(`[SignalBox] Exchange auto-switched from ${exchange} to ${data.exchange}`);
          onExchangeSwitch?.(data.exchange);
        }
        
        setSignalData({
          signal: data.signal,
          confidence: data.confidence,
          reason: data.reason,
          indicators: data.indicators,
          timestamp: data.timestamp,
        });
      } else {
        const errorMsg = data.message || 'Invalid signal data received';
        setError(errorMsg);
        console.warn('[SignalBox] Invalid data:', { success: data.success, message: data.message });
      }
    } catch (err: any) {
      // Unexpected error
      const errorMsg = err?.message || 'An unexpected error occurred while fetching signal';
      setError(errorMsg);
      console.error('[SignalBox] Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh every 10 seconds
  useAutoRefresh(10000, fetchSignal, !!symbol);

  // Initial fetch
  useEffect(() => {
    if (symbol) {
      fetchSignal();
    }
  }, [symbol, exchange]);

  if (!symbol) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Select a symbol to view signals</p>
        </CardContent>
      </Card>
    );
  }

  const signal = signalData?.signal || 'HOLD';
  const colors = signalColors[signal];

  return (
    <Card className={`${className} ${colors.border} border-2`}>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>AI Trading Signal</span>
          {signalData && (
            <Badge variant="outline" className={colors.text}>
              {signal}
            </Badge>
          )}
        </CardTitle>
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
        ) : isLoading ? (
          <div className="flex items-center justify-center h-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : signalData ? (
          <>
            <div className={`${colors.bg} p-4 rounded-lg space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Signal</span>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`flex items-center gap-2 ${colors.text}`}
                >
                  {colors.icon}
                  <span className="font-bold text-lg">{signal}</span>
                </motion.div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Confidence</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${signalData.confidence}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full ${signal === 'BUY' ? 'bg-green-500' : signal === 'SELL' ? 'bg-red-500' : 'bg-yellow-500'}`}
                      />
                    </div>
                    <span className={`text-sm font-medium ${colors.text}`}>
                      {signalData.confidence}%
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Reason</p>
                  <p className="text-sm font-medium">{signalData.reason}</p>
                </div>
              </div>
            </div>

            {/* Indicators */}
            {signalData.indicators && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {signalData.indicators.rsi !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RSI</span>
                    <span className="font-medium">{signalData.indicators.rsi.toFixed(2)}</span>
                  </div>
                )}
                {signalData.indicators.macd !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MACD</span>
                    <span className="font-medium">{signalData.indicators.macd.toFixed(2)}</span>
                  </div>
                )}
                {signalData.indicators.ema20 !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">EMA20</span>
                    <span className="font-medium">{signalData.indicators.ema20.toFixed(2)}</span>
                  </div>
                )}
                {signalData.indicators.ema50 !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">EMA50</span>
                    <span className="font-medium">{signalData.indicators.ema50.toFixed(2)}</span>
                  </div>
                )}
                {signalData.indicators.volumePressure !== undefined && (
                  <div className="flex justify-between col-span-2">
                    <span className="text-muted-foreground">Volume Pressure</span>
                    <span className="font-medium">
                      {signalData.indicators.volumePressure > 0 ? '+' : ''}
                      {signalData.indicators.volumePressure.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground">No signal data available</div>
        )}
      </CardContent>
    </Card>
  );
}

