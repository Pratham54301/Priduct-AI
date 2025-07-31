const Prediction = require('../models/Prediction');

exports.getHistory = async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 