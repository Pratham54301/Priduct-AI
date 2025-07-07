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
  prompt: `You are a sophisticated financial analyst AI. Your task is to validate a ticker symbol and generate a plausible-looking stock or cryptocurrency prediction.

First, evaluate the given ticker: "{{ticker}}".

If the ticker is invalid, meaningless, or not a recognized stock/crypto symbol (e.g., "ASDF", "NOTASYMBOL"), you MUST set the "error" field to "Invalid ticker symbol. Please try a valid stock/crypto code." and all other fields to null.

If the ticker is valid, you MUST set the "error" field to null and generate the following prediction data:
- Current Price: A realistic current price for the asset.
- Predicted Entry Point: A realistic price to enter a trade.
- Predicted Sell Point: A realistic price to sell for a profit.
- Technical Indicator Used: Choose a common indicator like RSI (specify if overbought/oversold), MACD crossover, Bollinger Bands squeeze/breakout, or EMA crossover.
- Reason: A concise, one or two sentence explanation for the prediction, based on the chosen technical indicator. For example: "The RSI is showing oversold conditions, suggesting a potential bounce. The MACD is also about to cross over, indicating bullish momentum."

Example for a VALID ticker "BTC":
{
  "error": null,
  "currentPrice": "$64,221",
  "entryPoint": "$63,800",
  "sellPoint": "$66,000",
  "indicatorUsed": "RSI (Oversold) + EMA Crossover",
  "reason": "The RSI is currently in an oversold territory suggesting a potential short-term price reversal upwards. Combined with a bullish EMA crossover, there's a strong indication for an upward trend."
}

Example for an INVALID ticker "XYZABC":
{
  "error": "Invalid ticker symbol. Please try a valid stock/crypto code.",
  "currentPrice": null,
  "entryPoint": null,
  "sellPoint": null,
  "indicatorUsed": null,
  "reason": null
}

Generate a response for the ticker: {{{ticker}}}. Ensure all price fields are formatted with a currency symbol (e.g., $, ₹) if the ticker is valid.`,
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
