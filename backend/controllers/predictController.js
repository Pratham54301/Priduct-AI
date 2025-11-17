import Prediction from '../models/Prediction.js';

// Dummy AI logic for prediction
function generateDummyPrediction(symbol, exchange) {
  // For now, use random values
  const currentPrice = parseFloat((Math.random() * 1000).toFixed(2));
  const entryPoint = parseFloat((currentPrice * 0.98).toFixed(2));
  const sellPoint = parseFloat((currentPrice * 1.02).toFixed(2));
  const target1 = parseFloat((currentPrice * 1.05).toFixed(2));
  const target2 = parseFloat((currentPrice * 1.10).toFixed(2));
  const accuracy = parseFloat((Math.random() * 0.10 + 0.70).toFixed(2));
  
  return {
    symbol,
    exchange,
    current_price: currentPrice,
    entry_point: entryPoint,
    sell_point: sellPoint,
    target_1: target1,
    target_2: target2,
    indicators_used: ['RSI', 'MACD', 'EMA'],
    prediction_accuracy: accuracy,
    status: 'ok',
    rationale: 'Generated using dummy prediction algorithm'
  };
}

export const predict = async (req, res) => {
  try {
    const { symbol, exchange } = req.body;
    
    if (!symbol || typeof symbol !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: 'Symbol is required' 
      });
    }
    
    if (!exchange || typeof exchange !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: 'Exchange is required' 
      });
    }
    
    const result = generateDummyPrediction(symbol.toUpperCase(), exchange.toUpperCase());
    
    // Add required timestamp field
    const predictionData = {
      ...result,
      timestamp: new Date(),
      customer: req.user || null,
    };
    
    const prediction = new Prediction(predictionData);
    await prediction.save();
    
    // Convert Mongoose document to plain object
    const predictionObj = prediction.toObject();
    
    return res.status(200).json({
      success: true,
      message: 'Prediction generated successfully',
      prediction: predictionObj
    });
  } catch (err) {
    console.error('Prediction error:', err);
    
    // Provide more specific error messages
    let errorMessage = 'Server error';
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message).join(', ');
      errorMessage = `Validation error: ${validationErrors}`;
    } else if (err.code === 11000) {
      errorMessage = 'A prediction for this symbol already exists';
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    return res.status(500).json({ 
      success: false,
      message: errorMessage 
    });
  }
}; 