import express from 'express';
import auth from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roles.js';
import {
  getUsers,
  getUserById,
  getPredictionLogs,
  updateUserMembership,
  updateUser,
  deleteUser,
  deletePrediction,
  getPremiumAnalytics,
  getDashboardAnalytics,
  getSubscriptions,
  upsertSubscription,
  getSystemSettingsController,
  updateSystemSettings,
  getApiUsageMetrics,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(auth, requireAdmin);

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.get('/predictions', getPredictionLogs);
router.delete('/predictions/:id', deletePrediction);
router.get('/premium', getPremiumAnalytics);
router.get('/analytics', getDashboardAnalytics);
router.get('/subscriptions', getSubscriptions);
router.post('/subscriptions', upsertSubscription);
router.get('/settings', getSystemSettingsController);
router.put('/settings', updateSystemSettings);
router.get('/api-usage', getApiUsageMetrics);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/membership', updateUserMembership);

export default router;
