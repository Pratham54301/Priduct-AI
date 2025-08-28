import express from 'express';
import auth from '../middleware/auth.js';
import { getHistory } from '../controllers/historyController.js';

const router = express.Router();

router.get('/', auth, getHistory);

export default router; 