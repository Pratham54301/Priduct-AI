'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, TrendingUp, Building2 } from 'lucide-react';
import { useStocks } from '@/hooks/useStocks';

interface Stock {
  symbol: string;
  name: string;
  sector: string;
}

interface StockSearchInputProps {
  onStockSelect?: (symbol: string) => void;
  placeholder?: string;
  className?: string;
}

export default function StockSearchInput({ 
  onStockSelect, 
  placeholder = "Search for stocks...",
  className = ""
}: StockSearchInputProps) {
  const { stocks, loading, error, searchStocks } = useStocks();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Stock[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = searchStocks(searchTerm, 10);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [searchTerm, searchStocks]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    setSearchTerm(stock.symbol);
    setShowSuggestions(false);
    if (onStockSelect) onStockSelect(stock.symbol);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedStock(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleStockSelect(suggestions[0]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearSelection = () => {
    setSearchTerm('');
    setSelectedStock(null);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (error) {
    return (
      <div className={`p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md ${className}`}>
        <p className="text-red-600 dark:text-red-400 text-sm">
          Error loading stocks: {error}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="pl-10 pr-10"
          disabled={loading}
        />
        {selectedStock && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            ×
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((stock, index) => (
            <div
              key={`${stock.symbol}-${index}`}
              onClick={() => handleStockSelect(stock)}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {stock.symbol}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                    {stock.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {stock.sector}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Stock Display */}
      {selectedStock && (
        <Card className="mt-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{selectedStock.symbol}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedStock.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{selectedStock.sector}</p>
              </div>
              <Button 
                onClick={() => onStockSelect && onStockSelect(selectedStock.symbol)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Prediction
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-75 rounded-md">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
} 