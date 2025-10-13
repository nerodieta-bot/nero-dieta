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
import { Loader2, AlertTriangle, Phone, MessageSquare, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult, 
  UserCredential
} from 'firebase/auth';

// Define window interface to include our custom properties
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

const PhoneSchema = z.string().min(9, 'Numer telefonu musi mieć co najmniej 9 znaków.');
const CodeSchema = z.string().min(1, 'Kod jest wymagany.');

type Step = 'phone' | 'code';
type AuthState = { status: 'idle' | 'error' | 'success'; message: string };

export function PhoneLoginForm() {
  const [step, setStep] = useState<Step>('phone');
  const [authState, setAuthState] = useState<AuthState>({ status: 'idle', message: '' });
  const [isPending, startTransition] = useTransition();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');

  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!auth || !recaptchaContainerRef.current) return;

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }, [auth]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneValidation = PhoneSchema.safeParse(phoneNumber);
    if (!phoneValidation.success) {
      setAuthState({ status: 'error', message: phoneValidation.error.flatten().formErrors[0] });
      return;
    }

    if (!auth || !window.recaptchaVerifier) return;
    
    startTransition(async () => {
      setAuthState({ status: 'idle', message: '' });
      try {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
        window.confirmationResult = confirmationResult;
        setAuthState({ status: 'success', message: `Wysłaliśmy kod na numer ${phoneNumber}` });
        setStep('code');
      } catch (error: any) {
        console.error('SMS Send Error:', error);
        let userMessage = 'Nie udało się wysłać kodu. Spróbuj ponownie.';
        if (error.code === 'auth/invalid-phone-number') {
            userMessage = 'Nieprawidłowy format numeru telefonu. Podaj go w formacie międzynarodowym, np. +41790000000.';
        } else if (error.code === 'auth/too-many-requests') {
            userMessage = 'Zbyt wiele prób. Spróbuj ponownie później.';
        }
        setAuthState({ status: 'error', message: userMessage });
      }
    });
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeValidation = CodeSchema.safeParse(code);
    if (!codeValidation.success) {
      setAuthState({ status: 'error', message: codeValidation.error.flatten().formErrors[0] });
      return;
    }

    if (!window.confirmationResult) {
        setAuthState({ status: 'error', message: 'Brak wyniku potwierdzenia. Spróbuj wysłać kod ponownie.' });
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
                provider: 'phone',
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
            title: `Witaj w stadzie!`,
            description: 'Logowanie zakończone pomyślnie.',
        });
        router.push('/');
      } catch (error: any) {
        console.error('Code Verification Error:', error);
        let userMessage = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
        if (error.code === 'auth/invalid-verification-code') {
            userMessage = 'Nieprawidłowy kod weryfikacyjny. Sprawdź go i spróbuj ponownie.';
        } else if (error.code === 'auth/code-expired') {
            userMessage = 'Kod weryfikacyjny wygasł. Poproś o nowy.';
        }
        setAuthState({ status: 'error', message: userMessage });
      }
    });
  };
  
  const handleBack = () => {
    setStep('phone');
    setAuthState({ status: 'idle', message: '' });
    setCode('');
  }

  return (
    <Card>
      <div ref={recaptchaContainerRef}></div>
      <CardHeader>
        <CardTitle>Logowanie numerem telefonu</CardTitle>
        <CardDescription>
          {step === 'phone'
            ? 'Podaj swój numer telefonu, aby otrzymać kod weryfikacyjny SMS.'
            : 'Wpisz 6-cyfrowy kod, który wysłaliśmy na Twój numer.'}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={step === 'phone' ? handleSendCode : handleVerifyCode}>
        <CardContent className="space-y-4">
          {step === 'phone' && (
            <div className="space-y-2 animate-in fade-in">
              <Label htmlFor="phone">Numer telefonu</Label>
              <Input 
                id="phone" 
                name="phone" 
                type="tel" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                placeholder="+41 79 000 00 00" 
                autoFocus 
              />
            </div>
          )}
          {step === 'code' && (
            <div className="space-y-2 animate-in fade-in">
              <Label htmlFor="code">Kod weryfikacyjny</Label>
              <Input 
                id="code" 
                name="code" 
                type="text" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                placeholder="123456"
                autoFocus 
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4">
            {step === 'phone' ? (
                 <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? <Loader2 className="mr-2 animate-spin" /> : <Phone className="mr-2" />}
                    {isPending ? 'Wysyłanie...' : 'Wyślij kod'}
                </Button>
            ) : (
                 <div className='flex flex-col sm:flex-row gap-2 w-full'>
                    <Button type="button" variant="outline" onClick={handleBack} disabled={isPending}>
                         <ArrowLeft className='mr-2' /> Wróć
                    </Button>
                    <Button type="submit" disabled={isPending} className="flex-grow">
                        {isPending ? <Loader2 className="mr-2 animate-spin" /> : <MessageSquare className="mr-2" />}
                        {isPending ? 'Weryfikowanie...' : 'Potwierdź kod'}
                    </Button>
                </div>
            )}
             {authState.status === 'error' && authState.message && (
              <div className="flex items-center gap-2 text-sm text-destructive mt-2">
                <AlertTriangle className="h-4 w-4" />
                {authState.message}
              </div>
            )}
             {authState.status === 'success' && authState.message && (
              <div className="text-sm text-green-600 dark:text-green-400 mt-2 text-center">
                {authState.message}
              </div>
            )}
        </CardFooter>
      </form>
    </Card>
  );
}
