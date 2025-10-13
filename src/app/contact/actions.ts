'use server';

import { z } from 'zod';
import { initializeAdminApp } from '@/firebase/admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
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

// Initialize Firebase Admin SDK
const { firestore } = initializeAdminApp();
const resend = new Resend(process.env.RESEND_API_KEY);
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
    // 1. Save message to Firestore
    const contactMessagesRef = firestore.collection('contact_messages');
    await contactMessagesRef.add({
      name,
      email,
      message,
      createdAt: FieldValue.serverTimestamp(),
    });

    // 2. Send email notification to admin
    try {
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
    } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Log the error but don't block the user.
        // The message is already saved in the database.
    }
    
    return {
      message: 'Dziękujemy za Twoją wiadomość! Odpowiemy najszybciej, jak to możliwe.',
      success: true,
    };

  } catch(error) {
     console.error('Error saving contact message:', error);
     return {
        message: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.',
        success: false,
     }
  }
}
