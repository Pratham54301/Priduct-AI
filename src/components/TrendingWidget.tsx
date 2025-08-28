'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, Clock, Search, Filter } from 'lucide-react';
import { TrendingSearch, SearchAnalytics } from '@/services/searchHistoryService';
import searchHistoryService from '@/services/searchHistoryService';

interface TrendingWidgetProps {
  className?: string;
  onStockSelect?: (symbol: string) => void;
}

export default function TrendingWidget({ className = '', onStockSelect }: TrendingWidgetProps) {
  const [trendingStocks, setTrendingStocks] = useState<TrendingSearch[]>([]);
  const [analytics, setAnalytics] = useState<SearchAnalytics | null>(null);
  const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('7d');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'trending' | 'analytics'>('trending');
  const [sectorFilter, setSectorFilter] = useState<string>('');

  useEffect(() => {
    loadTrendingData();
  }, [period]);

  const loadTrendingData = async () => {
    setLoading(true);
    try {
      const [trendingData, analyticsData] = await Promise.all([
        searchHistoryService.getTrendingSearches(period, 50),
        searchHistoryService.getSearchAnalytics('30d')
      ]);
      
      setTrendingStocks(trendingData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockClick = (symbol: string) => {
    if (onStockSelect) {
      onStockSelect(symbol);
    }
  };

  const filteredTrending = useMemo(() => {
    if (!sectorFilter) return trendingStocks;
    return trendingStocks.filter(t => (t.stockSector || '').toLowerCase() === sectorFilter.toLowerCase());
  }, [trendingStocks, sectorFilter]);

  const availableSectors = useMemo(() => {
    const s = new Set<string>();
    trendingStocks.forEach(t => { if (t.stockSector) s.add(t.stockSector); });
    return Array.from(s).sort();
  }, [trendingStocks]);

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Market Trends
          </CardTitle>
          <div className="flex space-x-1">
            <Button
              variant={activeTab === 'trending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('trending')}
              className="text-xs"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('analytics')}
              className="text-xs"
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Analytics
            </Button>
          </div>
        </div>
        
        {activeTab === 'trending' && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex space-x-2">
              {(['24h', '7d', '30d'] as const).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPeriod(p)}
                  className="text-xs h-7 px-2"
                >
                  {p}
                </Button>
              ))}
            </div>
            {availableSectors.length > 0 && (
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  aria-label="Filter trending stocks by sector"
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="text-xs border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="">All Sectors</option>
                  {availableSectors.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'trending' && (
              <div className="space-y-3">
                {filteredTrending.length > 0 ? (
                  filteredTrending.map((stock, index) => (
                    <div
                      key={`${stock._id}-${index}`}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => handleStockClick(stock._id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {stock._id}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {stock.stockName}
                          </div>
                          {stock.stockSector && (
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              {stock.stockSector}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCount(stock.count)} searches
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatTimeAgo(stock.lastSearched)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No trending stocks found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && analytics && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {analytics.totalSearches}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      Total Searches
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {analytics.dailyAnalytics.length}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Active Days
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Top Searched Stocks
                  </h4>
                  <div className="space-y-2">
                    {analytics.topSearchedStocks.map((stock, index) => (
                      <div
                        key={stock._id}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            #{index + 1}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {stock._id}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {stock.count} searches
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Daily Activity
                  </h4>
                  <div className="space-y-2">
                    {analytics.dailyAnalytics.slice(-7).map((day) => (
                      <div
                        key={day._id}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(day._id).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {day.searches} searches
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {day.uniqueStockCount} stocks
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
