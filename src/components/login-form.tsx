'use client';

import { useState, useTransition, useEffect } from 'react';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  ConfirmationResult, 
  UserCredential 
} from 'firebase/auth';
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
import { Loader2, Phone, MessageSquareCode, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

const PhoneSchema = z.string().regex(/^\+[1-9]\d{1,14}$/, 'Proszę podać numer w formacie międzynarodowym, np. +48123456789');
const CodeSchema = z.string().min(1, 'Kod nie może być pusty.');

type AuthState = {
  status: 'idle' | 'error';
  message: string;
};

type Step = 'enterPhone' | 'enterCode';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export function LoginForm() {
  const [step, setStep] = useState<Step>('enterPhone');
  const [authState, setAuthState] = useState<AuthState>({ status: 'idle', message: '' });
  const [isPending, startTransition] = useTransition();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) return;
    
    // Initialize reCAPTCHA verifier
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          toast({
            variant: 'destructive',
            title: 'Sesja reCAPTCHA wygasła',
            description: 'Proszę spróbować ponownie.',
          });
        }
      });
    }
  }, [auth, toast]);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneValidation = PhoneSchema.safeParse(phoneNumber);

    if (!phoneValidation.success) {
      setAuthState({ status: 'error', message: phoneValidation.error.flatten().formErrors[0] });
      return;
    }
    
    startTransition(async () => {
      setAuthState({ status: 'idle', message: '' });
      try {
        if (!auth || !window.recaptchaVerifier) {
          throw new Error("Błąd inicjalizacji Firebase. Spróbuj ponownie za chwilę.");
        }
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
        window.confirmationResult = confirmationResult;
        setStep('enterCode');
        toast({
          title: 'Kod wysłany!',
          description: `Wysłaliśmy kod weryfikacyjny na numer ${phoneNumber}.`,
        });
      } catch (error: any) {
        console.error('Error sending phone code:', error);
        let userMessage = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
        if (error.code === 'auth/invalid-phone-number') {
          userMessage = 'Podany numer telefonu jest nieprawidłowy.';
        } else if (error.code === 'auth/too-many-requests') {
          userMessage = 'Wykryliśmy zbyt wiele prób. Spróbuj ponownie później.';
        }
        setAuthState({ status: 'error', message: userMessage });
      }
    });
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const codeValidation = CodeSchema.safeParse(code);

    if (!codeValidation.success) {
      setAuthState({ status: 'error', message: codeValidation.error.flatten().formErrors[0] });
      return;
    }
    
    startTransition(async () => {
      setAuthState({ status: 'idle', message: '' });
      try {
        if (!window.confirmationResult) {
          throw new Error('Brak wyniku potwierdzenia. Spróbuj wysłać kod ponownie.');
        }
        const userCredential: UserCredential = await window.confirmationResult.confirm(code);
        const user = userCredential.user;

        if (firestore) {
          const userRef = doc(firestore, 'users', user.uid);
          const userData = {
            phoneNumber: user.phoneNumber,
            createdAt: serverTimestamp(),
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
        
        toast({
          title: 'Witaj w stadzie!',
          description: 'Logowanie zakończone pomyślnie.',
        });
        router.push('/');

      } catch (error: any) {
        console.error('Error verifying code:', error);
        let userMessage = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
        if (error.code === 'auth/invalid-verification-code') {
          userMessage = 'Podany kod jest nieprawidłowy.';
        } else if (error.code === 'auth/code-expired') {
            userMessage = 'Kod weryfikacyjny wygasł. Poproś o nowy.';
        }
        setAuthState({ status: 'error', message: userMessage });
      }
    });
  };

  if (step === 'enterPhone') {
    return (
      <Card>
        <form onSubmit={handleSendCode}>
          <CardHeader>
            <CardTitle>Logowanie numerem telefonu</CardTitle>
            <CardDescription>Podaj swój numer telefonu, a my wyślemy Ci kod weryfikacyjny SMS.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Numer telefonu</Label>
              <Input id="phone" name="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+48 123 456 789" required disabled={isPending} />
            </div>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 animate-spin" /> : <Phone className="mr-2" />}
              {isPending ? 'Wysyłanie...' : 'Wyślij kod'}
            </Button>
            {authState.status === 'error' && authState.message && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                {authState.message}
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    );
  }

  if (step === 'enterCode') {
     return (
      <Card>
        <form onSubmit={handleVerifyCode}>
          <CardHeader>
            <CardTitle>Wprowadź kod weryfikacyjny</CardTitle>
            <CardDescription>Wpisz kod, który wysłaliśmy na numer {phoneNumber}.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Kod weryfikacyjny</Label>
              <Input id="code" name="code" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Wpisz kod..." required disabled={isPending} maxLength={6} />
            </div>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 animate-spin" /> : <MessageSquareCode className="mr-2" />}
              {isPending ? 'Weryfikowanie...' : 'Zaloguj się'}
            </Button>
             <Button variant="link" size="sm" onClick={() => { setStep('enterPhone'); setAuthState({status: 'idle', message: ''}); setCode(''); }} disabled={isPending}>
                Wpisano zły numer? Wróć
            </Button>
            {authState.status === 'error' && authState.message && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                {authState.message}
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    );
  }

  return null;
}
