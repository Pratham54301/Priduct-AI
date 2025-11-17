import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'Male', 'Female', 'Other', 'Prefer not to say'],
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
  
  // Sync fullName with name for backward compatibility
  if (this.fullName && !this.name) {
    this.name = this.fullName;
  } else if (this.name && !this.fullName) {
    this.fullName = this.name;
  }
  
  // Sync phoneNumber with phone for backward compatibility
  if (this.phoneNumber && !this.phone) {
    this.phone = this.phoneNumber;
  } else if (this.phone && !this.phoneNumber) {
    this.phoneNumber = this.phone;
  }
  
  next();
});

export default mongoose.model('User', userSchema); 