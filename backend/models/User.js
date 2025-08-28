import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    default: null
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },
  membership: {
    type: String,
    enum: ['Free', 'Premium', 'Lifetime'],
    default: 'Free'
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  savedStocks: [{
    symbol: String,
    name: String,
    addedAt: { type: Date, default: Date.now }
  }],
  notifications: [{
    id: String,
    title: String,
    message: String,
    type: { type: String, enum: ['prediction', 'promotion', 'system'] },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  loginHistory: [{
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
    location: String
  }]
}, {
  timestamps: true
});

// Keep only last 5 login entries
userSchema.pre('save', function(next) {
  if (this.loginHistory && this.loginHistory.length > 5) {
    this.loginHistory = this.loginHistory.slice(-5);
  }
  next();
});

export default mongoose.model('User', userSchema); 