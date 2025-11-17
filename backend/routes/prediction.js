import express from 'express';
import { generatePrediction, getLivePriceAndIndicators } from '../controllers/predictionController.js';
import auth from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

const router = express.Router();

// Rate limiting for prediction generation
const predictionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 prediction requests per windowMs
  message: 'Too many prediction requests from this IP, please try again after 15 minutes',
});

// Apply security middleware (Helmet for various HTTP headers, CORS for cross-origin requests)
router.use(helmet());
router.use(cors());

// Public route for live price and indicators (can be accessed without authentication)
router.get('/price', getLivePriceAndIndicators);

// Protected route for generating predictions (requires authentication and rate limiting)
router.post('/predictions', auth, predictionLimiter, generatePrediction);

export default router;
