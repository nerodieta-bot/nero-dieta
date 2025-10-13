'use server';

import { z } from 'zod';
import { initializeAdminApp } from '@/firebase/admin';
import { getFirestore,FieldValue } from 'firebase-admin/firestore';

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

  try {
    const contactMessagesRef = firestore.collection('contact_messages');
    await contactMessagesRef.add({
      ...validatedFields.data,
      createdAt: FieldValue.serverTimestamp(),
    });
    
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
