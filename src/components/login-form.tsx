'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { sendSignInLinkToEmail } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';
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
import { Loader2, Mail, CheckCircle, AlertTriangle, User, Dog, ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const NameSchema = z.string().min(2, 'Imię musi mieć co najmniej 2 znaki.');
const DogNameSchema = z.string().min(2, 'Imię psa musi mieć co najmniej 2 znaki.');
const EmailSchema = z.string().email('Proszę podać poprawny adres e-mail.');

type AuthState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

type Step = 'name' | 'dogName' | 'email' | 'success';

export function LoginForm() {
  const [step, setStep] = useState<Step>('name');
  const [formData, setFormData] = useState({ name: '', dogName: '', email: '' });
  const [error, setError] = useState<string | null>(null);
  const [authState, setAuthState] = useState<AuthState>({ status: 'idle', message: '' });
  const [isPending, startTransition] = useTransition();
  const auth = useAuth();
  
  const handleNextStep = () => {
    switch (step) {
      case 'name':
        const nameValidation = NameSchema.safeParse(formData.name);
        if (nameValidation.success) {
          setError(null);
          setStep('dogName');
        } else {
          setError(nameValidation.error.flatten().formErrors[0]);
        }
        break;
      case 'dogName':
        const dogNameValidation = DogNameSchema.safeParse(formData.dogName);
        if (dogNameValidation.success) {
          setError(null);
          setStep('email');
        } else {
          setError(dogNameValidation.error.flatten().formErrors[0]);
        }
        break;
      case 'email':
        handleSendSignInLink();
        break;
    }
  };

  const handlePrevStep = () => {
    if (step === 'dogName') setStep('name');
    if (step === 'email') setStep('dogName');
  };

  const handleSendSignInLink = () => {
    const emailValidation = EmailSchema.safeParse(formData.email);
    if (!emailValidation.success) {
      setError(emailValidation.error.flatten().formErrors[0]);
      return;
    }
    setError(null);
    
    startTransition(async () => {
      const actionCodeSettings = {
        url: `${window.location.origin}/`,
        handleCodeInApp: true,
      };

      try {
        await sendSignInLinkToEmail(auth, formData.email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', formData.email);
        window.localStorage.setItem('displayName', formData.name);
        window.localStorage.setItem('dogName', formData.dogName);
        setAuthState({
          status: 'success',
          message: `Wysłaliśmy link logujący na adres ${formData.email}. Otwórz go na tym samym urządzeniu, aby dokończyć.`,
        });
        setStep('success');
      } catch (error: any) {
        console.error('Error sending sign-in link:', error.code, error.message);
        let userMessage = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.';
        if (error.code === 'auth/invalid-email') {
          userMessage = 'Podany adres e-mail jest nieprawidłowy.';
        }
        setAuthState({ status: 'error', message: userMessage });
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  if (step === 'success') {
    return (
      <Card className="border-green-500/50 bg-green-500/10">
        <CardHeader className="items-center text-center">
          <CheckCircle className="h-16 w-16 text-green-600" />
          <CardTitle className="text-2xl text-green-800 dark:text-green-300">Sprawdź swoją skrzynkę!</CardTitle>
          <CardDescription className="text-green-700 dark:text-green-400">
            {authState.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
      <Card className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {step === 'name' && (
              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                 <CardHeader>
                  <CardTitle>Zacznijmy od Ciebie</CardTitle>
                  <CardDescription>Jak masz na imię?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="name">Twoje imię</Label>
                    <div className='relative'>
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="np. Anna" required disabled={isPending} className="pl-10" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-stretch">
                   <Button type="submit" className="w-full">Dalej</Button>
                </CardFooter>
              </form>
            )}
             {step === 'dogName' && (
              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                 <CardHeader>
                  <CardTitle>A teraz Twój pupil</CardTitle>
                  <CardDescription>Jak wabi się Twój pies?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="dogName">Imię psa</Label>
                     <div className='relative'>
                      <Dog className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="dogName" name="dogName" value={formData.dogName} onChange={handleChange} placeholder="np. Nero" required disabled={isPending} className="pl-10" />
                    </div>
                  </div>
                </CardContent>
                 <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevStep}><ArrowLeft className="mr-2"/> Wróć</Button>
                  <Button type="submit">Dalej</Button>
                </CardFooter>
              </form>
            )}
            {step === 'email' && (
              <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                <CardHeader>
                  <CardTitle>Logowanie bez hasła</CardTitle>
                  <CardDescription>Podaj swój adres e-mail, a my wyślemy Ci link, który bezpiecznie Cię zaloguje.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                     <div className='relative'>
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="np. anna@example.com" required disabled={isPending} className="pl-10" />
                    </div>
                  </div>
                </CardContent>
                 <CardFooter className="flex-col items-stretch gap-4">
                  <div className="flex justify-between w-full">
                    <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isPending}><ArrowLeft className="mr-2"/> Wróć</Button>
                    <Button type="submit" disabled={isPending}>
                       {isPending ? <Loader2 className="mr-2 animate-spin" /> : <Mail className="mr-2" />}
                       {isPending ? 'Wysyłanie...' : 'Wyślij link'}
                    </Button>
                  </div>
                </CardFooter>
              </form>
            )}
             
          </motion.div>
        </AnimatePresence>
         {(error || authState.status === 'error') && (
            <div className="px-6 pb-4 flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                {error || authState.message}
            </div>
          )}
      </Card>
  );
}
