import express from 'express';
import auth from '../middleware/auth.js';
import { predict } from '../controllers/predictController.js';

const router = express.Router();

router.post('/', auth, predict);

export default router; 