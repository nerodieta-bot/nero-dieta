'use client';

import { useUser } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { PhoneLoginForm } from '@/components/phone-login-form';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (user && !isUserLoading) {
      const redirectUrl = searchParams.get('redirect') || '/';
      router.replace(redirectUrl);
    }
  }, [user, isUserLoading, router, searchParams]);
  
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
        <PhoneLoginForm />
        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-primary underline">
            Zaloguj się przez Google lub e-mail
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPhonePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Ładowanie strony logowania...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
