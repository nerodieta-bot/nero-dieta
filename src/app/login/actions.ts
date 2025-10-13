'use server';

import { initializeFirebase } from '@/firebase';
import { isSignInWithEmailLink, signInWithEmailLink, UserCredential } from 'firebase/auth';

export type AuthStatus = 'idle' | 'success' | 'error';

export interface AuthState {
  status: AuthStatus;
  message: string;
  userCredential?: UserCredential | null;
}

export async function completeSignIn(href: string, email: string): Promise<AuthState> {
  const { auth } = initializeFirebase();

  if (!isSignInWithEmailLink(auth, href)) {
    return { status: 'error', message: 'Nieprawidłowy link logowania.' };
  }
  
  try {
    const userCredential = await signInWithEmailLink(auth, email, href);
    return { status: 'success', message: 'Zalogowano pomyślnie!', userCredential };
  } catch (error: any) {
    console.error('Error completing sign-in:', error.code, error.message);
     let userMessage = 'Wystąpił błąd podczas logowania. Link mógł wygasnąć.';
    if (error.code === 'auth/invalid-action-code') {
        userMessage = 'Link do logowania jest nieprawidłowy lub wygasł. Spróbuj ponownie.';
    }
    return { status: 'error', message: userMessage };
  }
}
