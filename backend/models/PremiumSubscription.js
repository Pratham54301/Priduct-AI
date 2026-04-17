import mongoose from 'mongoose';

const premiumSubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ['premium', 'lifetime'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active',
      required: true,
    },
    source: {
      type: String,
      enum: ['admin', 'stripe', 'razorpay', 'manual'],
      default: 'admin',
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentProvider: {
      type: String,
      enum: ['none', 'stripe', 'razorpay'],
      default: 'none',
    },
    startedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endsAt: {
      type: Date,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const PremiumSubscription = mongoose.model('PremiumSubscription', premiumSubscriptionSchema);

export default PremiumSubscription;
