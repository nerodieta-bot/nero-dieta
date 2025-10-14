'use server';

import { z } from 'zod';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeAdminApp } from '@/firebase/admin';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const { auth, firestore } = initializeAdminApp();

const ProfileSchema = z.object({
  ownerName: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki.'),
  dogName: z.string().min(2, 'Imię psa musi mieć co najmniej 2 znaki.'),
});

export type ProfileFormState = {
  message: string;
  errors?: {
    ownerName?: string[];
    dogName?: string[];
  };
  success?: boolean;
};

export async function updateProfileDataAction(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const validatedFields = ProfileSchema.safeParse({
    ownerName: formData.get('ownerName'),
    dogName: formData.get('dogName'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Proszę poprawić błędy w formularzu.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
      return {
        message: 'Brak autoryzacji. Proszę się zalogować.',
        success: false,
      };
    }

    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedToken.uid;

    const userRef = firestore.collection('users').doc(userId);
    await userRef.set({
      ownerName: validatedFields.data.ownerName,
      dogName: validatedFields.data.dogName,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    
    revalidatePath('/profil');

    return {
      message: 'Twój profil został pomyślnie zaktualizowany!',
      success: true,
    };

  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      message: 'Wystąpił błąd podczas aktualizacji profilu. Spróbuj ponownie.',
      success: false,
    };
  }
}
