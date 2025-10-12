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
  dogWeight: z.number().describe('The weight of the dog in kilograms. It is a small breed dog.'),
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
  mealPlan: z.string().describe('A balanced meal plan for a small breed dog, like a Chihuahua. The output should be formatted as markdown, with headings for each meal of the day, and bullet points for ingredients and their quantities in grams. The tone should be informative, but also friendly and encouraging, as if written by a dog nutrition expert who loves small dogs.'),
});

export type GenerateDogMealPlanOutput = z.infer<typeof GenerateDogMealPlanOutputSchema>;

export async function generateDogMealPlan(input: GenerateDogMealPlanInput): Promise<GenerateDogMealPlanOutput> {
  return generateDogMealPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDogMealPlanPrompt',
  input: {schema: GenerateDogMealPlanInputSchema},
  output: {schema: GenerateDogMealPlanOutputSchema},
  prompt: `You are an expert dog nutritionist specializing in small breeds like Chihuahuas.

You will generate a balanced, daily meal plan for a small dog based on the following information. The plan should be perfectly suited for a small digestive system and metabolic rate.

Dog weight: {{{dogWeight}}} kg
Dog age: {{{dogAge}}} years
Activity level: {{{activityLevel}}}
Available ingredients: {{{ingredients}}}

The meal plan should be structured, clear, and easy to follow. Use markdown for formatting. Include specific portion sizes in grams. Make it sound professional, yet caring and enthusiastic. Address the user directly. Remember, you are creating a plan for a tiny, beloved companion!
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
