'use client';

import { useUser } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, PawPrint } from 'lucide-react';
import { PhoneLoginForm } from '@/components/login-form';

export default function LoginPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // Przekieruj użytkownika, jeśli jest już zalogowany i zakończono ładowanie.
    if (user && !isUserLoading) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);
  
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
        <PhoneLoginForm />
      </div>
    </div>
  );
}
