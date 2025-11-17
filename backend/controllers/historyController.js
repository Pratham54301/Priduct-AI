import Prediction from '../models/Prediction.js';

export const getHistory = async (req, res) => {
  try {
    const predictions = await Prediction.find({ customer: req.user }).sort({ createdAt: -1 });
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 