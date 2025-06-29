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
    currentPrice: z.string().describe("The current market price of the asset, formatted with currency symbol."),
    entryPoint: z.string().describe("The predicted entry price point for a trade, formatted with currency symbol."),
    sellPoint: z.string().describe("The predicted sell price point to take profit, formatted with currency symbol."),
    target1: z.string().describe("A short-term price target for the asset, formatted with currency symbol."),
    target2: z.string().describe("A mid-term price target for the asset, formatted with currency symbol."),
    indicatorUsed: z.string().describe("The primary technical indicator used for the prediction (e.g., RSI, MACD, Bollinger Bands, EMA crossover)."),
    accuracy: z.string().describe("An estimated prediction accuracy percentage (e.g., '76.3%'). Should be between 70% and 80%."),
});
export type AssetPredictionOutput = z.infer<typeof AssetPredictionOutputSchema>;

export async function getAssetPrediction(input: AssetPredictionInput): Promise<AssetPredictionOutput> {
  return getAssetPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getAssetPredictionPrompt',
  input: {schema: AssetPredictionInputSchema},
  output: {schema: AssetPredictionOutputSchema},
  prompt: `You are a sophisticated financial analyst AI. Your task is to generate a plausible-looking stock or cryptocurrency prediction based on common technical analysis indicators. The user will provide a ticker symbol.

Given the ticker "{{ticker}}", generate the following prediction data:
- Current Price: A realistic current price for the asset.
- Predicted Entry Point: A realistic price to enter a trade.
- Predicted Sell Point: A realistic price to sell for a profit.
- Target 01: A short-term price target.
- Target 02: A mid-term price target.
- Technical Indicator Used: Choose a common indicator like RSI (specify if overbought/oversold), MACD crossover, Bollinger Bands squeeze/breakout, or EMA crossover.
- Prediction Accuracy: Generate a believable accuracy percentage between 70.0% and 80.0%.

Example Output for "BTC":
Current Price: $64,221
Entry: $63,800
Sell: $66,000
Target 01: $66,500
Target 02: $67,800
Indicator Used: RSI (Oversold) + EMA Crossover
Prediction Accuracy: 76.3%

Generate a prediction for the ticker: {{{ticker}}}. Ensure all price fields are formatted with a currency symbol (e.g., $, ₹).`,
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
