'use client';

import { useState, useTransition } from 'react';
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
import { Loader2, Mail, CheckCircle, AlertTriangle } from 'lucide-react';

const EmailSchema = z.string().email('Proszę podać poprawny adres e-mail.');

type AuthState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [authState, setAuthState] = useState<AuthState>({ status: 'idle', message: '' });
  const [isPending, startTransition] = useTransition();
  const auth = useAuth();

  const handleSendSignInLink = (e: React.FormEvent) => {
    e.preventDefault();
    const emailValidation = EmailSchema.safeParse(email);
    if (!emailValidation.success) {
      setAuthState({ status: 'error', message: emailValidation.error.flatten().formErrors[0] });
      return;
    }
    
    startTransition(async () => {
      const actionCodeSettings = {
        url: `${window.location.origin}/`,
        handleCodeInApp: true,
      };

      try {
        if (!auth) {
          throw new Error("Błąd inicjalizacji Firebase. Spróbuj ponownie za chwilę.");
        }
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
        setAuthState({
          status: 'success',
          message: `Wysłaliśmy link logujący na adres ${email}. Otwórz go na tym samym urządzeniu, aby dokończyć.`,
        });
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
  
  if (authState.status === 'success') {
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
      <Card>
        <form onSubmit={handleSendSignInLink}>
            <CardHeader>
                <CardTitle>Logowanie bez hasła</CardTitle>
                <CardDescription>Podaj swój adres e-mail, a my wyślemy Ci link, który bezpiecznie Cię zaloguje.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                    <div className='relative'>
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="np. anna@example.com" required disabled={isPending} className="pl-10" />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
                <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 animate-spin" /> : <Mail className="mr-2" />}
                    {isPending ? 'Wysyłanie...' : 'Wyślij link'}
                </Button>
                {authState.status === 'error' && (
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
