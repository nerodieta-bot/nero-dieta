'use client';

import { LoginForm } from '@/components/login-form';
import { PawPrint } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { completeSignIn } from './actions';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/provider';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    const completeSignInFlow = async () => {
      const href = window.location.href;
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

        const result = await completeSignIn(href, storedEmail);
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
      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Sprawdzanie statusu logowania...</p>
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
                Witaj z powrotem w stadzie!
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Zaloguj się, aby w pełni korzystać z Dieta Nero.
            </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
