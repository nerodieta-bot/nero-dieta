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
import { Loader2, Mail, CheckCircle, AlertTriangle } from 'lucide-react';

const EmailSchema = z.string().email('Proszę podać poprawny adres e-mail.');

type AuthState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

export function LoginForm() {
  const [authState, setAuthState] = useState<AuthState>({ status: 'idle', message: '' });
  const [isPending, startTransition] = useTransition();
  const auth = useAuth();

  const handleSendSignInLink = (formData: FormData) => {
    const email = formData.get('email');
    
    startTransition(async () => {
      const validatedEmail = EmailSchema.safeParse(email);

      if (!validatedEmail.success) {
        setAuthState({
          status: 'error',
          message: validatedEmail.error.flatten().fieldErrors.root?.[0] || 'Nieprawidłowy e-mail.',
        });
        return;
      }

      const actionCodeSettings = {
        url: `${window.location.origin}/`,
        handleCodeInApp: true,
      };

      try {
        await sendSignInLinkToEmail(auth, validatedEmail.data, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', validatedEmail.data);
        setAuthState({
          status: 'success',
          message: `Wysłaliśmy link logujący na adres ${validatedEmail.data}. Otwórz go na tym samym urządzeniu, aby dokończyć.`,
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
    <form action={handleSendSignInLink}>
      <Card>
        <CardHeader>
          <CardTitle>Logowanie bez hasła</CardTitle>
          <CardDescription>
            Podaj swój adres e-mail, a my wyślemy Ci link, który bezpiecznie Cię zaloguje.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email" className="sr-only">
              E-mail
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="np. nero@example.com"
              required
              disabled={isPending}
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wysyłanie...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Wyślij link do logowania
              </>
            )}
          </Button>
          {authState.status === 'error' && (
            <p className="mt-4 flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                {authState.message}
            </p>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
