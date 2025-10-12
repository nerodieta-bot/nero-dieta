'use server';

import { z } from 'zod';

const BugReportSchema = z.object({
  page_url: z.string().optional(),
  description: z.string().min(10, 'Opis błędu musi mieć co najmniej 10 znaków.'),
  email: z.string().email('Proszę podać poprawny adres e-mail, abyśmy mogli się skontaktować w razie potrzeby.').optional().or(z.literal('')),
});

export type BugReportFormState = {
  message: string;
  errors?: {
    page_url?: string[];
    description?: string[];
    email?: string[];
  };
  success?: boolean;
};

export async function reportBugAction(
  prevState: BugReportFormState,
  formData: FormData
): Promise<BugReportFormState> {
  const validatedFields = BugReportSchema.safeParse({
    page_url: formData.get('page_url'),
    description: formData.get('description'),
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Proszę poprawić błędy w formularzu.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // In a real application, you would save this to a database or send to a tracking system.
  console.log('New bug report received:');
  console.log(validatedFields.data);

  return {
    message: 'Dziękujemy za zgłoszenie błędu! Przyjrzymy mu się najszybciej, jak to możliwe.',
    success: true,
  };
}
