'use server';

/**
 * @fileOverview Generates investment ideas based on user risk profile and interests.
 *
 * - generateInvestmentIdeas - A function that generates investment ideas.
 * - InvestmentIdeaInput - The input type for the generateInvestmentIdeas function.
 * - InvestmentIdeaOutput - The return type for the generateInvestmentIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const InvestmentIdeaInputSchema = z.object({
  riskProfile: z
    .string()
    .describe(
      'The risk profile of the user, e.g., conservative, moderate, aggressive.'
    ),
  interests: z
    .string()
    .describe('The investment interests of the user, e.g., tech, healthcare, energy.'),
  marketConditions: z
    .string()
    .optional()
    .describe('The current market conditions to consider.'),
});
export type InvestmentIdeaInput = z.infer<typeof InvestmentIdeaInputSchema>;

const InvestmentIdeaOutputSchema = z.object({
  ideas: z.array(
    z.object({
      asset: z.string().describe('The asset to invest in, e.g., stock ticker, crypto.'),
      description: z.string().describe('A brief description of the investment idea.'),
      rationale: z
        .string()
        .describe('The rationale behind the investment idea.'),
      riskConsiderations: z
        .string()
        .describe('The risk considerations for the investment idea.'),
    })
  ),
});
export type InvestmentIdeaOutput = z.infer<typeof InvestmentIdeaOutputSchema>;

export async function generateInvestmentIdeas(
  input: InvestmentIdeaInput
): Promise<InvestmentIdeaOutput> {
  return generateInvestmentIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInvestmentIdeasPrompt',
  input: {schema: InvestmentIdeaInputSchema},
  output: {schema: InvestmentIdeaOutputSchema},
  prompt: `You are an AI investment advisor. Generate investment ideas based on the user's risk profile, interests, and current market conditions.

Risk Profile: {{{riskProfile}}}
Interests: {{{interests}}}
Market Conditions: {{{marketConditions}}}

Provide a list of investment ideas, including the asset, description, rationale, and risk considerations for each idea.`,
});

const generateInvestmentIdeasFlow = ai.defineFlow(
  {
    name: 'generateInvestmentIdeasFlow',
    inputSchema: InvestmentIdeaInputSchema,
    outputSchema: InvestmentIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
