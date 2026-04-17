'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Clock, Sparkles } from 'lucide-react';
import StockSearchInput from './StockSearchInput';
import TrendingWidget from './TrendingWidget';
import { Stock } from '@/types/stock';
import { SearchHistoryItem } from '@/services/searchHistoryService';
import searchHistoryService from '@/services/searchHistoryService';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    if (user) {
      loadRecentSearches();
    }
  }, [user]);

  const loadRecentSearches = async () => {
    try {
      const data = await searchHistoryService.getRecentSearches();
      setRecentSearches(data);
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  };

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
  };

  const handlePredictionRequest = async (stock: Stock) => {
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ticker: stock.symbol }),
      });

      if (response.ok) {
        console.log('Prediction requested for:', stock.symbol);
      }
    } catch (error) {
      console.error('Failed to get prediction:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to access the dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your stock searches and get AI-powered predictions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2 text-blue-500" />
              Stock Search & Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StockSearchInput
              onStockSelect={handleStockSelect}
              placeholder="Search for stocks to analyze..."
              className="w-full"
              showSectorFilter={true}
              trackSearchHistory={true}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-green-500" />
              Recent Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSearches.length > 0 ? (
                recentSearches.slice(0, 5).map((item) => (
                  <div
                    key={item._id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => setSelectedStock(item.selectedStock)}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.selectedStock.symbol}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.selectedStock.name}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No recent searches
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedStock && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Selected Stock: {selectedStock.symbol}</span>
              <Button
                onClick={() => handlePredictionRequest(selectedStock)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Get AI Prediction
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name
                </label>
                <p className="text-lg text-gray-900 dark:text-white">
                  {selectedStock.name}
                </p>
              </div>
              {selectedStock.sector && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sector
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {selectedStock.sector}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <TrendingWidget className="w-full" />
    </div>
  );
}
