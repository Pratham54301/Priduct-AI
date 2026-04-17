'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, ColorType } from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { CandleData, Timeframe } from '@/types/market';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

interface CandleChartProps {
  symbol: string;
  exchange: string;
  onExchangeSwitch?: (newExchange: string) => void;
  className?: string;
}

const timeframes: Timeframe[] = ['1m', '5m', '15m', '30m', '1H', '4H', '1D'];

export function CandleChart({ symbol, exchange, onExchangeSwitch, className }: CandleChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    let chart: IChartApi | null = null;

    // Ensure container has dimensions before creating chart
    const initializeChart = () => {
      if (!chartContainerRef.current) return;

      const container = chartContainerRef.current;
      const containerWidth = container.clientWidth || container.offsetWidth || 800;
      
      if (containerWidth === 0) {
        // Wait for next frame if container has no width
        requestAnimationFrame(() => {
          if (chartContainerRef.current) {
            initializeChart();
          }
        });
        return;
      }

      try {
        // Create chart
        chart = createChart(container, {
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: 'var(--foreground)',
          },
          grid: {
            vertLines: { color: 'var(--border)' },
            horzLines: { color: 'var(--border)' },
          },
          width: containerWidth,
          height: 500,
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
          },
          rightPriceScale: {
            borderColor: 'var(--border)',
          },
        });

        // Verify chart was created successfully
        if (!chart) {
          console.error('[CandleChart] Chart creation returned null/undefined');
          setError('Failed to initialize chart. Please refresh the page.');
          return;
        }

        // Use type assertion to access methods (TypeScript types may be incomplete)
        const chartApi = chart as any;
        
        // Check if methods are available - try both addCandlestickSeries and addSeries
        let addCandlestickMethod: ((opts: any) => any) | null = null;
        
        if (typeof chartApi.addCandlestickSeries === 'function') {
          addCandlestickMethod = chartApi.addCandlestickSeries.bind(chartApi);
        } else if (typeof chartApi.addSeries === 'function') {
          // Fallback: use addSeries with 'Candlestick' type
          addCandlestickMethod = (opts: any) => chartApi.addSeries('Candlestick', opts);
        }
        
        if (!addCandlestickMethod) {
          console.error('[CandleChart] addCandlestickSeries not available', {
            chart: !!chart,
            chartType: typeof chart,
            chartKeys: chart ? Object.keys(chart).slice(0, 20) : [],
            hasAddSeries: typeof chartApi.addSeries === 'function',
            hasAddCandlestickSeries: typeof chartApi.addCandlestickSeries === 'function',
            chartMethods: chart ? Object.getOwnPropertyNames(Object.getPrototypeOf(chart)).slice(0, 20) : []
          });
          setError('Chart library not fully loaded. Please refresh the page.');
          return;
        }

        chartRef.current = chart;

        // Create candlestick series using the available method
        const candlestickSeries = addCandlestickMethod({
          upColor: '#22c55e',
          downColor: '#ef4444',
          borderVisible: false,
          wickUpColor: '#22c55e',
          wickDownColor: '#ef4444',
        });
        
        if (!candlestickSeries) {
          console.error('[CandleChart] Failed to create candlestick series');
          setError('Failed to create chart series. Please refresh the page.');
          return;
        }
        
        candlestickSeriesRef.current = candlestickSeries as ISeriesApi<'Candlestick'>;

        // Create volume series
        if (typeof chartApi.addHistogramSeries === 'function') {
          const volumeSeries = chartApi.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
              type: 'volume',
            },
            priceScaleId: 'volume',
            scaleMargins: {
              top: 0.8,
              bottom: 0,
            },
          });
          
          if (volumeSeries) {
            volumeSeriesRef.current = volumeSeries as ISeriesApi<'Histogram'>;
            
            // Set volume price scale
            try {
              const volumePriceScale = chartApi.priceScale('volume');
              if (volumePriceScale) {
                volumePriceScale.applyOptions({
                  scaleMargins: {
                    top: 0.8,
                    bottom: 0,
                  },
                });
              }
            } catch (scaleError) {
              console.warn('[CandleChart] Could not set volume price scale:', scaleError);
            }
          }
        } else {
          console.warn('[CandleChart] addHistogramSeries not available, volume chart disabled');
        }
      } catch (err: any) {
        console.error('[CandleChart] Error initializing chart:', {
          error: err,
          message: err?.message,
          stack: err?.stack,
          name: err?.name
        });
        setError(`Failed to initialize chart: ${err?.message || 'Unknown error'}. Please refresh the page.`);
      }
    };

    // Initialize chart
    initializeChart();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        const newWidth = chartContainerRef.current.clientWidth || chartContainerRef.current.offsetWidth || 800;
        chartRef.current.applyOptions({
          width: newWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (err) {
          console.error('[CandleChart] Error removing chart:', err);
        }
        chartRef.current = null;
        candlestickSeriesRef.current = null;
        volumeSeriesRef.current = null;
      }
    };
  }, []);

  const fetchCandles = async () => {
    if (!symbol) return;

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        symbol,
        exchange,
        interval: selectedTimeframe,
      });

      let res: Response;
      try {
        res = await fetch(`/api/candles?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
      } catch (networkError: any) {
        // Network error (no internet, CORS, etc.)
        setError('Failed to connect to candles API. Please check your internet connection.');
        console.error('[CandleChart] Network error:', networkError);
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        let errorMessage = `Failed to fetch candles (${res.status})`;
        try {
          const errorData = await res.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // Response is not JSON, use status text
          errorMessage = `Candles API returned ${res.status}: ${res.statusText || 'Error'}`;
        }
        setError(errorMessage);
        console.warn('[CandleChart] API error:', { status: res.status, message: errorMessage, symbol, exchange, interval: selectedTimeframe });
        setIsLoading(false);
        return;
      }

      let data: any;
      try {
        data = await res.json();
      } catch (parseError) {
        setError('Invalid response from candles API');
        console.error('[CandleChart] JSON parse error:', parseError);
        setIsLoading(false);
        return;
      }

      if (data.success && data.data && Array.isArray(data.data)) {
        // If exchange was auto-switched, notify parent
        if (data.autoSwitched && data.exchange && data.exchange !== exchange) {
          console.log(`[CandleChart] Exchange auto-switched from ${exchange} to ${data.exchange}`);
          onExchangeSwitch?.(data.exchange);
        }
        
        const candles: CandleData[] = data.data;

        if (candles.length === 0) {
          setError('No candle data available for this symbol and interval. Please try a different timeframe or symbol.');
          console.warn('[CandleChart] Empty candle data:', { symbol, exchange, interval: selectedTimeframe });
          setIsLoading(false);
          return;
        }

        // Format data for lightweight-charts
        const formattedCandles = candles.map(c => ({
          time: c.time as any,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }));

        const formattedVolume = candles.map(c => ({
          time: c.time as any,
          value: c.volume,
          color: c.close >= c.open ? '#22c55e80' : '#ef444480',
        }));

        // Update chart with new data
        if (candlestickSeriesRef.current && volumeSeriesRef.current) {
          candlestickSeriesRef.current.setData(formattedCandles);
          volumeSeriesRef.current.setData(formattedVolume);
          setLastUpdate(new Date());
          setIsLoading(false);
        } else {
          console.warn('[CandleChart] Chart series not initialized');
          setIsLoading(false);
        }

        // Update chart
        if (candlestickSeriesRef.current) {
          candlestickSeriesRef.current.setData(formattedCandles);
        }
        if (volumeSeriesRef.current) {
          volumeSeriesRef.current.setData(formattedVolume);
        }

        setLastUpdate(new Date());
      } else {
        const errorMsg = data.message || 'Invalid candle data received';
        setError(errorMsg);
        console.warn('[CandleChart] Invalid data:', { success: data.success, hasData: !!data.data, isArray: Array.isArray(data.data), message: data.message });
      }
    } catch (err: any) {
      // Unexpected error
      const errorMsg = err?.message || 'An unexpected error occurred while fetching candle data';
      setError(errorMsg);
      console.error('[CandleChart] Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh every 5-10 seconds based on timeframe
  const refreshInterval = selectedTimeframe === '1m' ? 5000 : selectedTimeframe === '5m' ? 10000 : 15000;
  useAutoRefresh(refreshInterval, fetchCandles, !!symbol);

  // Fetch when symbol, exchange, or timeframe changes
  useEffect(() => {
    if (symbol && chartRef.current) {
      fetchCandles();
    }
  }, [symbol, exchange, selectedTimeframe]);

  if (!symbol) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-[500px]">
          <p className="text-muted-foreground">Select a symbol to view chart</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Candlestick Chart - {symbol}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select
            value={selectedTimeframe}
            onValueChange={(val) => setSelectedTimeframe(val as Timeframe)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((tf) => (
                <SelectItem key={tf} value={tf}>
                  {tf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="space-y-2 text-center py-8">
            <div className="text-sm text-destructive">{error}</div>
            {exchange === 'BSE' && error.toLowerCase().includes('bse') && (
              <div className="text-xs text-muted-foreground">
                💡 Tip: Many Indian stocks are primarily listed on NSE. Try switching to NSE exchange.
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
            )}
            <div ref={chartContainerRef} className="w-full" style={{ height: '500px' }} />
            {lastUpdate && (
              <div className="text-xs text-muted-foreground mt-2 text-right">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

