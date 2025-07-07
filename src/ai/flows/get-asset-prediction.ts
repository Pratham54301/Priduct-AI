
'use server';

/**
 * @fileOverview Generates a financial prediction for a given stock or crypto ticker.
 *
 * - getAssetPrediction - A function that returns a detailed prediction for an asset.
 * - AssetPredictionInput - The input type for the getAssetPrediction function.
 * - AssetPredictionOutput - The return type for the getAssetPrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AssetPredictionInputSchema = z.object({
  ticker: z.string().describe('The stock or cryptocurrency ticker symbol (e.g., TSLA, BTC).'),
});
export type AssetPredictionInput = z.infer<typeof AssetPredictionInputSchema>;

export const AssetPredictionOutputSchema = z.object({
    currentPrice: z.string().describe("The current market price of the asset, formatted with a currency symbol."),
    entryPoint: z.string().describe("The predicted entry price point for a trade, formatted with a currency symbol."),
    sellPoint: z.string().describe("The predicted sell price point to take profit, formatted with a currency symbol."),
    indicatorUsed: z.string().describe("The primary technical indicator used for the prediction."),
    reason: z.string().describe("A concise explanation for the prediction based on the technical indicator."),
});
export type AssetPredictionOutput = z.infer<typeof AssetPredictionOutputSchema>;

export async function getAssetPrediction(input: AssetPredictionInput): Promise<AssetPredictionOutput> {
  return getAssetPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getAssetPredictionPrompt',
  input: {schema: AssetPredictionInputSchema},
  output: {schema: AssetPredictionOutputSchema},
  prompt: `You are a financial AI that generates plausible-looking predictions for stock or crypto tickers.

For the given ticker: "{{{ticker}}}"

Generate the following prediction data:
- \`currentPrice\`: A realistic current price with a currency symbol.
- \`entryPoint\`: A realistic entry price with a currency symbol.
- \`sellPoint\`: A realistic sell price with a currency symbol.
- \`indicatorUsed\`: A common technical indicator (e.g., "RSI (Oversold)", "MACD Crossover").
- \`reason\`: A concise, 1-2 sentence explanation for the prediction.

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

const getAssetPredictionFlow = ai.defineFlow(
  {
    name: 'getAssetPredictionFlow',
    inputSchema: AssetPredictionInputSchema,
    outputSchema: AssetPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI failed to generate a valid prediction.");
    }
    return output;
  }
);
