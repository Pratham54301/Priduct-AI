'use server';

/**
 * @fileOverview A flow to generate personalized learning paths based on user's current knowledge and investment goals.
 *
 * - generateLearningPaths - A function that generates learning paths.
 * - LearningPathInput - The input type for the generateLearningPaths function.
 * - LearningPathOutput - The return type for the generateLearningPaths function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const LearningPathInputSchema = z.object({
  currentKnowledge: z
    .string()
    .describe('Description of the users current financial knowledge.'),
  investmentGoals: z.string().describe('Description of the users investment goals.'),
});
export type LearningPathInput = z.infer<typeof LearningPathInputSchema>;

const LearningPathOutputSchema = z.object({
  learningPaths: z
    .array(z.string())
    .describe('A list of personalized learning paths based on the users input.'),
});
export type LearningPathOutput = z.infer<typeof LearningPathOutputSchema>;

export async function generateLearningPaths(input: LearningPathInput): Promise<LearningPathOutput> {
  return generateLearningPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLearningPathsPrompt',
  input: {schema: LearningPathInputSchema},
  output: {schema: LearningPathOutputSchema},
  prompt: `You are an expert financial advisor. You will generate personalized learning paths based on the user's current knowledge and investment goals.

Current Knowledge: {{{currentKnowledge}}}
Investment Goals: {{{investmentGoals}}}

Learning Paths:
`,
});

const generateLearningPathsFlow = ai.defineFlow(
  {
    name: 'generateLearningPathsFlow',
    inputSchema: LearningPathInputSchema,
    outputSchema: LearningPathOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
