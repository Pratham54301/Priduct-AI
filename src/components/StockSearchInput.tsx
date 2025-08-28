'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, TrendingUp, Building2, X, Filter, Sparkles } from 'lucide-react';
import { useStocks } from '@/hooks/useStocks';
import { Stock } from '@/types/stock';
import searchHistoryService from '@/services/searchHistoryService';
import { useAuth } from '@/context/AuthContext';

interface StockSearchInputProps {
  onStockSelect: (stock: Stock) => void;
  onPredictionRequest?: (stock: Stock) => void;
  placeholder?: string;
  className?: string;
  showSectorFilter?: boolean;
  trackSearchHistory?: boolean;
}

export default function StockSearchInput({ 
  onStockSelect, 
  onPredictionRequest,
  placeholder = "Search for stocks...",
  className = "",
  showSectorFilter = true,
  trackSearchHistory = true
}: StockSearchInputProps) {
  const { stocks, loading, error } = useStocks();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Stock[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [isTrackingSearch, setIsTrackingSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get unique sectors for filtering
  const sectors = useMemo(() => {
    const uniqueSectors = new Set<string>();
    stocks.forEach(stock => {
      if (stock.sector) {
        uniqueSectors.add(stock.sector);
      }
    });
    return Array.from(uniqueSectors).sort();
  }, [stocks]);

  // Filter stocks by sector
  const filteredStocks = useMemo(() => {
    if (!selectedSector) return stocks;
    return stocks.filter(stock => stock.sector === selectedSector);
  }, [stocks, selectedSector]);

  // Memoized search function for performance optimization
  const searchStocks = useCallback((query: string, limit: number = 10): Stock[] => {
    if (!query.trim() || !filteredStocks.length) return [];
    
    const queryLower = query.toLowerCase();
    const results: Stock[] = [];
    
    // First priority: exact symbol matches
    const exactSymbolMatches = filteredStocks.filter(stock => 
      stock.symbol.toLowerCase() === queryLower
    );
    results.push(...exactSymbolMatches);
    
    // Second priority: symbol starts with query
    const symbolStartsWith = filteredStocks.filter(stock => 
      stock.symbol.toLowerCase().startsWith(queryLower) && 
      !exactSymbolMatches.some(exact => exact.symbol === stock.symbol)
    );
    results.push(...symbolStartsWith);
    
    // Third priority: name contains query
    const nameContains = filteredStocks.filter(stock => 
      stock.name.toLowerCase().includes(queryLower) && 
      !results.some(result => result.symbol === stock.symbol)
    );
    results.push(...nameContains);
    
    // Fourth priority: symbol contains query
    const symbolContains = filteredStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(queryLower) && 
      !results.some(result => result.symbol === stock.symbol)
    );
    results.push(...symbolContains);
    
    return results.slice(0, limit);
  }, [filteredStocks]);

  // Track search in history
  const trackSearch = useCallback(async (stock: Stock, searchType: 'symbol' | 'name' | 'sector' = 'symbol') => {
    if (!trackSearchHistory || !user || isTrackingSearch) return;
    
    try {
      setIsTrackingSearch(true);
      await searchHistoryService.trackSearch(searchTerm, stock, searchType);
    } catch (error) {
      console.error('Failed to track search:', error);
    } finally {
      setIsTrackingSearch(false);
    }
  }, [trackSearchHistory, user, searchTerm, isTrackingSearch]);

  // Filter suggestions based on search term with debouncing
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      return;
    }

    const filtered = searchStocks(searchTerm, 10);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setHighlightedIndex(-1);
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
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleStockSelect(suggestions[highlightedIndex]);
          } else if (suggestions.length > 0) {
            handleStockSelect(suggestions[0]);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setHighlightedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, suggestions, highlightedIndex]);

  const handleStockSelect = async (stock: Stock) => {
    setSelectedStock(stock);
    setSearchTerm(stock.symbol);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    
    // Track search history
    await trackSearch(stock);
    
    // Call parent handlers
    onStockSelect(stock);
    
    // Focus back to input for better UX
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedStock(null);
    
    // Show suggestions if there's input
    if (value.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleInputFocus = () => {
    if (searchTerm.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const clearSelection = () => {
    setSearchTerm('');
    setSelectedStock(null);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector === selectedSector ? '' : sector);
    setSearchTerm('');
    setSelectedStock(null);
    setShowSuggestions(false);
  };

  const handlePredictionRequest = () => {
    if (selectedStock && onPredictionRequest) {
      onPredictionRequest(selectedStock);
    }
  };

  // Memoized suggestions list for performance
  const suggestionsList = useMemo(() => {
    return suggestions.map((stock, index) => (
      <div
        key={`${stock.symbol}-${index}`}
        onClick={() => handleStockSelect(stock)}
        onMouseEnter={() => setHighlightedIndex(index)}
        className={`flex items-center justify-between p-3 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors ${
          index === highlightedIndex 
            ? 'bg-blue-50 dark:bg-blue-900/20' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
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
        {stock.sector && (
          <div className="flex items-center space-x-2">
            <Building2 className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {stock.sector}
            </span>
          </div>
        )}
      </div>
    ));
  }, [suggestions, highlightedIndex]);

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
      {/* Sector Filter */}
      {showSectorFilter && sectors.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Sector:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => handleSectorChange(sector)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedSector === sector
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                }`}
              >
                {sector}
              </button>
            ))}
            {selectedSector && (
              <button
                onClick={() => setSelectedSector('')}
                className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="pl-10 pr-10"
          disabled={loading}
          autoComplete="off"
          spellCheck="false"
        />
        {selectedStock && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestionsList}
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
                {selectedStock.sector && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">{selectedStock.sector}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => onStockSelect(selectedStock)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Select Stock
                </Button>
                {onPredictionRequest && (
                  <Button 
                    onClick={handlePredictionRequest}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get AI Prediction
                  </Button>
                )}
              </div>
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

      {/* No Results Message */}
      {searchTerm.trim() && !loading && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-3">
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            No stocks found matching "{searchTerm}"
            {selectedSector && ` in ${selectedSector} sector`}
          </p>
        </div>
      )}
    </div>
  );
} 