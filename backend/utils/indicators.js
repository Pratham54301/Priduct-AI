
export const calculateRSI = (prices, period = 14) => {
  if (prices.length < period + 1) return null;

  let gains = [];
  let losses = [];

  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) {
      gains.push(diff);
      losses.push(0);
    } else {
      gains.push(0);
      losses.push(Math.abs(diff));
    }
  }

  let avgGain = gains.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((sum, val) => sum + val, 0) / period;

  if (avgLoss === 0) return 100;

  let rs = avgGain / avgLoss;
  let rsi = 100 - (100 / (1 + rs));

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    if (avgLoss === 0) {
      rsi = 100;
    } else {
      rs = avgGain / avgLoss;
      rsi = 100 - (100 / (1 + rs));
    }
  }
  return parseFloat(rsi.toFixed(2));
};

export const calculateEMA = (prices, period) => {
  if (prices.length < period) return null;

  let ema = [];
  let sum = 0;

  // First EMA is simple moving average
  for (let i = 0; i < period; i++) {
    sum += prices[i];
  }
  ema.push(sum / period);

  const multiplier = 2 / (period + 1);

  // Subsequent EMAs
  for (let i = period; i < prices.length; i++) {
    ema.push((prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1]);
  }
  return parseFloat(ema[ema.length - 1].toFixed(2));
};

export const calculateMACD = (prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  if (prices.length < slowPeriod) return null;

  const calculateSingleEMA = (data, period) => {
    if (data.length < period) return null;
    let ema = [];
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += data[i];
    }
    ema.push(sum / period);
    const multiplier = 2 / (period + 1);
    for (let i = period; i < data.length; i++) {
      ema.push((data[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1]);
    }
    return ema;
  };

  const fastEMA = calculateSingleEMA(prices, fastPeriod);
  const slowEMA = calculateSingleEMA(prices, slowPeriod);

  if (!fastEMA || !slowEMA) return null;

  const macdLine = [];
  for (let i = 0; i < slowEMA.length; i++) {
    macdLine.push(fastEMA[fastEMA.length - slowEMA.length + i] - slowEMA[i]);
  }

  const signalLine = calculateSingleEMA(macdLine, signalPeriod);
  if (!signalLine) return null;

  const macdHist = [];
  for (let i = 0; i < signalLine.length; i++) {
    macdHist.push(macdLine[macdLine.length - signalLine.length + i] - signalLine[i]);
  }

  return {
    macd_line: parseFloat(macdLine[macdLine.length - 1].toFixed(2)),
    macd_signal: parseFloat(signalLine[signalLine.length - 1].toFixed(2)),
    macd_hist: parseFloat(macdHist[macdHist.length - 1].toFixed(2)),
  };
};

export const calculateATR = (highs, lows, closes, period = 14) => {
  if (highs.length < period || lows.length < period || closes.length < period) return null;

  const trueRanges = [];
  for (let i = 1; i < closes.length; i++) {
    const tr1 = highs[i] - lows[i];
    const tr2 = Math.abs(highs[i] - closes[i - 1]);
    const tr3 = Math.abs(lows[i] - closes[i - 1]);
    trueRanges.push(Math.max(tr1, tr2, tr3));
  }

  let atr = trueRanges.slice(0, period).reduce((sum, val) => sum + val, 0) / period;

  for (let i = period; i < trueRanges.length; i++) {
    atr = (atr * (period - 1) + trueRanges[i]) / period;
  }
  return parseFloat(atr.toFixed(2));
};

export const identifyTrend = (prices, period = 20) => {
  if (prices.length < period) return null;

  const lastPrice = prices[prices.length - 1];
  const avgPrice = prices.slice(prices.length - period).reduce((sum, val) => sum + val, 0) / period;

  if (lastPrice > avgPrice) {
    return "uptrend";
  } else if (lastPrice < avgPrice) {
    return "downtrend";
  } else {
    return "sideways";
  }
};
