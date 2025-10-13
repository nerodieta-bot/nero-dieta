'use client';

import { useState, useTransition } from 'react';
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
import { Loader2, AlertTriangle, User, Dog, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import { GoogleAuthProvider, signInWithPopup, sendSignInLinkToEmail } from 'firebase/auth';

const NameSchema = z.string().min(2, 'Imię musi mieć co najmniej 2 znaki.');
const DogNameSchema = z.string().min(2, 'Imię psa musi mieć co najmniej 2 znaki.');
const EmailSchema = z.string().email('Proszę podać poprawny adres e-mail.');

type Step = 'name' | 'dogName' | 'email';
type AuthState = { status: 'idle' | 'error'; message: string };

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        <path fill="none" d="M1 1h22v22H1z" />
    </svg>
);


export function MultiStepLoginForm() {
  const [step, setStep] = useState<Step>('name');
  const [authState, setAuthState] = useState<AuthState>({ status: 'idle', message: '' });
  const [isPending, startTransition] = useTransition();

  const [userName, setUserName] = useState('');
  const [dogName, setDogName] = useState('');
  const [email, setEmail] = useState('');

  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleNextStep = () => {
    let validation;
    if (step === 'name') {
      validation = NameSchema.safeParse(userName);
      if (validation.success) setStep('dogName');
      else setAuthState({ status: 'error', message: validation.error.flatten().formErrors[0] });
    } else if (step === 'dogName') {
      validation = DogNameSchema.safeParse(dogName);
      if (validation.success) setStep('email');
      else setAuthState({ status: 'error', message: validation.error.flatten().formErrors[0] });
    }
  };

  const handlePrevStep = () => {
    if (step === 'email') setStep('dogName');
    else if (step === 'dogName') setStep('name');
  };

  const handleSaveUser = async (user: any, providerData: {displayName?: string | null, dogName?: string | null} = {}) => {
    if (firestore && user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userData = {
            email: user.email,
            displayName: providerData.displayName || user.displayName || userName,
            dogName: providerData.dogName || dogName,
            createdAt: serverTimestamp(),
            provider: user.providerData?.[0]?.providerId || 'emailLink'
        };
        await setDoc(userRef, userData, { merge: true }).catch(error => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userRef.path,
                operation: 'write',
                requestResourceData: userData
            }));
            throw error;
        });
    }
  };


  const handleGoogleSignIn = async () => {
    if (!auth) return;
    startTransition(async () => {
        setAuthState({ status: 'idle', message: '' });
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await handleSaveUser(result.user);
            toast({
                title: `Witaj, ${result.user.displayName}!`,
                description: 'Logowanie zakończone pomyślnie. Witaj w stadzie!',
            });
            router.push('/');
        } catch (error: any) {
             let userMessage = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
             if (error.code === 'auth/popup-closed-by-user') {
                userMessage = 'Logowanie przez Google zostało anulowane.';
             } else if (error.code === 'auth/account-exists-with-different-credential') {
                userMessage = 'Konto z tym adresem e-mail już istnieje, ale używa innej metody logowania.';
             }
             toast({
                variant: 'destructive',
                title: 'Błąd logowania',
                description: userMessage,
             });
             console.error('Google Sign-In Error:', error);
        }
    });
  };

  const handleEmailLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValidation = EmailSchema.safeParse(email);
    if (!emailValidation.success) {
      setAuthState({ status: 'error', message: emailValidation.error.flatten().formErrors[0] });
      return;
    }

    if (!auth) return;
    startTransition(async () => {
        setAuthState({ status: 'idle', message: '' });
        const actionCodeSettings = {
            url: window.location.origin,
            handleCodeInApp: true,
        };
        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            window.localStorage.setItem('userNameForSignIn', userName);
            window.localStorage.setItem('dogNameForSignIn', dogName);
            toast({
                title: 'Link wysłany!',
                description: `Wysłaliśmy link logujący na adres ${email}. Sprawdź swoją skrzynkę!`,
            });
            setAuthState({ status: 'idle', message: `Sprawdź skrzynkę e-mail (${email}), aby dokończyć logowanie!` });
        } catch (error: any) {
            console.error('Email Link Error:', error);
            setAuthState({ status: 'error', message: 'Nie udało się wysłać linku. Spróbuj ponownie.' });
        }
    });
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stwórz swój profil</CardTitle>
        <CardDescription>
          {step === 'name' && 'Zacznijmy od przedstawienia się.'}
          {step === 'dogName' && 'Teraz najważniejszy członek stada!'}
          {step === 'email' && 'Ostatni krok - podaj swój e-mail, abyśmy mogli Cię powitać.'}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleEmailLinkSignIn}>
        <CardContent className="space-y-4">
          {step === 'name' && (
            <div className="space-y-2 animate-in fade-in">
              <Label htmlFor="userName">Jak masz na imię?</Label>
              <Input id="userName" name="userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="np. Anna" autoFocus />
            </div>
          )}
          {step === 'dogName' && (
            <div className="space-y-2 animate-in fade-in">
              <Label htmlFor="dogName">Jak wabi się Twój pies?</Label>
              <Input id="dogName" name="dogName" value={dogName} onChange={(e) => setDogName(e.target.value)} placeholder="np. Nero" autoFocus />
            </div>
          )}
          {step === 'email' && (
            <div className="space-y-2 animate-in fade-in">
              <Label htmlFor="email">Twój adres e-mail</Label>
              <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="np. anna@email.com" autoFocus />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4">
            {step !== 'email' ? (
                <div className='flex justify-between w-full'>
                    <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isPending || step === 'name'}>
                        <ArrowLeft className='mr-2' /> Wróć
                    </Button>
                    <Button type="button" onClick={handleNextStep} disabled={isPending}>
                        Dalej <ArrowRight className='ml-2' />
                    </Button>
                </div>
            ) : (
                 <div className='flex justify-between w-full'>
                    <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isPending}>
                         <ArrowLeft className='mr-2' /> Wróć
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 animate-spin" /> : <Mail className="mr-2" />}
                        {isPending ? 'Wysyłanie...' : 'Wyślij link logujący'}
                    </Button>
                </div>
            )}

             {authState.status === 'error' && authState.message && (
              <div className="flex items-center gap-2 text-sm text-destructive mt-2">
                <AlertTriangle className="h-4 w-4" />
                {authState.message}
              </div>
            )}
             {authState.status === 'idle' && authState.message && (
              <div className="text-sm text-green-600 dark:text-green-400 mt-2 text-center">
                {authState.message}
              </div>
            )}
            
            <div className="relative my-4">
                <Separator />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-card text-muted-foreground text-xs">LUB</div>
            </div>

            <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn} disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 animate-spin" /> : <GoogleIcon />}
                Zaloguj się przez Google
            </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
