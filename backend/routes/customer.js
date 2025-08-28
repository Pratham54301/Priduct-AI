import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  changePassword, 
  getPredictions, 
  getOffers, 
  getNotifications, 
  markNotificationAsRead, 
  deleteNotification,
  addSavedStock,
  removeSavedStock
} from '../controllers/customerController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Profile management
router.get('/profile', getProfile);
router.patch('/update-profile', updateProfile);
router.patch('/change-password', changePassword);

// Predictions and stocks
router.get('/predictions', getPredictions);
router.post('/saved-stocks', addSavedStock);
router.delete('/saved-stocks/:symbol', removeSavedStock);

// Offers and subscriptions
router.get('/offers', getOffers);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/:notificationId/read', markNotificationAsRead);
router.delete('/notifications/:notificationId', deleteNotification);

export default router;
