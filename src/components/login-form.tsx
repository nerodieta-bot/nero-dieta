'use client';

import { useState, useActionState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { sendSignInLink, completeSignIn, type AuthState } from '@/app/login/actions';
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
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/provider';

const initialAuthState: AuthState = { status: 'idle', message: '' };

export function LoginForm() {
  const [authState, formAction, isPending] = useActionState(sendSignInLink, initialAuthState);
  const [emailForSignIn, setEmailForSignIn] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    const completeSignInFlow = async () => {
      if (searchParams.has('apiKey') && searchParams.has('oobCode')) {
        const storedEmail = window.localStorage.getItem('emailForSignIn');
        if (!storedEmail) {
          toast({
            variant: 'destructive',
            title: 'Błąd logowania',
            description: 'Nie znaleziono adresu e-mail. Spróbuj ponownie.',
          });
          router.push('/login');
          return;
        }

        const result = await completeSignIn(window.location.href, storedEmail);
        toast({
          title: result.status === 'success' ? 'Zalogowano pomyślnie!' : 'Błąd logowania',
          description: result.message,
          variant: result.status === 'success' ? 'default' : 'destructive',
        });
        window.localStorage.removeItem('emailForSignIn');
        router.push('/');
      }
    };
    completeSignInFlow();
  }, [searchParams, router, toast]);

   useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  if (isUserLoading || user) {
     return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Sprawdzanie statusu logowania...</p>
      </div>
    );
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailForSignIn(e.target.value);
  };
  
  const handleFormAction = (formData: FormData) => {
    window.localStorage.setItem('emailForSignIn', emailForSignIn);
    formAction(formData);
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
    <form action={handleFormAction}>
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
              onChange={handleEmailChange}
              value={emailForSignIn}
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