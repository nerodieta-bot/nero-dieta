'use server';

import { z } from 'zod';
import { Resend } from 'resend';

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

const adminEmail = 'admin@nero-dieta.ch';


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

  const { name, email, message } = validatedFields.data;

  try {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("Klucz API dla Resend nie jest skonfigurowany.");
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send email notification to admin
    await resend.emails.send({
        from: 'Dieta Nero <noreply@nero-dieta.ch>',
        to: adminEmail,
        subject: `Nowa wiadomość od ${name} - Dieta Nero`,
        html: `
          <h1>Nowa wiadomość z formularza kontaktowego</h1>
          <p><strong>Imię:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Wiadomość:</strong></p>
          <p>${message}</p>
        `,
      });
    
    return {
      message: 'Dziękujemy za Twoją wiadomość! Odpowiemy najszybciej, jak to możliwe.',
      success: true,
    };

  } catch(error) {
     console.error('Error sending contact message:', error);
     return {
        message: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.',
        success: false,
     }
  }
}
