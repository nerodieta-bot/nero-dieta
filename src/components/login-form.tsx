'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { useAuth, useFirestore } from '@/firebase/provider';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle, Mail } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { 
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';
import { Separator } from './ui/separator';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';


const LoginSchema = z.object({
  email: z.string().email('Proszę podać poprawny adres e-mail.'),
});

type AuthState = { status: 'idle' | 'error' | 'success'; message: string };

async function createSessionCookie(idToken: string) {
    const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
    });
    return response.ok;
}

export function LoginForm() {
  const [authState, setAuthState] = useState<AuthState>({ status: 'idle', message: '' });
  const [isEmailPending, startEmailTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();

  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (auth && isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Proszę podać swój adres e-mail w celu weryfikacji');
      }

      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(async (result) => {
            window.localStorage.removeItem('emailForSignIn');
            
            if (firestore) {
                const userRef = doc(firestore, 'users', result.user.uid);
                const userData = {
                    email: result.user.email,
                    createdAt: serverTimestamp(),
                };
                // Use non-blocking write to create user doc if it doesn't exist
                setDocumentNonBlocking(userRef, userData, { merge: true });
            }

            const idToken = await result.user.getIdToken();
            await createSessionCookie(idToken);
            
            toast({ title: 'Logowanie udane!', description: 'Witaj z powrotem!' });
            const redirectUrl = searchParams.get('redirect') || '/';
            router.push(redirectUrl);
          })
          .catch((error) => {
            console.error('Email Link Sign In Error:', error);
            setAuthState({ status: 'error', message: 'Wystąpił błąd podczas logowania. Link mógł wygasnąć.' });
          });
      }
    }
  }, [auth, firestore, router, toast, searchParams]);

  const handleEmailSignIn = (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const validation = LoginSchema.safeParse(data);
    
    if (!validation.success) {
      setAuthState({ status: 'error', message: validation.error.flatten().fieldErrors.email?.[0] || 'Popraw błędy.' });
      return;
    }

    if (!auth) return;

    startEmailTransition(async () => {
      setAuthState({ status: 'idle', message: '' });
      try {
        const actionCodeSettings = {
          url: "https://nero-dieta.ch/login",
          handleCodeInApp: true,
        };
        await sendSignInLinkToEmail(auth, validation.data.email, actionCodeSettings);
        
        window.localStorage.setItem('emailForSignIn', validation.data.email);

        setAuthState({ status: 'success', message: `Link weryfikacyjny został wysłany na adres ${validation.data.email}. Sprawdź swoją skrzynkę!` });
        formRef.current?.reset();
      } catch (error: any) {
        console.error('Email Send Error:', error);
        setAuthState({ status: 'error', message: 'Nie udało się wysłać linku. Spróbuj ponownie.' });
      }
    });
  };

  const handleGoogleSignIn = () => {
    if (!auth) return;

    startGoogleTransition(async () => {
        setAuthState({ status: 'idle', message: '' });
        try {
            const provider = new GoogleAuthProvider();
            const userCredential: UserCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            if (firestore) {
                const userRef = doc(firestore, 'users', user.uid);
                const userData = {
                    email: user.email,
                    ownerName: user.displayName,
                    createdAt: serverTimestamp(),
                    provider: 'google.com',
                };
                setDocumentNonBlocking(userRef, userData, { merge: true });
            }
            
            const idToken = await user.getIdToken();
            await createSessionCookie(idToken);

            toast({
                title: `Witaj w stadzie, ${user.displayName}!`,
                description: 'Logowanie zakończone pomyślnie.',
            });

            const redirectUrl = searchParams.get('redirect') || '/';
            router.push(redirectUrl);

        } catch (error: any) {
            console.error('Google Sign In Error:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                setAuthState({ status: 'error', message: 'Logowanie przez Google zostało anulowane.' });
                return;
            }
            setAuthState({ status: 'error', message: 'Logowanie przez Google nie powiodło się. Spróbuj ponownie.' });
        }
    });
  };

  const isPending = isEmailPending || isGooglePending;

  return (
    <Card>
      <form ref={formRef} action={handleEmailSignIn}>
        <CardHeader>
          <CardTitle>Utwórz konto lub zaloguj się</CardTitle>
          <CardDescription>
            Wpisz swój e-mail, a my wyślemy Ci link do szybkiego logowania. Bez haseł!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
            <Label htmlFor="email">Twój adres e-mail</Label>
            <Input id="email" name="email" type="email" placeholder="np. jan.kowalski@email.com" required />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4">
          <Button type="submit" disabled={isPending} className="w-full">
            {isEmailPending ? <Loader2 className="mr-2 animate-spin" /> : <Mail className="mr-2" />}
            {isEmailPending ? 'Wysyłanie...' : 'Wyślij link do logowania'}
          </Button>

           {authState.status === 'error' && authState.message && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {authState.message}
            </div>
          )}
           {authState.status === 'success' && authState.message && (
            <div className="text-sm text-green-600 dark:text-green-400 text-center p-4 bg-green-500/10 rounded-md">
              {authState.message}
            </div>
          )}
        </CardFooter>
      </form>
       <Separator className="my-4" />
       <div className="p-6 pt-0">
          <Button variant="outline" onClick={handleGoogleSignIn} disabled={isPending} className="w-full">
            {isGooglePending ? <Loader2 className="mr-2 animate-spin" /> : (
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.8 0 265.8c0-57.5 22.9-108.9 59.9-146.9L120.3 176c-18.1 34.2-28.7 75.3-28.7 119.8 0 85.4 69.3 154.8 154.8 154.8 85.4 0 154.8-69.3 154.8-154.8 0-11.7-1.3-23.2-3.8-34.5H244v-92.4h139.7c5.6 24.1 8.3 49.3 8.3 75.5zM128 123.4l-75.1-59.1C87.8 28.5 160.4 0 244 0c87.3 0 162.2 45.4 203.2 114.2L380.3 173c-28.9-34.2-70.5-54.8-116.3-54.8-59.5 0-109.8 34.3-135.7 85z"></path>
              </svg>
            )}
            {isGooglePending ? 'Logowanie...' : 'Kontynuuj z Google'}
          </Button>
       </div>
    </Card>
  );
}
