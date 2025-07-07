
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
    currentPrice: z.string().nullable().describe("The current market price of the asset, formatted with currency symbol. Null if ticker is invalid."),
    entryPoint: z.string().nullable().describe("The predicted entry price point for a trade, formatted with currency symbol. Null if ticker is invalid."),
    sellPoint: z.string().nullable().describe("The predicted sell price point to take profit, formatted with currency symbol. Null if ticker is invalid."),
    indicatorUsed: z.string().nullable().describe("The primary technical indicator used for the prediction. Null if ticker is invalid."),
    reason: z.string().nullable().describe("A concise explanation for the prediction based on the technical indicator. Null if ticker is invalid."),
    error: z.string().nullable().describe("Error message if the ticker is invalid (e.g., 'Invalid ticker symbol. Please try a valid stock/crypto code.'). Null if the ticker is valid."),
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

Your primary task is to generate prediction data.
- \`currentPrice\`: A realistic current price. Must be a string with a currency symbol (e.g., "$", "₹").
- \`entryPoint\`: A realistic price to enter a trade. Must be a string with a currency symbol.
- \`sellPoint\`: A realistic price to sell for profit. Must be a string with a currency symbol.
- \`indicatorUsed\`: A common technical indicator used (e.g., "RSI (Oversold)", "MACD Crossover").
- \`reason\`: A concise, 1-2 sentence explanation for the prediction based on the indicator.
- \`error\`: Set this to \`null\`.

If and only if the ticker is completely nonsensical and you cannot generate a plausible prediction (e.g., for "ASDFG"):
- Set the \`error\` field to "Invalid ticker symbol. Please try a valid stock/crypto code.".
- Set all other fields to \`null\`.

Example for "BTC":
{
  "error": null,
  "currentPrice": "$64,221",
  "entryPoint": "$63,800",
  "sellPoint": "$66,000",
  "indicatorUsed": "RSI (Oversold) + EMA Crossover",
  "reason": "The RSI is in oversold territory, suggesting a potential price reversal. A bullish EMA crossover further supports an upward trend."
}

Example for "NOTASYMBOL":
{
  "error": "Invalid ticker symbol. Please try a valid stock/crypto code.",
  "currentPrice": null,
  "entryPoint": null,
  "sellPoint": null,
  "indicatorUsed": null,
  "reason": null
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
    return output!;
  }
);
