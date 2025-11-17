'use server';

/**
 * @fileOverview Summarizes the day's most important market news to help users make informed investment decisions.
 *
 * - summarizeMarketNews - A function that returns a summary of market news.
 * - SummarizeMarketNewsInput - The input type for the summarizeMarketNews function.
 * - SummarizeMarketNewsOutput - The return type for the summarizeMarketNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SummarizeMarketNewsInputSchema = z.object({
  marketType: z
    .string()
    .describe(
      'The type of market to summarize news for (e.g., stocks, crypto, commodities, currency).'
    ),
});
export type SummarizeMarketNewsInput = z.infer<typeof SummarizeMarketNewsInputSchema>;

const SummarizeMarketNewsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the most important market news for the specified market type.'
    ),
  sentiment: z
    .string()
    .describe('The overall market sentiment (positive, negative, or neutral).'),
});
export type SummarizeMarketNewsOutput = z.infer<typeof SummarizeMarketNewsOutputSchema>;

export async function summarizeMarketNews(
  input: SummarizeMarketNewsInput
): Promise<SummarizeMarketNewsOutput> {
  return summarizeMarketNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMarketNewsPrompt',
  input: {schema: SummarizeMarketNewsInputSchema},
  output: {schema: SummarizeMarketNewsOutputSchema},
  prompt: `You are an AI assistant that summarizes market news for users.

  Summarize the most important news for the following market type:

  {{marketType}}

  In addition to the summary, also provide the overall market sentiment (positive, negative, or neutral).`,
});

const summarizeMarketNewsFlow = ai.defineFlow(
  {
    name: 'summarizeMarketNewsFlow',
    inputSchema: SummarizeMarketNewsInputSchema,
    outputSchema: SummarizeMarketNewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
