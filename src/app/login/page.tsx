'use client';

import { LoginForm } from '@/components/login-form';
import { PawPrint } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { completeSignIn } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/provider';
import { Loader2 } from 'lucide-react';
import {
  setDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { UserCredential } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isCompletingSignIn, setIsCompletingSignIn] = useState(false);

  useEffect(() => {
    const completeSignInFlow = async () => {
      const href = window.location.href;
      if (searchParams.has('apiKey') && searchParams.has('oobCode') && firestore) {
        setIsCompletingSignIn(true);
        const storedEmail = window.localStorage.getItem('emailForSignIn');
        if (!storedEmail) {
          toast({
            variant: 'destructive',
            title: 'Błąd logowania',
            description: 'Nie znaleziono adresu e-mail. Spróbuj ponownie.',
          });
          router.push('/login');
          setIsCompletingSignIn(false);
          return;
        }

        const result = await completeSignIn(href, storedEmail);

        if (result.status === 'success' && result.userCredential) {
          const userCred = result.userCredential as UserCredential;
          const { user } = userCred;

          const userRef = doc(firestore, 'users', user.uid);
           setDoc(userRef, {
              email: user.email,
              createdAt: serverTimestamp(),
            }, { merge: true }).catch(error => {
                errorEmitter.emit(
                  'permission-error',
                  new FirestorePermissionError({
                    path: userRef.path,
                    operation: 'write',
                    requestResourceData: {
                      email: user.email,
                    },
                  })
                )
            });

          toast({
            title: 'Witaj w stadzie!',
            description: result.message,
          });

          window.localStorage.removeItem('emailForSignIn');
          router.push('/');

        } else {
          toast({
            title: 'Błąd logowania',
            description: result.message,
            variant: 'destructive',
          });
          setIsCompletingSignIn(false);
        }
        // Always remove the email from local storage after attempting sign-in
        window.localStorage.removeItem('emailForSignIn');
      }
    };
    if (firestore) {
      completeSignInFlow();
    }
  }, [searchParams, router, toast, firestore]);

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  if (isUserLoading || user || isCompletingSignIn) {
     return (
      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Chwileczkę, finalizujemy logowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
            <PawPrint className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary font-headline">
                Dołącz do stada Nero!
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Zarejestruj się, aby w pełni korzystać z Dieta Nero.
            </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
