import { NextRequest, NextResponse } from 'next/server';
import { alternateExchange, fetchYahooChart, formatSymbolForExchange, normalizeExchange } from '@/lib/yahooMarket';

function parseQuote(result: any) {
  const meta = result?.meta || {};
  const closes = result?.indicators?.quote?.[0]?.close || [];
  const timestamps = result?.timestamp || [];
  const validCloses = closes.filter((v: number | null) => typeof v === 'number') as number[];
  const current = Number(meta.regularMarketPrice ?? validCloses[validCloses.length - 1]);
  const previous = Number(meta.previousClose ?? validCloses[validCloses.length - 2] ?? current);
  const change = current - previous;
  const percent = previous ? (change / previous) * 100 : 0;
  const lastTs = timestamps[timestamps.length - 1];
  const timestamp = lastTs ? new Date(lastTs * 1000).toISOString() : new Date().toISOString();
  return { current, change, percent, timestamp };
}

export async function GET(request: NextRequest) {
  try {
    const symbol = request.nextUrl.searchParams.get('symbol');
    const requestedExchange = request.nextUrl.searchParams.get('exchange') || 'NSE';
    if (!symbol?.trim()) return NextResponse.json({ success: false, message: 'Symbol parameter is required' }, { status: 400 });

    const exchange = normalizeExchange(requestedExchange);
    const primary = formatSymbolForExchange(symbol, exchange);
    const fallbackExchange = alternateExchange(exchange);
    const fallback = formatSymbolForExchange(symbol, fallbackExchange);

    const tryFetch = async (symbolWithSuffix: string) => {
      const result = await fetchYahooChart(symbolWithSuffix, '1d', '5d');
      const quote = parseQuote(result);
      if (!quote.current || Number.isNaN(quote.current)) throw new Error('No valid quote data');
      return quote;
    };

    try {
      const quote = await tryFetch(primary);
      return NextResponse.json({
        success: true,
        symbol: symbol.trim().toUpperCase(),
        exchange,
        formattedSymbol: primary,
        price: Number(quote.current),
        change: Number(quote.change),
        percent: Number(quote.percent),
        timestamp: quote.timestamp,
      });
    } catch (primaryError: any) {
      try {
        const result = await fetchYahooChart(fallback, '1d', '5d');
        const quote = parseQuote(result);
        return NextResponse.json({
          success: true,
          symbol: symbol.trim().toUpperCase(),
          exchange: fallbackExchange,
          formattedSymbol: fallback,
          autoSwitched: true,
          requestedExchange: exchange,
          message: `Data not found on ${exchange}. Switched to ${fallbackExchange}.`,
          price: Number(quote.current),
          change: Number(quote.change),
          percent: Number(quote.percent),
          timestamp: quote.timestamp,
        });
      } catch {
        throw primaryError;
      }
    }
  } catch (error: any) {
      return NextResponse.json({
        success: false,
        message: error?.message || 'No data available for the selected symbol on NSE/BSE.',
      }, { status: 404 });
  }
}

