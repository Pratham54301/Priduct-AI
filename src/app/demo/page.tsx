'use client';

import React, { useState } from 'react';
import StockSearchInput from '@/components/StockSearchInput';
import TrendingWidget from '@/components/TrendingWidget';
import { Stock } from '@/types/stock';

export default function DemoPage() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    console.log('Selected stock:', stock);
  };

  const handlePredictionRequest = (stock: Stock) => {
    console.log('AI Prediction requested for:', stock);
    // In a real app, this would call your prediction API
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Enhanced Stock Search Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Experience the full stock search integration with sector filtering, search history, and trending analytics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Search Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Advanced Stock Search
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Search with sector filtering, real-time suggestions, and AI prediction integration
              </p>
              
              <StockSearchInput
                onStockSelect={handleStockSelect}
                onPredictionRequest={handlePredictionRequest}
                placeholder="Search for stocks (e.g., RELIANCE, TCS, HDFC)..."
                className="w-full"
                showSectorFilter={true}
                trackSearchHistory={true}
              />
            </div>

            {/* Selected Stock Details */}
            {selectedStock && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Selected Stock Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Symbol
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedStock.symbol}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Name
                    </label>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {selectedStock.name}
                    </p>
                  </div>
                  {selectedStock.sector && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Sector
                      </label>
                      <p className="text-lg text-gray-900 dark:text-white">
                        {selectedStock.sector}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Features Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Enhanced Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Search & Discovery</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Real-time search suggestions</li>
                    <li>• Sector-based filtering</li>
                    <li>• Case-insensitive matching</li>
                    <li>• Smart search prioritization</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">User Experience</h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Keyboard navigation</li>
                    <li>• Search history tracking</li>
                    <li>• AI prediction integration</li>
                    <li>• Performance optimized</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Widget */}
            <TrendingWidget className="w-full" />
            
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Stocks</span>
                  <span className="font-medium">100+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sectors</span>
                  <span className="font-medium">15+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Exchanges</span>
                  <span className="font-medium">NSE & BSE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
