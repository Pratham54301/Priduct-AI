import Prediction from '../models/Prediction.js';
import User from '../models/User.js';
import Settings from '../models/Settings.js';
import ApiUsageLog from '../models/ApiUsageLog.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { calculateRSI, calculateMACD, calculateEMA, calculateATR, identifyTrend } from '../utils/indicators.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

let geminiClient = null;
const getGeminiModel = () => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return geminiClient.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });
};

const DAILY_FREE_LIMIT = 3;

const getSystemSettings = async () => {
  const settings = await Settings.findOneAndUpdate(
    { singleton: 'system' },
    { $setOnInsert: { singleton: 'system' } },
    { new: true, upsert: true }
  );
  return settings;
};

const logApiUsage = async ({ status, message = '', meta = {} }) => {
  try {
    await ApiUsageLog.create({
      provider: 'gemini',
      endpoint: '/api/predict',
      status,
      message,
      meta,
    });
  } catch (error) {
    console.error('[Predict] Failed to log API usage:', error?.message || error);
  }
};

const getDayWindow = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

const normalizeMembership = (membership) => {
  const value = String(membership || 'free').toLowerCase();
  if (value === 'premium' || value === 'lifetime') return value;
  return 'free';
};

const normalizeExchange = (exchange) => {
  const value = String(exchange || '').trim().toUpperCase();
  if (value !== 'NSE' && value !== 'BSE') {
    throw new Error(`Invalid exchange: ${exchange}. Only NSE and BSE are supported.`);
  }
  return value;
};

const formatSymbolForExchange = (symbol, exchange) => {
  const clean = String(symbol || '').trim().toUpperCase();
  if (clean.endsWith('.NS') || clean.endsWith('.BO')) return clean;
  return `${clean}${exchange === 'NSE' ? '.NS' : '.BO'}`;
};

const alternateExchange = (exchange) => (exchange === 'NSE' ? 'BSE' : 'NSE');

const getLastValidNumber = (arr) => {
  if (!Array.isArray(arr)) return null;
  for (let i = arr.length - 1; i >= 0; i -= 1) {
    const value = Number(arr[i]);
    if (!Number.isNaN(value) && value > 0) return value;
  }
  return null;
};

const isGeminiQuotaError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('429') || message.includes('quota') || message.includes('too many requests');
};

const parseRetryAfterSeconds = (error) => {
  const message = String(error?.message || '');
  const match = message.match(/retry in\s+(\d+)(?:\.\d+)?s/i) || message.match(/"retryDelay":"(\d+)s"/i);
  return match ? Number(match[1]) : null;
};

const buildFallbackPrediction = ({ symbol, exchange, status, marketData }) => {
  const current = Number(marketData.current_price || 0);
  const rsi = Number(marketData?.indicators?.rsi || 50);
  const trend = String(marketData?.indicators?.trend || 'sideways').toLowerCase();
  const atr = Number(marketData?.indicators?.atr || current * 0.02 || 1);

  let confidence = 62;
  if (trend === 'uptrend' || trend === 'bullish') confidence = 71;
  if (trend === 'downtrend' || trend === 'bearish') confidence = 56;
  if (rsi < 35 || rsi > 65) confidence += 4;
  confidence = Math.max(50, Math.min(78, confidence));

  const entry = Number((current * (rsi < 40 ? 0.995 : 0.99)).toFixed(2));
  const stop = Number((Math.max(entry - Math.max(atr * 0.8, current * 0.02), entry * 0.95)).toFixed(2));
  const target1 = Number((entry * (trend.includes('down') ? 1.02 : 1.04)).toFixed(2));
  const target2 = Number((entry * (trend.includes('down') ? 1.04 : 1.07)).toFixed(2));
  const sell = Number((entry * (trend.includes('down') ? 1.03 : 1.05)).toFixed(2));

  return {
    symbol,
    exchange,
    timestamp: new Date(),
    status,
    current_price: current,
    entry_point: entry,
    sell_point: sell,
    target_1: target1,
    target_2: target2,
    stop_loss: stop,
    indicators_used: ['RSI', 'MACD', 'EMA', 'ATR'],
    prediction_accuracy: 0.72,
    confidence,
    rationale: 'Fallback prediction generated from live market indicators because AI quota is currently exceeded. Please retry later for a Gemini-generated narrative.',
  };
};

