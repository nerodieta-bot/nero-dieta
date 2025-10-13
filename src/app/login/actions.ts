'use server';

import { initializeFirebase } from '@/firebase';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { z } from 'zod';

export type AuthStatus = 'idle' | 'success' | 'error';

export interface AuthState {
  status: AuthStatus;
  message: string;
}

const EmailSchema = z.string().email('Proszę podać poprawny adres e-mail.');

export async function sendSignInLink(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email');
  const validatedEmail = EmailSchema.safeParse(email);

  if (!validatedEmail.success) {
    return {
      status: 'error',
      message: validatedEmail.error.flatten().fieldErrors.root?.[0] || 'Nieprawidłowy e-mail.',
    };
  }

  const { auth } = initializeFirebase();
  const actionCodeSettings = {
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}`,
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, validatedEmail.data, actionCodeSettings);
    // In a real app, you'd probably want to store the email in localStorage
    // or pass it in the URL to complete the sign-in on the same device.
    // For this example, we'll rely on the user providing it again.
    return {
      status: 'success',
      message: `Wysłaliśmy link logujący na adres ${validatedEmail.data}. Otwórz go na tym samym urządzeniu.`,
    };
  } catch (error: any) {
    console.error('Error sending sign-in link:', error.code, error.message);
    let userMessage = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.';
    if (error.code === 'auth/invalid-email') {
        userMessage = 'Podany adres e-mail jest nieprawidłowy.';
    }
    return {
      status: 'error',
      message: userMessage,
    };
  }
}

export async function completeSignIn(href: string, email: string): Promise<AuthState> {
  const { auth } = initializeFirebase();

  if (!isSignInWithEmailLink(auth, href)) {
    return { status: 'error', message: 'Nieprawidłowy link logowania.' };
  }
  
  try {
    await signInWithEmailLink(auth, email, href);
    return { status: 'success', message: 'Zalogowano pomyślnie!' };
  } catch (error: any) {
    console.error('Error completing sign-in:', error.code, error.message);
     let userMessage = 'Wystąpił błąd podczas logowania. Link mógł wygasnąć.';
    if (error.code === 'auth/invalid-action-code') {
        userMessage = 'Link do logowania jest nieprawidłowy lub wygasł. Spróbuj ponownie.';
    }
    return { status: 'error', message: userMessage };
  }
}
