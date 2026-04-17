import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    singleton: {
      type: String,
      default: 'system',
      unique: true,
      index: true,
    },
    aiPrompt: {
      type: String,
      default:
        'You are a disciplined equity market analyst specializing in Indian stock markets (NSE/BSE). Output ONLY valid minified JSON conforming to the required schema.',
    },
    featureToggles: {
      aiPredictionsEnabled: { type: Boolean, default: true },
      premiumSystemEnabled: { type: Boolean, default: true },
      emailAlertsEnabled: { type: Boolean, default: true },
    },
    marketSentiment: {
      mode: { type: String, enum: ['auto', 'manual'], default: 'auto' },
      value: { type: String, enum: ['bullish', 'bearish', 'neutral'], default: 'neutral' },
      note: { type: String, default: '' },
      updatedAt: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    },
    paymentConfig: {
      stripeEnabled: { type: Boolean, default: false },
      razorpayEnabled: { type: Boolean, default: false },
      currency: { type: String, default: 'INR' },
      premiumMonthlyPrice: { type: Number, default: 999 },
      lifetimePrice: { type: Number, default: 9999 },
    },
    apiUsage: {
      totalPredictionRequests: { type: Number, default: 0 },
      geminiRequestCount: { type: Number, default: 0 },
      geminiErrorCount: { type: Number, default: 0 },
      lastErrorAt: { type: Date, default: null },
      lastErrorMessage: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
