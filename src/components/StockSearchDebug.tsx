'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Stock {
  symbol: string;
  name: string;
  sector: string;
}

export default function StockSearchDebug() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('TATA');
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);

  useEffect(() => {
    const loadStocks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Loading stocks...');
        const response = await fetch('/data/nse-stocks.json');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Loaded stocks:', data.length);
        console.log('First few stocks:', data.slice(0, 3));
        setStocks(data);
      } catch (err) {
        console.error('Error loading stocks:', err);
        setError(err instanceof Error ? err.message : 'Failed to load stocks');
      } finally {
        setLoading(false);
      }
    };

    loadStocks();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStocks([]);
      return;
    }

    const filtered = stocks.filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);

    console.log('Search term:', searchTerm);
    console.log('Filtered stocks:', filtered);
    setFilteredStocks(filtered);
  }, [searchTerm, stocks]);

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Stock Search Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search Term:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter search term..."
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Status:</h3>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            <p>Total Stocks: {stocks.length}</p>
            <p>Filtered Results: {filteredStocks.length}</p>
            {error && <p className="text-red-500">Error: {error}</p>}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Filtered Stocks:</h3>
            {filteredStocks.length > 0 ? (
              <div className="space-y-2">
                {filteredStocks.map((stock, index) => (
                  <div key={index} className="p-2 border rounded">
                    <strong>{stock.symbol}</strong> - {stock.name} ({stock.sector})
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No stocks found for "{searchTerm}"</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">All Tata Stocks:</h3>
            <div className="space-y-1">
              {stocks
                .filter(stock => 
                  stock.symbol.toLowerCase().includes('tata') || 
                  stock.name.toLowerCase().includes('tata')
                )
                .map((stock, index) => (
                  <div key={index} className="text-sm">
                    {stock.symbol} - {stock.name}
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 