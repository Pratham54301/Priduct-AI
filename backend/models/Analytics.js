import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  numUsers: { type: Number, default: 0 },
  predictionFrequency: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

export default mongoose.model('Analytics', analyticsSchema); 