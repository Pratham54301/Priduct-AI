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
    prompt: `You are a financial AI that generates plausible-looking predictions for stock or crypto tickers.

For the given ticker: "{{{ticker}}}"

Generate the following prediction data:
- \`currentPrice\`: A realistic current price with a currency symbol.
- \`entryPoint\`: A realistic entry price with a currency symbol.
- \`sellPoint\`: A realistic sell price with a currency symbol.
- \`indicatorUsed\`: A common technical indicator (e.g., "RSI (Oversold)", "MACD Crossover").
- \`reason\`: A concise, 1-2 sentence explanation for the prediction based on the technical indicator.

Example for ticker "BTC":
{
  "currentPrice": "$64,221.50",
  "entryPoint": "$63,800.00",
  "sellPoint": "$66,000.00",
  "indicatorUsed": "RSI (Oversold) + EMA Crossover",
  "reason": "The RSI is in oversold territory, suggesting a potential price reversal. A bullish EMA crossover further supports an upward trend."
}

Generate the JSON response for: {{{ticker}}}.`,
  });

  const { output } = await predictionPrompt(input);

  if (!output) {
    throw new Error("The AI failed to generate a valid prediction.");
  }

  return output;
}