/**
 * Fetch market data from Yahoo Finance chart API
 */
async function fetchRealMarketData(symbol, exchange) {
  const cleanSymbol = symbol.trim().toUpperCase();
  const cleanExchange = normalizeExchange(exchange);
  const formattedSymbol = formatSymbolForExchange(cleanSymbol, cleanExchange);
  const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(formattedSymbol)}?interval=1d&range=1mo`;
  const candlesUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(formattedSymbol)}?interval=5m&range=5d`;
  
  try {
    const quoteResponse = await fetch(quoteUrl, { headers: { Accept: 'application/json', 'User-Agent': 'ProductAI/1.0' } });
    const quotePayload = await quoteResponse.json();
    const quoteResult = quotePayload?.chart?.result?.[0];
    if (!quoteResponse.ok || !quoteResult) throw new Error(`No data available for ${cleanSymbol} on ${cleanExchange}`);

    const quote = quoteResult.indicators?.quote?.[0] || {};
    const meta = quoteResult.meta || {};

    const lastClose = getLastValidNumber(quote.close);
    const lastOpen = getLastValidNumber(quote.open);
    const lastHigh = getLastValidNumber(quote.high);
    const lastLow = getLastValidNumber(quote.low);
    const lastVolume = getLastValidNumber(quote.volume) || 0;

    const currentPrice = Number(
      meta.regularMarketPrice ??
      meta.currentTradingPeriod?.regular?.close ??
      meta.previousClose ??
      meta.regularMarketPreviousClose ??
      lastClose ??
      lastOpen ??
      0
    );
    const previousClose = Number(meta.previousClose ?? meta.regularMarketPreviousClose ?? lastClose ?? currentPrice);
    const open = Number(lastOpen ?? meta.previousClose ?? currentPrice);
    const high = Number(lastHigh ?? currentPrice);
    const low = Number(lastLow ?? currentPrice);
    const close = Number(lastClose ?? currentPrice);
    const volume = Number(lastVolume);
    const ts = quoteResult.timestamp?.[quoteResult.timestamp.length - 1];
    const timestamp = ts ? new Date(ts * 1000).toISOString() : new Date().toISOString();
    if (!currentPrice || Number.isNaN(currentPrice)) throw new Error(`No data available for ${cleanSymbol} on ${cleanExchange}`);

    const candleResponse = await fetch(candlesUrl, { headers: { Accept: 'application/json', 'User-Agent': 'ProductAI/1.0' } });
    const candlePayload = await candleResponse.json().catch(() => null);
    const candleResult = candlePayload?.chart?.result?.[0];

    let prices = [currentPrice];
    let highs = [high];
    let lows = [low];
    let closes = [close];
    if (candleResponse.ok && candleResult?.indicators?.quote?.[0]) {
      const q = candleResult.indicators.quote[0];
      const c = (q.close || []).map(Number).filter((v) => !Number.isNaN(v) && v > 0);
      const h = (q.high || []).map(Number).filter((v) => !Number.isNaN(v) && v > 0);
      const l = (q.low || []).map(Number).filter((v) => !Number.isNaN(v) && v > 0);
      prices = c.length ? c : prices;
      closes = c.length ? c : closes;
      highs = h.length ? h : highs;
      lows = l.length ? l : lows;
    }
    
    // Calculate technical indicators
    const indicators = {
      rsi: calculateRSI(prices) || 50,
      macd: calculateMACD(prices) || { macd_line: 0, macd_signal: 0, macd_hist: 0 },
      ema_fast: calculateEMA(prices, 12) || currentPrice,
      ema_slow: calculateEMA(prices, 26) || currentPrice,
      atr: calculateATR(highs, lows, closes) || (high - low),
      trend: identifyTrend(prices) || 'sideways',
    };
  
  return {
      current_price: currentPrice,
      open,
      high,
      low,
      close,
      volume,
      timestamp,
      prices,
      indicators,
      exchange: cleanExchange,
      formattedSymbol,
      previous_close: previousClose,
    };
  } catch (error) {
    console.error('[fetchRealMarketData] Error:', error?.message || error);
    throw new Error(`Market data is currently unavailable for ${cleanSymbol} on ${cleanExchange}.`);
  }
}

