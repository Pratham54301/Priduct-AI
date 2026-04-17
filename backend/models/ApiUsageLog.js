import mongoose from 'mongoose';

const apiUsageLogSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ['gemini', 'system'],
      default: 'gemini',
      index: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'error'],
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    meta: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model('ApiUsageLog', apiUsageLogSchema);
