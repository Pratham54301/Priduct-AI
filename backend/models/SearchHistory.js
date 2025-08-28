import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  searchTerm: { 
    type: String, 
    required: true 
  },
  selectedStock: {
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    sector: { type: String },
    exchange: { type: String }
  },
  searchType: { 
    type: String, 
    enum: ['symbol', 'name', 'sector'], 
    default: 'symbol' 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  ipAddress: { 
    type: String 
  },
  userAgent: { 
    type: String 
  }
}, {
  timestamps: true
});

// Index for efficient queries
searchHistorySchema.index({ user: 1, timestamp: -1 });
searchHistorySchema.index({ searchTerm: 1 });
searchHistorySchema.index({ 'selectedStock.symbol': 1 });
searchHistorySchema.index({ timestamp: -1 });

export default mongoose.model('SearchHistory', searchHistorySchema);
