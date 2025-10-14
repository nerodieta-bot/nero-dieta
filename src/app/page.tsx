'use client';

import { HeroSection } from '@/components/hero-section';
import { IngredientGrid } from '@/components/ingredient-grid';
import { ingredients } from '@/app/data/ingredients';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Unlock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const [ingredientsToShow, setIngredientsToShow] = useState<typeof ingredients>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (user) {
        // Zalogowany użytkownik widzi wszystko, posortowane
        const sortedIngredients = [...ingredients].sort((a, b) => a.name.localeCompare(b.name));
        setIngredientsToShow(sortedIngredients);
      } else {
        // Niezalogowany użytkownik widzi 4 bezpieczne, 4 umiarkowane i 4 zakazane
        const shuffle = (arr: typeof ingredients) => [...arr].sort(() => 0.5 - Math.random());

        const safe = shuffle(ingredients.filter(i => i.status === 'safe')).slice(0, 4);
        const warning = shuffle(ingredients.filter(i => i.status === 'warning')).slice(0, 4);
        const danger = shuffle(ingredients.filter(i => i.status === 'danger')).slice(0, 4);
        
        const combined = shuffle([...safe, ...warning, ...danger]);
        setIngredientsToShow(combined);
      }
    }
  }, [user, isClient]);

  if (isUserLoading || !isClient) {
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
      <IngredientGrid ingredients={ingredientsToShow} isUserLoggedIn={!!user} />

      {!user && (
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
