const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  result: { type: Object, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Prediction', predictionSchema); 