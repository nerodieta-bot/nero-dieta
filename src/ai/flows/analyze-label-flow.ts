
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
  prompt: `Jesteś ekspertem w dziedzinie żywienia psów. Twoim zadaniem jest przeanalizowanie dostarczonego obrazu etykiety z listą składników karmy dla zwierząt i przedstawienie szczegółowej analizy bezpieczeństwa dla psa.

**CAŁA ODPOWIEDŹ MUSI BYĆ W JĘZYKU POLSKIM.**

**Obraz listy składników:**
{{media url=photoDataUri}}

**Twoje zadanie:**
1.  **Wyodrębnij składniki:** Dokładnie wyodrębnij wszystkie składniki z obrazu.
2.  **Przeanalizuj każdy składnik:** Dla każdego składnika określ jego status bezpieczeństwa dla psa:
    *   **safe:** Ogólnie uważany za bezpieczny i korzystny.
    *   **warning:** Bezpieczny w umiarkowanych ilościach, ale może powodować problemy w dużych ilościach lub jest częstym alergenem.
    *   **danger:** Toksyczny lub szkodliwy dla psów.
    *   **unknown:** Nie można określić statusu.
3.  **Podaj krótkie uzasadnienie:** Dla każdego składnika oznaczonego jako 'warning' lub 'danger' podaj zwięzłe, jednozdaniowe wyjaśnienie klasyfikacji.
4.  **Wygeneruj raport HTML:** Sformatuj całą odpowiedź jako pojedynczy, samodzielny ciąg znaków HTML.
    *   Zacznij od akapitu podsumowującego, wyjaśniającego ogólną jakość listy składników.
    *   Użyj tagu \`<h3>\` dla tytułu "Analiza Składników".
    *   Utwórz listę \`<ul>\` dla składników.
    *   Każdy składnik powinien być elementem \`<li>\`.
    *   Przypisz klasę do każdego \`<li>\` na podstawie jego statusu: \`class="status-safe"\`, \`class="status-warning"\`, \`class="status-danger"\` lub \`class="status-unknown"\`.
    *   Wewnątrz \`<li>\` wyświetl nazwę składnika w tagu \`<strong>\`, a następnie myślnik i uzasadnienie (jeśli istnieje). Przykład: \`<li class="status-danger"><strong>Cebula</strong> – Toksyczna dla psów, może prowadzić do anemii.</li>\`
    *   **Jeśli obraz jest nieczytelny, pusty lub nie przedstawia listy składników**, Twoja odpowiedź HTML powinna zawierać tylko podsumowanie informujące o tym problemie oraz jeden element listy o statusie "unknown" wyjaśniający, że nie można było odczytać składników. Przykład: \`<p>Niestety, dostarczony obraz jest nieczytelny. Proszę, prześlij wyraźne zdjęcie etykiety.</p><h3>Analiza Składników</h3><ul><li class="status-unknown"><strong>Brak możliwości odczytu składników</strong> – Obraz był nieczytelny.</li></ul>\`
    *   Ton powinien być profesjonalny, klarowny i pomocny.`,
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
