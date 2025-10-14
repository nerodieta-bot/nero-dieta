'use server';

import { cookies } from 'next/headers';
import { initializeAdminApp } from '@/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Increments the ingredientViewCount for the currently logged-in user.
 * This is a server action and should be called from server components or routes.
 */
export async function incrementIngredientViewCount() {
  try {
    const sessionCookie = cookies().get('__session')?.value;
    // If no session, do nothing. This is for guests or users who are not logged in.
    if (!sessionCookie) {
      return;
    }
    
    // Initialize admin app inside the function to avoid issues in different environments
    const { auth, firestore } = initializeAdminApp();
    
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedToken.uid;
    
    if (userId) {
      const userRef = firestore.collection('users').doc(userId);
      
      // Atomically increment the counter.
      // If the field doesn't exist, it will be created and set to 1.
      await userRef.update({
        ingredientViewCount: FieldValue.increment(1),
      });
    }
  } catch (error) {
    // We don't want to block the user experience if this fails.
    // Log the error for monitoring purposes.
    console.error('Failed to increment ingredient view count:', error);
  }
}
