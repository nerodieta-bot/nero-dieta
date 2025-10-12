'use server';

import { z } from 'zod';

const ContributionSchema = z.object({
  name: z.string().min(3, 'Nazwa musi mieć co najmniej 3 znaki.'),
  status: z.enum(['safe', 'warning', 'danger'], {
    required_error: 'Musisz wybrać status bezpieczeństwa.',
  }),
  category: z.string().min(3, 'Kategoria musi mieć co najmniej 3 znaki.'),
  description: z.string().min(10, 'Opis musi mieć co najmniej 10 znaków.'),
  nero_comment: z.string().optional(),
});

export type ContributionFormState = {
  message: string;
  errors?: {
    name?: string[];
    status?: string[];
    category?: string[];
    description?: string[];
    nero_comment?: string[];
  };
  success?: boolean;
};

export async function submitIngredientAction(
  prevState: ContributionFormState,
  formData: FormData
): Promise<ContributionFormState> {
  const validatedFields = ContributionSchema.safeParse({
    name: formData.get('name'),
    status: formData.get('status'),
    category: formData.get('category'),
    description: formData.get('description'),
    nero_comment: formData.get('nero_comment'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Proszę poprawić błędy w formularzu.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // In a real application, you would save this to a database for review.
  console.log('New ingredient submission:', validatedFields.data);

  return {
    message: 'Dziękujemy! Twój składnik został przesłany do weryfikacji.',
    success: true,
  };
}
