'use server';

/**
 * @fileOverview Explains the reasoning behind AI market predictions.
 *
 * - explainMarketTrends - A function that takes market data and a prediction
 *   and returns an explanation of the AI's reasoning.
 * - ExplainMarketTrendsInput - The input type for the explainMarketTrends
 *   function.
 * - ExplainMarketTrendsOutput - The return type for the explainMarketTrends
 *   function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ExplainMarketTrendsInputSchema = z.object({
  marketData: z
    .string()
    .describe('Real-time market data, including indices, stocks, crypto, commodities, and currencies.'),
  prediction: z.string().describe('The AI market prediction.'),
});
export type ExplainMarketTrendsInput = z.infer<typeof ExplainMarketTrendsInputSchema>;

const ExplainMarketTrendsOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A detailed explanation of the AI reasoning behind the market prediction.'),
});
export type ExplainMarketTrendsOutput = z.infer<typeof ExplainMarketTrendsOutputSchema>;

export async function explainMarketTrends(input: ExplainMarketTrendsInput): Promise<ExplainMarketTrendsOutput> {
  return explainMarketTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainMarketTrendsPrompt',
  input: {schema: ExplainMarketTrendsInputSchema},
  output: {schema: ExplainMarketTrendsOutputSchema},
  prompt: `You are an AI financial analyst. Explain the reasoning behind the following market prediction, based on the provided real-time market data.

Market Data: {{{marketData}}}
Prediction: {{{prediction}}}

Explanation:`,
});

const explainMarketTrendsFlow = ai.defineFlow(
  {
    name: 'explainMarketTrendsFlow',
    inputSchema: ExplainMarketTrendsInputSchema,
    outputSchema: ExplainMarketTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
