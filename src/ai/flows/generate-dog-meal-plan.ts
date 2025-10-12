// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview A dog meal plan generator AI agent.
 *
 * - generateDogMealPlan - A function that handles the dog meal plan generation process.
 * - GenerateDogMealPlanInput - The input type for the generateDogMealPlan function.
 * - GenerateDogMealPlanOutput - The return type for the generateDogMealPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDogMealPlanInputSchema = z.object({
  dogWeight: z.number().describe('The weight of the dog in kilograms.'),
  dogAge: z.number().describe('The age of the dog in years.'),
  activityLevel: z
    .enum(['sedentary', 'moderate', 'active'])
    .describe('The activity level of the dog.'),
  ingredients: z
    .string()
    .describe('A comma separated list of ingredients that are safe for the dog.'),
});

export type GenerateDogMealPlanInput = z.infer<typeof GenerateDogMealPlanInputSchema>;

const GenerateDogMealPlanOutputSchema = z.object({
  mealPlan: z.string().describe('A balanced meal plan for the dog.'),
});

export type GenerateDogMealPlanOutput = z.infer<typeof GenerateDogMealPlanOutputSchema>;

export async function generateDogMealPlan(input: GenerateDogMealPlanInput): Promise<GenerateDogMealPlanOutput> {
  return generateDogMealPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDogMealPlanPrompt',
  input: {schema: GenerateDogMealPlanInputSchema},
  output: {schema: GenerateDogMealPlanOutputSchema},
  prompt: `You are an expert dog nutritionist.

You will generate a balanced meal plan for the dog based on the following information:

Dog weight: {{{dogWeight}}} kg
Dog age: {{{dogAge}}} years
Activity level: {{{activityLevel}}}
Ingredients: {{{ingredients}}}

The meal plan should include the ingredients provided and be balanced for the dog's weight, age, and activity level.
`,
});

const generateDogMealPlanFlow = ai.defineFlow(
  {
    name: 'generateDogMealPlanFlow',
    inputSchema: GenerateDogMealPlanInputSchema,
    outputSchema: GenerateDogMealPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
