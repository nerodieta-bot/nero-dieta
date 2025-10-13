'use client';

import { LoginForm } from '@/components/login-form';
import { PawPrint } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/provider';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

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
          <p className="mt-4 text-muted-foreground">Chwileczkę, weryfikujemy Twoją sesję...</p>
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
                Zaloguj się, aby w pełni korzystać z Dieta Nero.
            </p>
        </div>
        <LoginForm />
        {/* Container for reCAPTCHA */}
        <div id="recaptcha-container" className="mt-4 flex justify-center"></div>
      </div>
    </div>
  );
}
