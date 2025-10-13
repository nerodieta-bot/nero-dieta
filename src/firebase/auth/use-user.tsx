'use client';

import { useState, useEffect } from 'react';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';

// Define the shape of the hook's return value
interface UserAuthHookResult {
  user: User | null;
  isUserLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook to get the current authenticated user from Firebase.
 *
 * @param {Auth} auth - The Firebase Auth instance.
 * @returns {UserAuthHookResult} An object containing the user, loading state, and error.
 */
export const useUser = (auth: Auth): UserAuthHookResult => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isUserLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Set up the listener for authentication state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser); // Update user state
        setIsLoading(false); // Finished loading
      },
      (error) => {
        console.error("useUser hook error:", error);
        setError(error); // Set error state
        setIsLoading(false); // Finished loading (with an error)
      }
    );

    // Cleanup: Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [auth]); // Re-run the effect if the auth instance changes

  return { user, isUserLoading, error };
};