export const predict = async (req, res) => {
  try {
    const { symbol, exchange, timeframe } = req.body;
    
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
    
    const settings = await getSystemSettings();

    if (settings?.featureToggles?.aiPredictionsEnabled === false) {
      return res.status(503).json({
        success: false,
        code: 'AI_PREDICTIONS_DISABLED',
        message: 'AI predictions are temporarily disabled by admin.',
      });
    }

    const cleanExchange = normalizeExchange(exchange);
    if (cleanExchange !== 'NSE' && cleanExchange !== 'BSE') {
      return res.status(400).json({ 
        success: false,
        message: `Invalid exchange: ${exchange}. Only NSE (National Stock Exchange) and BSE (Bombay Stock Exchange) are supported for Indian stock market.` 
      });
    }
    
    const cleanSymbol = symbol.trim().toUpperCase();
    const timeFrame = timeframe || '1day';

    const user = await User.findById(req.user).select('membership');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const membership = normalizeMembership(user.membership);
    if (membership === 'free' && settings?.featureToggles?.premiumSystemEnabled !== false) {
      const { start, end } = getDayWindow();
      const todayCount = await Prediction.countDocuments({
        customer: req.user,
        createdAt: { $gte: start, $lt: end },
      });
      if (todayCount >= DAILY_FREE_LIMIT) {
        return res.status(429).json({
          success: false,
          code: 'PREDICTION_LIMIT_REACHED',
          message: 'Daily prediction limit reached for free plan.',
          remaining: 0,
          resetAt: end.toISOString(),
        });
      }
    }
    
    let marketData;
    let actualExchange = cleanExchange;
    
    try {
      marketData = await fetchRealMarketData(cleanSymbol, cleanExchange);
      actualExchange = marketData.exchange || cleanExchange;
    } catch (error) {
      if (cleanExchange === 'BSE' || cleanExchange === 'NSE') {
        const fallbackExchange = alternateExchange(cleanExchange);
        console.warn(`[Predict] ${cleanExchange} failed, trying ${fallbackExchange} fallback for ${cleanSymbol}...`);
        try {
          marketData = await fetchRealMarketData(cleanSymbol, fallbackExchange);
          actualExchange = fallbackExchange;
        } catch (fallbackError) {
          console.error(`[Predict] Both ${cleanExchange} and ${fallbackExchange} failed for ${cleanSymbol}:`, fallbackError.message);
          throw new Error(`Market data is unavailable for ${cleanSymbol} on both NSE and BSE right now. Please try again in a moment.`);
        }
      } else {
        throw error;
      }
    }
    
    // Check data freshness
    const dataTimestamp = new Date(marketData.timestamp);
    const now = new Date();
    const timeDiffSeconds = (now.getTime() - dataTimestamp.getTime()) / 1000;
    
    let status = 'ok';
    if (!cleanSymbol || !marketData.current_price) {
      status = 'insufficient_data';
    } else if (timeDiffSeconds > 180) {
      status = 'stale_data';
    }
    
    // Prepare data for Gemini
    const sentimentOverride = settings?.marketSentiment?.mode === 'manual'
      ? settings?.marketSentiment?.value
      : '';

    const userMessage = `Analyze this Indian stock (${cleanSymbol} on ${actualExchange}) using ONLY the provided data and produce JSON per schema.\n\n` +
      `Ticker: ${cleanSymbol}\n` +
      `Exchange: ${actualExchange}\n` +
      `Data timestamp ISO: ${marketData.timestamp}\n\n` +
      `Live price & OHLC:\n` +
      `- current_price: ${marketData.current_price}\n` +
      `- open: ${marketData.open}\n` +
      `- high: ${marketData.high}\n` +
      `- low: ${marketData.low}\n` +
      `- close: ${marketData.close}\n` +
      `- volume: ${marketData.volume}\n` +
      `- timeframe: ${timeFrame}\n\n` +
      `Technical Indicators:\n` +
      `- rsi: ${marketData.indicators.rsi}\n` +
      `- macd_line: ${marketData.indicators.macd?.macd_line || 0}\n` +
      `- macd_signal: ${marketData.indicators.macd?.macd_signal || 0}\n` +
      `- macd_hist: ${marketData.indicators.macd?.macd_hist || 0}\n` +
      `- ema_fast (12): ${marketData.indicators.ema_fast}\n` +
      `- ema_slow (26): ${marketData.indicators.ema_slow}\n` +
      `- atr: ${marketData.indicators.atr}\n` +
      `- trend: ${marketData.indicators.trend}\n\n` +
      `Rules:\n` +
      `- If timestamp older than 180s => status "stale_data".\n` +
      `- If symbol or current_price missing => "insufficient_data".\n` +
      `- Else status "ok" and compute entry/sell/targets/stop_loss sensibly.\n` +
      `- prediction_accuracy must be between 0.70 and 0.95.\n` +
      `- confidence must be between 0 and 100 (percentage).\n` +
      `- stop_loss should be 2-5% below entry_point for risk management.\n` +
      `- target_1 should be 3-7% above entry_point.\n` +
      `- target_2 should be 5-12% above entry_point.\n` +
      `- rationale should be 2-3 sentences explaining the prediction based on indicators.\n` +
      `${sentimentOverride ? `- Apply market sentiment override: ${sentimentOverride}.\n` : ''}` +
      `- Output ONLY the JSON object (minified). No extra text.`;
    
    const configuredPrompt = String(settings?.aiPrompt || '').trim();
    const systemPrompt = configuredPrompt || 'You are a disciplined equity market analyst specializing in Indian stock markets (NSE/BSE).';

    const systemMessage = `${systemPrompt}\n\nOutput ONLY valid minified JSON conforming exactly to the schema below. No prose or extra text.\n\n` +
      `Required JSON schema:\n` +
      `{\n` +
      `  "symbol": string,\n` +
      `  "exchange": string,\n` +
      `  "timestamp": string (ISO 8601),\n` +
      `  "status": "ok" | "insufficient_data" | "stale_data",\n` +
      `  "current_price": number,\n` +
      `  "entry_point": number,\n` +
      `  "sell_point": number,\n` +
      `  "target_1": number,\n` +
      `  "target_2": number,\n` +
      `  "stop_loss": number,\n` +
      `  "indicators_used": [string],\n` +
      `  "prediction_accuracy": number (0.70-0.95),\n` +
      `  "confidence": number (0-100),\n` +
      `  "rationale": string (2-3 sentences)\n` +
      `}`;
    
    let predictionOutput = {};
    let usedFallbackModel = false;
    try {
      await Settings.updateOne(
        { singleton: 'system' },
        {
          $inc: {
            'apiUsage.totalPredictionRequests': 1,
            'apiUsage.geminiRequestCount': 1,
          },
        }
      );
      const geminiModel = getGeminiModel();
      const result = await geminiModel.generateContent(`${systemMessage}\n\n${userMessage}`);
      const content = result?.response?.text?.() || '{}';
      predictionOutput = JSON.parse(content);
      await logApiUsage({
        status: 'success',
        meta: { symbol: cleanSymbol, exchange: actualExchange, userId: String(req.user || '') },
      });
    } catch (geminiError) {
      await Settings.updateOne(
        { singleton: 'system' },
        {
          $inc: {
            'apiUsage.totalPredictionRequests': 1,
            'apiUsage.geminiErrorCount': 1,
          },
          $set: {
            'apiUsage.lastErrorAt': new Date(),
            'apiUsage.lastErrorMessage': String(geminiError?.message || 'Unknown Gemini error').slice(0, 500),
          },
        }
      );
      await logApiUsage({
        status: 'error',
        message: String(geminiError?.message || 'Unknown Gemini error').slice(0, 500),
        meta: { symbol: cleanSymbol, exchange: actualExchange, userId: String(req.user || '') },
      });

      if (!isGeminiQuotaError(geminiError)) {
        throw geminiError;
      }
      usedFallbackModel = true;
      const retryAfterSeconds = parseRetryAfterSeconds(geminiError);
      predictionOutput = buildFallbackPrediction({
        symbol: cleanSymbol,
        exchange: actualExchange,
        status,
        marketData,
      });
      predictionOutput.rationale = `${predictionOutput.rationale}${retryAfterSeconds ? ` Suggested retry in ~${retryAfterSeconds}s.` : ''}`;
    }
    
    // Validate and fix prediction_accuracy range
    if (predictionOutput.prediction_accuracy < 0.70 || predictionOutput.prediction_accuracy > 0.95) {
      predictionOutput.prediction_accuracy = parseFloat((Math.random() * (0.95 - 0.70) + 0.70).toFixed(2));
    }
    
    // Ensure confidence is set (0-100)
    if (!predictionOutput.confidence || predictionOutput.confidence < 0 || predictionOutput.confidence > 100) {
      predictionOutput.confidence = Math.round(predictionOutput.prediction_accuracy * 100);
    }
    
    // Ensure stop_loss is set (2-5% below entry_point)
    if (!predictionOutput.stop_loss && predictionOutput.entry_point) {
      const stopLossPercent = 0.03; // 3% default
      predictionOutput.stop_loss = parseFloat((predictionOutput.entry_point * (1 - stopLossPercent)).toFixed(2));
    }
    
    // Ensure all required fields are present
    const predictionData = {
      symbol: cleanSymbol,
      exchange: actualExchange, // Use actual exchange (may be NSE if BSE failed)
      timestamp: new Date(),
      status: status,
      current_price: marketData.current_price,
      entry_point: predictionOutput.entry_point || marketData.current_price * 0.98,
      sell_point: predictionOutput.sell_point || marketData.current_price * 1.05,
      target_1: predictionOutput.target_1 || marketData.current_price * 1.05,
      target_2: predictionOutput.target_2 || marketData.current_price * 1.10,
      stop_loss: predictionOutput.stop_loss || (predictionOutput.entry_point ? predictionOutput.entry_point * 0.97 : marketData.current_price * 0.95),
      indicators_used: predictionOutput.indicators_used || ['RSI', 'MACD', 'EMA'],
      prediction_accuracy: predictionOutput.prediction_accuracy || 0.75,
      confidence: predictionOutput.confidence || Math.round(predictionOutput.prediction_accuracy * 100) || 75,
      rationale: predictionOutput.rationale || 'AI-generated prediction based on technical indicators and market analysis.',
      customer: req.user || null,
      market_sentiment: sentimentOverride || marketData.indicators.trend || 'neutral',
    };
    
    const prediction = new Prediction(predictionData);
    await prediction.save();
    
    // Convert Mongoose document to plain object
    const predictionObj = prediction.toObject();
    
    return res.status(200).json({
      success: true,
      message: usedFallbackModel
        ? 'Prediction generated using fallback model because Gemini quota is temporarily exceeded.'
        : 'Prediction generated successfully',
      code: usedFallbackModel ? 'AI_QUOTA_FALLBACK_USED' : undefined,
      data: predictionObj,
      prediction: predictionObj // Also include as 'prediction' for frontend compatibility
    });
  } catch (err) {
    console.error('[Predict] Error:', err);
    
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