import SearchHistory from '../models/SearchHistory.js';
import Prediction from '../models/Prediction.js';

// Track a new search
export const trackSearch = async (req, res) => {
  try {
    const { searchTerm, selectedStock, searchType = 'symbol' } = req.body;
    
    if (!searchTerm || !selectedStock) {
      return res.status(400).json({ message: 'Search term and selected stock are required' });
    }

    const searchHistory = new SearchHistory({
      user: req.user,
      searchTerm,
      selectedStock,
      searchType,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    await searchHistory.save();
    
    res.status(201).json({ 
      message: 'Search tracked successfully',
      searchHistory 
    });
  } catch (err) {
    console.error('Error tracking search:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's search history
export const getUserSearchHistory = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const searchHistory = await SearchHistory.find({ user: req.user })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await SearchHistory.countDocuments({ user: req.user });

    res.json({
      searchHistory,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasMore: skip + searchHistory.length < total
      }
    });
  } catch (err) {
    console.error('Error fetching search history:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get recent searches (last 7 days)
export const getRecentSearches = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSearches = await SearchHistory.find({
      user: req.user,
      timestamp: { $gte: sevenDaysAgo }
    })
    .sort({ timestamp: -1 })
    .limit(10);

    res.json(recentSearches);
  } catch (err) {
    console.error('Error fetching recent searches:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get trending searches (global)
export const getTrendingSearches = async (req, res) => {
  try {
    const { period = '7d', limit = 10 } = req.query;
    
    let dateFilter = {};
    switch (period) {
      case '24h':
        dateFilter = { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) };
        break;
      case '7d':
        dateFilter = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case '30d':
        dateFilter = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        break;
      default:
        dateFilter = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
    }

    const trendingSearches = await SearchHistory.aggregate([
      { $match: { timestamp: dateFilter } },
      { $group: { 
        _id: '$selectedStock.symbol', 
        count: { $sum: 1 },
        stockName: { $first: '$selectedStock.name' },
        stockSector: { $first: '$selectedStock.sector' },
        lastSearched: { $max: '$timestamp' }
      }},
      { $sort: { count: -1, lastSearched: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json(trendingSearches);
  } catch (err) {
    console.error('Error fetching trending searches:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get search analytics for user
export const getSearchAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter = {};
    switch (period) {
      case '7d':
        dateFilter = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case '30d':
        dateFilter = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        break;
      case '90d':
        dateFilter = { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) };
        break;
      default:
        dateFilter = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    }

    const analytics = await SearchHistory.aggregate([
      { $match: { user: req.user, timestamp: dateFilter } },
      { $group: { 
        _id: { 
          $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } 
        },
        searches: { $sum: 1 },
        uniqueStocks: { $addToSet: '$selectedStock.symbol' }
      }},
      { $addFields: { uniqueStockCount: { $size: '$uniqueStocks' } } },
      { $sort: { _id: 1 } }
    ]);

    const totalSearches = await SearchHistory.countDocuments({
      user: req.user,
      timestamp: dateFilter
    });

    const topSearchedStocks = await SearchHistory.aggregate([
      { $match: { user: req.user, timestamp: dateFilter } },
      { $group: { 
        _id: '$selectedStock.symbol', 
        count: { $sum: 1 },
        stockName: { $first: '$selectedStock.name' }
      }},
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      period,
      totalSearches,
      dailyAnalytics: analytics,
      topSearchedStocks
    });
  } catch (err) {
    console.error('Error fetching search analytics:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear user's search history
export const clearSearchHistory = async (req, res) => {
  try {
    await SearchHistory.deleteMany({ user: req.user });
    res.json({ message: 'Search history cleared successfully' });
  } catch (err) {
    console.error('Error clearing search history:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
