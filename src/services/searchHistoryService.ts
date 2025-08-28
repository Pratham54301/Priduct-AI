import { Stock } from '@/types/stock';

export interface SearchHistoryItem {
  _id: string;
  searchTerm: string;
  selectedStock: Stock;
  searchType: 'symbol' | 'name' | 'sector';
  timestamp: string;
}

export interface TrendingSearch {
  _id: string;
  count: number;
  stockName: string;
  stockSector?: string;
  lastSearched: string;
}

export interface SearchAnalytics {
  period: string;
  totalSearches: number;
  dailyAnalytics: Array<{
    _id: string;
    searches: number;
    uniqueStockCount: number;
  }>;
  topSearchedStocks: Array<{
    _id: string;
    count: number;
    stockName: string;
  }>;
}

class SearchHistoryService {
  private baseUrl = '/api/search-history';

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Track a new search
  async trackSearch(
    searchTerm: string, 
    selectedStock: Stock, 
    searchType: 'symbol' | 'name' | 'sector' = 'symbol'
  ): Promise<{ message: string; searchHistory: SearchHistoryItem }> {
    return this.request('/track', {
      method: 'POST',
      body: JSON.stringify({ searchTerm, selectedStock, searchType }),
    });
  }

  // Get user's search history
  async getUserSearchHistory(
    limit: number = 20, 
    page: number = 1
  ): Promise<{
    searchHistory: SearchHistoryItem[];
    pagination: {
      current: number;
      total: number;
      hasMore: boolean;
    };
  }> {
    return this.request(`/user?limit=${limit}&page=${page}`);
  }

  // Get recent searches (last 7 days)
  async getRecentSearches(): Promise<SearchHistoryItem[]> {
    return this.request('/recent');
  }

  // Get trending searches (global)
  async getTrendingSearches(
    period: '24h' | '7d' | '30d' = '7d', 
    limit: number = 10
  ): Promise<TrendingSearch[]> {
    return this.request(`/trending?period=${period}&limit=${limit}`);
  }

  // Get search analytics
  async getSearchAnalytics(
    period: '7d' | '30d' | '90d' = '30d'
  ): Promise<SearchAnalytics> {
    return this.request(`/analytics?period=${period}`);
  }

  // Clear user's search history
  async clearSearchHistory(): Promise<{ message: string }> {
    return this.request('/clear', { method: 'DELETE' });
  }
}

export const searchHistoryService = new SearchHistoryService();
export default searchHistoryService;
