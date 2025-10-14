'use client';

import { useState, useEffect } from 'react';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '..'; // Import useAuth from the barrel file

// Define the shape of the hook's return value
interface UserAuthHookResult {
  user: User | null;
  isUserLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook to get the current authenticated user from Firebase.
 * It automatically uses the Auth instance from FirebaseProvider.
 *
 * @returns {UserAuthHookResult} An object containing the user, loading state, and error.
 */
export const useUser = (): UserAuthHookResult => {
  const auth = useAuth(); // Get auth instance from context
  const [user, setUser] = useState<User | null>(auth?.currentUser || null);
  const [isUserLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
        setIsLoading(false);
        // Optionally set an error if auth service is not available
        // setError(new Error("Firebase Auth service is not available."));
        return;
    }
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

    