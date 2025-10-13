
// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview A dog food label analyzer AI agent.
 *
 * - analyzeLabel - A function that handles the label analysis process.
 * - AnalyzeLabelInput - The input type for the analyzeLabel function.
 * - AnalyzeLabelOutput - The return type for the analyzeLabel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeLabelInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a pet food ingredient list, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type AnalyzeLabelInput = z.infer<typeof AnalyzeLabelInputSchema>;

const IngredientAnalysisSchema = z.object({
  name: z.string().describe('The name of the ingredient.'),
  status: z.enum(['safe', 'warning', 'danger', 'unknown']).describe('The safety status for a dog.'),
  reason: z.string().describe('A brief, one-sentence explanation for the status, especially if it is "warning" or "danger".'),
});

const AnalyzeLabelOutputSchema = z.object({
  analysisHtml: z.string().describe("The full analysis formatted as a single, self-contained HTML string. The structure should include a summary and a list of ingredients. Use h3 for titles, ul/li for lists, and p for paragraphs. Use specific classes for styling: 'status-safe', 'status-warning', 'status-danger' for list items based on ingredient status."),
});

export type AnalyzeLabelOutput = z.infer<typeof AnalyzeLabelOutputSchema>;

export async function analyzeLabel(input: AnalyzeLabelInput): Promise<AnalyzeLabelOutput> {
  return analyzeLabelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeLabelPrompt',
  input: {schema: AnalyzeLabelInputSchema},
  output: {schema: AnalyzeLabelOutputSchema},
  prompt: `You are an expert dog nutritionist. Your task is to analyze the provided image of a pet food ingredient list and provide a detailed safety analysis for a dog.

**Image of the ingredient list:**
{{media url=photoDataUri}}

**Your Task:**
1.  **Extract Ingredients:** Carefully extract all ingredients from the image.
2.  **Analyze Each Ingredient:** For each ingredient, determine its safety status for a dog:
    *   **safe:** Generally considered safe and beneficial.
    *   **warning:** Safe in moderation, but can cause issues in large amounts, or is a common allergen.
    *   **danger:** Toxic or harmful to dogs.
    *   **unknown:** You cannot determine the status.
3.  **Provide a Brief Reason:** For any ingredient marked as 'warning' or 'danger', provide a concise, one-sentence explanation for the classification.
4.  **Generate an HTML Report:** Format the entire output as a single, self-contained HTML string.
    *   Start with a summary paragraph explaining the overall quality of the ingredient list.
    *   Use an \`<h3>\` for the title "Analiza Składników".
    *   Create a \`<ul>\` list for the ingredients.
    *   Each ingredient should be an \`<li>\` item.
    *   Assign a class to each \`<li>\` based on its status: \`class="status-safe"\`, \`class="status-warning"\`, \`class="status-danger"\`, or \`class="status-unknown"\`.
    *   Inside the \`<li>\`, display the ingredient name as a \`<strong>\` tag, followed by a dash and the reason (if any). Example: \`<li class="status-danger"><strong>Cebula</strong> – Toksyczna dla psów, może prowadzić do anemii.</li>\`
    *   The tone should be professional, clear, and helpful.`,
});

const analyzeLabelFlow = ai.defineFlow(
  {
    name: 'analyzeLabelFlow',
    inputSchema: AnalyzeLabelInputSchema,
    outputSchema: AnalyzeLabelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
