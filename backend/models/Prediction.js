import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  exchange: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['ok', 'insufficient_data', 'stale_data'],
    required: true,
  },
  current_price: {
    type: Number,
    required: true,
  },
  entry_point: {
    type: Number,
  },
  sell_point: {
    type: Number,
  },
  target_1: {
    type: Number,
  },
  target_2: {
    type: Number,
  },
  stop_loss: {
    type: Number,
  },
  indicators_used: [
    {
      type: String,
    },
  ],
  prediction_accuracy: {
    type: Number,
    min: 0.70,
    max: 0.95,
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
  },
  rationale: {
    type: String,
  },
  market_sentiment: {
    type: String,
    enum: ['bullish', 'bearish', 'neutral', 'sideways', 'uptrend', 'downtrend'],
    default: 'neutral',
  },
  // Link to Customer if authenticated
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Make this optional if predictions can be anonymous
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction; 