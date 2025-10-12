'use server';

import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki.'),
  email: z.string().email('Proszę podać poprawny adres e-mail.'),
  message: z.string().min(10, 'Wiadomość musi mieć co najmniej 10 znaków.'),
});

export type ContactFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
  success?: boolean;
};

export async function sendContactMessageAction(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = ContactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Proszę poprawić błędy w formularzu.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // In a real application, you would integrate this with an email service
  // like SendGrid, Resend, or Nodemailer.
  // For this example, we'll just log it to the server console.
  console.log('New contact message received:');
  console.log(validatedFields.data);

  return {
    message: 'Dziękujemy za Twoją wiadomość! Odpowiemy najszybciej, jak to możliwe.',
    success: true,
  };
}
