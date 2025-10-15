'use client';

import { HeroSection } from '@/components/hero-section';
import { IngredientGrid } from '@/components/ingredient-grid';
import { ingredients } from '@/app/data/ingredients';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Unlock } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';

// Funkcja pomocnicza do tasowania tablicy - stabilne losowanie na podstawie dnia
function deterministicShuffle(array: any[], seed: number) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    const random = () => {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    while (0 !== currentIndex) {
        randomIndex = Math.floor(random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

export default function Home() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const getIngredientsToShow = () => {
    if (user) {
      // Zalogowany użytkownik widzi wszystko, posortowane
      return [...ingredients].sort((a, b) => a.name.localeCompare(b.name));
    }
    // Niezalogowany użytkownik widzi 12 losowych bezpiecznych/warunkowych składników
    // Używamy daty jako seed, aby losowanie było takie samo przez cały dzień
    const guestViewableIngredients = ingredients.filter(i => i.status === 'safe' || i.status === 'warning');
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const shuffled = deterministicShuffle([...guestViewableIngredients], seed);
    return shuffled.slice(0, 12);
  };

  const ingredientsToShow = getIngredientsToShow();
  const isLoading = isUserLoading || (user && isProfileLoading);

  if (isLoading) {
     return (
      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Ładowanie danych...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <IngredientGrid 
        ingredients={ingredientsToShow} 
        isUserLoggedIn={!!user}
        userProfile={userProfile}
      />

      {!user && !isUserLoading && (
        <div className="mt-12 text-center bg-card border rounded-lg p-8 max-w-3xl mx-auto">
            <Unlock className="mx-auto w-12 h-12 text-accent mb-4" />
            <h2 className="text-2xl font-bold font-headline text-primary mb-2">To tylko przedsmak!</h2>
            <p className="text-muted-foreground mb-6">
                Zaloguj się, aby uzyskać dostęp do pełnej bazy ponad {ingredients.length} składników, nielimitowanego kreatora posiłków i skanera etykiet.
            </p>
            <Button asChild size="lg">
                <Link href="/login">Dołącz za darmo i odblokuj wszystko</Link>
            </Button>
        </div>
      )}
    </div>
  );
}
