import { useState, useEffect, useMemo } from 'react';

interface Stock {
  symbol: string;
  name: string;
  sector?: string;
}

export function useStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized stocks data for performance
  const memoizedStocks = useMemo(() => stocks, [stocks]);

  useEffect(() => {
    const loadStocks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/data/nse-stocks.json');
        if (!response.ok) {
          throw new Error('Failed to load stocks data');
        }
        const data = await response.json();
        setStocks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stocks');
        console.error('Error loading stocks:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStocks();
  }, []);

  const searchStocks = (query: string, limit: number = 10): Stock[] => {
    if (!query.trim() || !memoizedStocks.length) return [];
    
    const queryLower = query.toLowerCase();
    const results: Stock[] = [];
    
    // First priority: exact symbol matches
    const exactSymbolMatches = memoizedStocks.filter(stock => 
      stock.symbol.toLowerCase() === queryLower
    );
    results.push(...exactSymbolMatches);
    
    // Second priority: symbol starts with query
    const symbolStartsWith = memoizedStocks.filter(stock => 
      stock.symbol.toLowerCase().startsWith(queryLower) && 
      !exactSymbolMatches.some(exact => exact.symbol === stock.symbol)
    );
    results.push(...symbolStartsWith);
    
    // Third priority: name contains query
    const nameContains = memoizedStocks.filter(stock => 
      stock.name.toLowerCase().includes(queryLower) && 
      !results.some(result => result.symbol === stock.symbol)
    );
    results.push(...nameContains);
    
    // Fourth priority: symbol contains query
    const symbolContains = memoizedStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(queryLower) && 
      !results.some(result => result.symbol === stock.symbol)
    );
    results.push(...symbolContains);
    
    return results.slice(0, limit);
  };

  const getStockBySymbol = (symbol: string): Stock | undefined => {
    return memoizedStocks.find(stock => stock.symbol.toLowerCase() === symbol.toLowerCase());
  };

  return {
    stocks: memoizedStocks,
    loading,
    error,
    searchStocks,
    getStockBySymbol
  };
} 