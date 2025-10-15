'use client';

import { MealPlanForm } from '@/components/meal-plan-form';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';

const FREE_GENERATIONS_LIMIT = 3;

export default function MealPlanPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login?redirect=/plan');
    }
  }, [user, isUserLoading, router]);

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading || !user) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Weryfikuję dostęp...</p>
        </div>
      </div>
    );
  }

  const generationsCount = userProfile?.mealPlanGenerations ?? 0;
  const generationsLeft = Math.max(0, FREE_GENERATIONS_LIMIT - generationsCount);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
            <Lightbulb className="mx-auto w-12 h-12 text-accent mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-2">Kreator Posiłków</h1>
            <p className="text-muted-foreground text-lg">Wygeneruj zbilansowany plan żywieniowy dla swojego psa z pomocą Nero.</p>
        </div>
        <MealPlanForm generationsLeft={generationsLeft} />
      </div>
    </div>
  );
}
