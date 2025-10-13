'use server';
import { analyzeLabel } from '@/ai/flows/analyze-label-flow';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ScanLabelSchema = z.object({
  image: z
    .any()
    .refine((file) => file?.size > 0, "Proszę wybrać plik obrazu.")
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      `Maksymalny rozmiar pliku to 5MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Akceptowane formaty to .jpg, .jpeg, .png i .webp."
    ),
});


export type ScanFormState = {
  message: string;
  analysisHtml?: string;
  errors?: {
    image?: string[];
  };
}

export async function analyzeLabelAction(
  prevState: ScanFormState,
  formData: FormData
): Promise<ScanFormState> {
    const validatedFields = ScanLabelSchema.safeParse({
        image: formData.get('image'),
    });

    if (!validatedFields.success) {
        return {
          message: 'Popraw błędy w formularzu.',
          errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { image } = validatedFields.data;

    try {
        const imageBuffer = await image.arrayBuffer();
        const imageBase64 = Buffer.from(imageBuffer).toString('base64');
        const photoDataUri = `data:${image.type};base64,${imageBase64}`;

        const result = await analyzeLabel({ photoDataUri });

        return {
            message: 'Analiza zakończona pomyślnie!',
            analysisHtml: result.analysisHtml,
        };

    } catch (error) {
        console.error('Error analyzing label:', error);
        return {
            message: 'Wystąpił błąd podczas analizy obrazu. Spróbuj ponownie.',
        };
    }
}
