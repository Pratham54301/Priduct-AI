import { useState, useEffect } from 'react';

interface Stock {
  symbol: string;
  name: string;
  sector: string;
}

export function useStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!query.trim()) return [];
    
    const filtered = stocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.slice(0, limit);
  };

  const getStockBySymbol = (symbol: string): Stock | undefined => {
    return stocks.find(stock => stock.symbol.toLowerCase() === symbol.toLowerCase());
  };

  return {
    stocks,
    loading,
    error,
    searchStocks,
    getStockBySymbol
  };
} 