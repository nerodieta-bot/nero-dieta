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
  mealPlan: z.string().describe("A balanced meal plan for a small breed dog, like a Chihuahua. The output should be formatted as a self-contained HTML string, not markdown. Use h3 for titles, ul/li for lists, and p for paragraphs. Example: '<h3>Breakfast</h3><p>Details...</p><ul><li>Ingredient 1</li></ul>'. The tone should be informative, but also friendly and encouraging, as if written by a dog nutrition expert who loves small dogs."),
});

export type GenerateDogMealPlanOutput = z.infer<typeof GenerateDogMealPlanOutputSchema>;

export async function generateDogMealPlan(input: GenerateDogMealPlanInput): Promise<GenerateDogMealPlanOutput> {
  return generateDogMealPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDogMealPlanPrompt',
  input: {schema: GenerateDogMealPlanInputSchema},
  output: {schema: GenerateDogMealPlanOutputSchema},
  prompt: `You are a world-class copywriter and an expert dog nutritionist who specializes in small breeds like Chihuahuas. Your writing is persuasive, clear, and engaging.

You will generate a balanced, daily meal plan for a small dog based on the following information. The plan should be perfectly suited for a small digestive system and metabolic rate. The output must be a valid HTML string.

**Dog's Profile:**
*   **Weight:** {{{dogWeight}}} kg
*   **Age:** {{{dogAge}}} years
*   **Activity Level:** {{{activityLevel}}}
*   **Available Ingredients:** {{{ingredients}}}

**Your Task:**
Create a meal plan that is structured, clear, and easy to follow. **Format the entire response as a single HTML string.**
- Use `<h3>` tags for each meal title (e.g., "<h3>🌞 Śniadanie Mistrza</h3>" or "<h3>🌜 Kolacja Wojownika</h3>").
- Use `<p>` tags for descriptive paragraphs. Ensure proper spacing between paragraphs.
- Use `<ul>` and `<li>` tags for bulleted lists of ingredients and their exact quantities in grams.
- Add a short, compelling introduction in a `<p>` tag that explains the benefits of this specific plan.
- Conclude with an encouraging and positive summary in a `<p>` tag.
- The tone should be professional yet caring and enthusiastic. Address the user directly ("Twój mały..."). Remember, you're creating a plan for a tiny, beloved companion! Make it sound both delicious and scientifically sound.
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
