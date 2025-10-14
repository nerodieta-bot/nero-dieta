
'use client';

import { LabelScanner } from "@/components/label-scanner";
import { ScanLine, Loader2 } from "lucide-react";
import { useUser } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ScanPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login?redirect=/scan');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Weryfikuję dostęp...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
            <ScanLine className="mx-auto w-12 h-12 text-accent mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-2">Skaner Etykiet</h1>
            <p className="text-muted-foreground text-lg">Zrób zdjęcie składu karmy, a Nero pomoże Ci go przeanalizować.</p>
        </div>
        <LabelScanner />
      </div>
    </div>
  );
}
