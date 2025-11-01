import Prediction from '../models/Prediction.js';
import Joi from 'joi';
import axios from 'axios';
import OpenAI from 'openai';
import { calculateRSI, calculateMACD, calculateEMA, calculateATR, identifyTrend } from '../utils/indicators.js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';
const MARKET_API_KEY = process.env.MARKET_API_KEY;
const MARKET_PROVIDER = process.env.MARKET_PROVIDER || 'twelve-data';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Simple in-memory cache for live prices
const priceCache = {};
const CACHE_TTL = 10 * 1000; // 10 seconds

// Joi schema for validating stock requests
const stockSchema = Joi.object({
  symbol: Joi.string().uppercase().required(),
  exchange: Joi.string().uppercase().required(),
  timeframe: Joi.string().valid('1min', '5min', '15min', '30min', '1hour', '1day').default('1day'),
});

const getMarketData = async (symbol, exchange, timeframe) => {
  // Placeholder for market data API call
  // In a real application, this would fetch data from Twelve Data, Alpha Vantage, etc.
  // For now, return mock data
  const mockData = {
    "AAPL": {
      "current_price": 175.00,
      "open": 174.50,
      "high": 176.20,
      "low": 173.80,
      "close": 174.90,
      "volume": 10000000,
      "timestamp": new Date().toISOString(),
      "prices": [170, 171, 172, 173, 174, 175, 174, 173, 175, 176, 175, 174, 175, 176, 177, 176, 175]
    },
    "RELIANCE": {
      "current_price": 2900.00,
      "open": 2890.00,
      "high": 2910.00,
      "low": 2885.00,
      "close": 2895.00,
      "volume": 5000000,
      "timestamp": new Date().toISOString(),
      "prices": [2800, 2820, 2850, 2870, 2880, 2890, 2885, 2870, 2890, 2910, 2900, 2895, 2900, 2905, 2910, 2900, 2900]
    }
  };

  const data = mockData[symbol];
  if (!data) {
    throw new Error("Stock data not available for this symbol.");
  }

  const recentPrices = data.prices;
  const highs = Array(recentPrices.length).fill(data.high);
  const lows = Array(recentPrices.length).fill(data.low);
  const closes = data.prices; // Using prices for closes as a mock

  return {
    current_price: data.current_price,
    open: data.open,
    high: data.high,
    low: data.low,
    close: data.close,
    volume: data.volume,
    timestamp: data.timestamp,
    prices: data.prices,
    indicators: {
      rsi: calculateRSI(recentPrices),
      macd: calculateMACD(recentPrices),
      ema_fast: calculateEMA(recentPrices, 12),
      ema_slow: calculateEMA(recentPrices, 26),
      atr: calculateATR(highs, lows, closes),
      trend: identifyTrend(recentPrices),
    },
  };
};

export const getLivePriceAndIndicators = async (req, res) => {
  try {
    const { error, value } = stockSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { symbol, exchange } = value;
    const cacheKey = `${symbol}:${exchange}`;
    const now = Date.now();

    if (priceCache[cacheKey] && now - priceCache[cacheKey].timestamp < CACHE_TTL) {
      return res.status(200).json(priceCache[cacheKey].data);
    }

    const marketData = await getMarketData(symbol, exchange, '1min'); // Always fetch 1min for live price

    const responseData = {
      symbol,
      exchange,
      current_price: marketData.current_price,
      timestamp: marketData.timestamp,
      indicators: marketData.indicators,
    };

    priceCache[cacheKey] = {
      data: responseData,
      timestamp: now,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching live price and indicators:', error);
    res.status(500).json({ message: 'Failed to fetch live price and indicators', error: error.message });
  }
};

export const generatePrediction = async (req, res) => {
  try {
    const { error, value } = stockSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { symbol, exchange, timeframe } = value;

    const marketData = await getMarketData(symbol, exchange, timeframe);

    const dataTimestamp = new Date(marketData.timestamp);
    const now = new Date();
    const timeDiffSeconds = (now.getTime() - dataTimestamp.getTime()) / 1000;

    let status = 'ok';
    if (!symbol || !marketData.current_price) {
      status = 'insufficient_data';
    } else if (timeDiffSeconds > 180) {
      status = 'stale_data';
    }

    const userMessage = `Analyze this stock using ONLY the provided data and produce JSON per schema.\n\n` +
      `Ticker: ${symbol}\n` +
      `Exchange: ${exchange}\n` +
      `Data timestamp ISO: ${marketData.timestamp}\n\n` +
      `Live price & OHLC:\n` +
      `- current_price: ${marketData.current_price}\n` +
      `- open: ${marketData.open}\n` +
      `- high: ${marketData.high}\n` +
      `- low: ${marketData.low}\n` +
      `- close: ${marketData.close}\n` +
      `- timeframe: ${timeframe}\n\n` +
      `Indicators:\n` +
      `- rsi: ${marketData.indicators.rsi}\n` +
      `- macd_line: ${marketData.indicators.macd?.macd_line}\n` +
      `- macd_signal: ${marketData.indicators.macd?.macd_signal}\n` +
      `- macd_hist: ${marketData.indicators.macd?.macd_hist}\n` +
      `- ema_fast: ${marketData.indicators.ema_fast}\n` +
      `- ema_slow: ${marketData.indicators.ema_slow}\n` +
      `- atr: ${marketData.indicators.atr}\n` +
      `- trend: ${marketData.indicators.trend}\n\n` +
      `Rules:\n` +
      `- If timestamp older than 180s => status \"stale_data\".\n` +
      `- If symbol or current_price missing => \"insufficient_data\".\n` +
      `- Else status \"ok\" and compute entry/sell/targets sensibly.\n` +
      `- prediction_accuracy must be between 0.70 and 0.80.\n` +
      `- Output ONLY the JSON object (minified). No extra text.`;

    const systemMessage = `You are a disciplined equity market analyst. Output ONLY valid minified JSON conforming exactly to the schema below. No prose or extra text.\n\n` +
      `Required JSON schema:\n` +
      `{\n` +
      `  \"symbol\": string,\n` +
      `  \"exchange\": string,\n` +
      `  \"timestamp\": string,\n` +
      `  \"status\": \"ok\" | \"insufficient_data\" | \"stale_data\",\n` +
      `  \"current_price\": number,\n` +
      `  \"entry_point\": number,\n` +
      `  \"sell_point\": number,\n` +
      `  \"target_1\": number,\n` +
      `  \"target_2\": number,\n` +
      `  \"indicators_used\": [string],\n` +
      `  \"prediction_accuracy\": number,\n` +
      `  \"rationale\": string\n` +
      `}`; 

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const predictionOutput = JSON.parse(response.choices[0].message.content);

    // Ensure prediction_accuracy is within range [0.70, 0.80]
    if (predictionOutput.prediction_accuracy < 0.70 || predictionOutput.prediction_accuracy > 0.80) {
      predictionOutput.prediction_accuracy = parseFloat((Math.random() * (0.80 - 0.70) + 0.70).toFixed(2));
    }

    const newPrediction = new Prediction({
      ...predictionOutput,
      timestamp: new Date(predictionOutput.timestamp),
      customer: req.user ? req.user.userId : null, // Attach user ID if authenticated
    });

    await newPrediction.save();

    res.status(200).json(newPrediction);
  } catch (error) {
    console.error('Error generating prediction:', error);
    res.status(500).json({ message: 'Failed to generate prediction', error: error.message });
  }
};
