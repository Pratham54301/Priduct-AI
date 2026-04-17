'use server';

import { ai } from '@/ai/genkit';
import {
  AssetPredictionInputSchema,
  AssetPredictionOutputSchema,
  AssetPredictionInput,
  AssetPredictionOutput
} from './asset-prediction-schemas';


export async function getAssetPrediction(input: AssetPredictionInput): Promise<AssetPredictionOutput> {
  const predictionPrompt = ai.definePrompt({
    name: 'getAssetPredictionPrompt',
    input: { schema: AssetPredictionInputSchema },
    output: { schema: AssetPredictionOutputSchema },
    prompt: `You are a financial AI that generates predictions for Indian stock market tickers (NSE/BSE).

For the given Indian stock ticker: "{{{ticker}}}"

Generate the following prediction data:
- \`currentPrice\`: A realistic current price in Indian Rupees (₹).
- \`entryPoint\`: A realistic entry price in Indian Rupees (₹).
- \`sellPoint\`: A realistic sell price in Indian Rupees (₹).
- \`indicatorUsed\`: A common technical indicator (e.g., "RSI (Oversold)", "MACD Crossover", "EMA Crossover").
- \`reason\`: A concise, 1-2 sentence explanation for the prediction based on the technical indicator and Indian market context.

Example for ticker "RELIANCE":
{
  "currentPrice": "₹2,908.45",
  "entryPoint": "₹2,890.00",
  "sellPoint": "₹3,050.00",
  "indicatorUsed": "RSI (Oversold) + EMA Crossover",
  "reason": "The RSI is in oversold territory, suggesting a potential price reversal. A bullish EMA crossover further supports an upward trend based on Indian market sentiment."
}

Generate the JSON response for Indian stock: {{{ticker}}}.`,
  });

  const { output } = await predictionPrompt(input);

  if (!output) {
    throw new Error("The AI failed to generate a valid prediction.");
  }

  return output;
}
