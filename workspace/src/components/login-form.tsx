'use client';

import { useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  GoogleAuthProvider,
  signInWithPopup,
  type UserCredential,
} from 'firebase/auth';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';


async function createSessionCookie(idToken: string) {
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  return response.ok;
}

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  async function handleSuccessfulLogin(userCredential: UserCredential) {
    setIsPending(true);
    const user = userCredential.user;
    if (firestore) {
      const userRef = doc(firestore, 'users', user.uid);
      
      const isNewUser = userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime;

      if (isNewUser) {
        const userData = {
            email: user.email,
            ownerName: user.displayName || '',
            dogName: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            plan: 'starter',
            ingredientViewCount: 0,
            mealPlanGenerations: 0,
        };
        setDocumentNonBlocking(userRef, userData);
      } else {
         const userData = {
            // Only update name if it has changed, don't overwrite with empty string
            ...(user.displayName && { ownerName: user.displayName }),
            updatedAt: serverTimestamp(),
        };
        updateDocumentNonBlocking(userRef, userData);
      }
    }

    const idToken = await user.getIdToken();
    await createSessionCookie(idToken);

    toast({
      title: `Witaj w stadzie, ${user.displayName || user.email || 'użytkowniku'}!`,
      description: 'Logowanie zakończone pomyślnie.',
    });

    const redirectUrl = searchParams.get('redirect') || '/';
    router.push(redirectUrl);
  }
  

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsPending(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await handleSuccessfulLogin(userCredential);
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setError('Nie udało się zalogować przez Google. Spróbuj ponownie.');
      }
      setIsPending(false); 
    }
  };

  return (
    <Card>
      <CardHeader>
          <CardTitle>Dołącz do stada</CardTitle>
          <CardDescription>Zaloguj się przez Google, aby uzyskać pełen dostęp.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={handleGoogleSignIn} disabled={isPending} className="w-full">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
             <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.8 0 265.8c0-57.5 22.9-108.9 59.9-146.9L120.3 176c-18.1 34.2-28.7 75.3-28.7 119.8 0 85.4 69.3 154.8 154.8 154.8 85.4 0 154.8-69.3 154.8-154.8 0-11.7-1.3-23.2-3.8-34.5H244v-92.4h139.7c5.6 24.1 8.3 49.3 8.3 75.5zM128 123.4l-75.1-59.1C87.8 28.5 160.4 0 244 0c87.3 0 162.2 45.4 203.2 114.2L380.3 173c-28.9-34.2-70.5-54.8-116.3-54.8-59.5 0-109.8 34.3-135.7 85z"></path>
              </svg>
          )}
         
          {isPending ? 'Logowanie...' : 'Kontynuuj z Google'}
        </Button>
      </CardContent>
       <CardFooter>
            {error && (
                <div className="w-full flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
       </CardFooter>
    </Card>
  );
}
