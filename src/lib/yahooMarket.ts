export type SupportedExchange = 'NSE' | 'BSE';

export type ChartInterval = '1m' | '2m' | '5m' | '15m' | '30m' | '60m' | '90m' | '1h' | '1d' | '5d' | '1wk' | '1mo' | '3mo';
export type ChartRange = '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | '10y' | 'ytd' | 'max';

export function normalizeExchange(exchange: string): SupportedExchange {
  const value = String(exchange || '').trim().toUpperCase();
  if (value === 'NSE' || value === 'BSE') return value;
  throw new Error(`Invalid exchange: ${exchange}. Only NSE and BSE are supported.`);
}

export function formatSymbolForExchange(symbol: string, exchange: SupportedExchange): string {
  const clean = String(symbol || '').trim().toUpperCase();
  if (!clean) throw new Error('Symbol is required');
  if (clean.endsWith('.NS') || clean.endsWith('.BO')) return clean;
  return `${clean}${exchange === 'NSE' ? '.NS' : '.BO'}`;
}

export function alternateExchange(exchange: SupportedExchange): SupportedExchange {
  return exchange === 'NSE' ? 'BSE' : 'NSE';
}

export async function fetchYahooChart(symbolWithSuffix: string, interval: ChartInterval, range: ChartRange) {
  const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbolWithSuffix)}`);
  url.searchParams.set('interval', interval);
  url.searchParams.set('range', range);

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json', 'User-Agent': 'ProductAI/1.0' },
    cache: 'no-store',
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    throw new Error(`Yahoo Finance request failed (${res.status})`);
  }

  const result = data?.chart?.result?.[0];
  const error = data?.chart?.error;
  if (!result || error) {
    throw new Error(error?.description || 'No Yahoo Finance data found');
  }
  return result;
}
