import { NextRequest, NextResponse } from 'next/server';
import { alternateExchange, fetchYahooChart, formatSymbolForExchange, normalizeExchange } from '@/lib/yahooMarket';

type Timeframe = '1m' | '5m' | '15m' | '30m' | '1H' | '4H' | '1D';

const timeframeMap: Record<Timeframe, { interval: any; range: any }> = {
  '1m': { interval: '1m', range: '1d' },
  '5m': { interval: '5m', range: '5d' },
  '15m': { interval: '15m', range: '1mo' },
  '30m': { interval: '30m', range: '1mo' },
  '1H': { interval: '60m', range: '3mo' },
  '4H': { interval: '1d', range: '6mo' },
  '1D': { interval: '1d', range: '1y' },
};

function parseCandles(result: any) {
  const ts: number[] = result?.timestamp || [];
  const quote = result?.indicators?.quote?.[0] || {};
  const open = quote.open || [];
  const high = quote.high || [];
  const low = quote.low || [];
  const close = quote.close || [];
  const volume = quote.volume || [];

  const candles: Array<{ time: number; open: number; high: number; low: number; close: number; volume: number }> = [];
  for (let i = 0; i < ts.length; i++) {
    const o = Number(open[i]);
    const h = Number(high[i]);
    const l = Number(low[i]);
    const c = Number(close[i]);
    const v = Number(volume[i] ?? 0);
    if ([o, h, l, c].some((x) => Number.isNaN(x) || x <= 0)) continue;
    candles.push({ time: ts[i], open: o, high: h, low: l, close: c, volume: Number.isNaN(v) ? 0 : v });
  }
  return candles;
}

export async function GET(request: NextRequest) {
  try {
    const symbol = request.nextUrl.searchParams.get('symbol');
    const requestedExchange = request.nextUrl.searchParams.get('exchange') || 'NSE';
    const interval = (request.nextUrl.searchParams.get('interval') || '1D') as Timeframe;
    if (!symbol?.trim()) return NextResponse.json({ success: false, message: 'Symbol parameter is required' }, { status: 400 });
    if (!timeframeMap[interval]) return NextResponse.json({ success: false, message: 'Invalid interval' }, { status: 400 });

    const exchange = normalizeExchange(requestedExchange);
    const { interval: yahooInterval, range: yahooRange } = timeframeMap[interval];
    const primary = formatSymbolForExchange(symbol, exchange);
    const fallbackExchange = alternateExchange(exchange);
    const fallback = formatSymbolForExchange(symbol, fallbackExchange);

    try {
      const result = await fetchYahooChart(primary, yahooInterval, yahooRange);
      const candles = parseCandles(result);
      if (!candles.length) throw new Error('No candle data available');
      return NextResponse.json({
        success: true,
        data: candles,
        symbol: symbol.trim().toUpperCase(),
        exchange,
        formattedSymbol: primary,
        interval,
        count: candles.length,
      });
    } catch (primaryError: any) {
      const result = await fetchYahooChart(fallback, yahooInterval, yahooRange).catch(() => null);
      const candles = result ? parseCandles(result) : [];
      if (candles.length) {
        return NextResponse.json({
          success: true,
          data: candles,
          symbol: symbol.trim().toUpperCase(),
          exchange: fallbackExchange,
          formattedSymbol: fallback,
          requestedExchange: exchange,
          autoSwitched: true,
          message: `Data not found on ${exchange}. Switched to ${fallbackExchange}.`,
          interval,
          count: candles.length,
        });
      }
      throw primaryError;
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error?.message || 'No candle data available for selected symbol/exchange.',
    }, { status: 404 });
  }
}
