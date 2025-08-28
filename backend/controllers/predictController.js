import Prediction from '../models/Prediction.js';

// Dummy AI logic for prediction
function generatePrediction(ticker) {
  // For now, use random values
  return {
    currentPrice: (Math.random() * 1000).toFixed(2),
    entryPoint: (Math.random() * 1000).toFixed(2),
    sellPoint: (Math.random() * 1000).toFixed(2),
    target1: (Math.random() * 1000).toFixed(2),
    target2: (Math.random() * 1000).toFixed(2),
    indicator: 'Dummy Indicator',
  };
}

export const predict = async (req, res) => {
  const { ticker } = req.body;
  if (!ticker || typeof ticker !== 'string') {
    return res.status(400).json({ message: 'Ticker symbol is required' });
  }
  const result = generatePrediction(ticker);
  try {
    const prediction = new Prediction({
      ticker,
      result,
      user: req.user,
    });
    await prediction.save();
    res.json({ ticker, ...result });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 