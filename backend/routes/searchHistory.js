import express from 'express';
import auth from '../middleware/auth.js';
import { 
  trackSearch, 
  getUserSearchHistory, 
  getRecentSearches, 
  getTrendingSearches, 
  getSearchAnalytics, 
  clearSearchHistory 
} from '../controllers/searchHistoryController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Track a new search
router.post('/track', trackSearch);

// Get user's search history
router.get('/user', getUserSearchHistory);

// Get recent searches (last 7 days)
router.get('/recent', getRecentSearches);

// Get trending searches (global)
router.get('/trending', getTrendingSearches);

// Get search analytics
router.get('/analytics', getSearchAnalytics);

// Clear user's search history
router.delete('/clear', clearSearchHistory);

export default router;
