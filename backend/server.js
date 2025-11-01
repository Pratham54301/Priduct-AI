import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Routes
import authRoutes from './routes/auth.js';
import predictRoutes from './routes/predict.js';
import historyRoutes from './routes/history.js';
import searchHistoryRoutes from './routes/searchHistory.js';
import customerRoutes from './routes/customer.js';
import predictionRoutes from './routes/prediction.js';

app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/search-history', searchHistoryRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api', predictionRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import and start scheduled jobs
import './jobs/dailyReport.js';

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 