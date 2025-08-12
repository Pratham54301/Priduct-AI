import { z } from 'genkit';

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