
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { Ingredient } from '@/lib/types';
import { Lock, ArrowRight, PawPrint, Gem } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/provider';
import { loginPrompts } from '@/app/data/login-prompts';
import { incrementIngredientViewCount } from '@/app/actions/user-actions';

type IngredientCardProps = {
  ingredient: Ingredient;
  userProfile?: any;
};

const GUEST_CLICK_LIMIT = 5;
const LOGGED_IN_CLICK_LIMIT = 5;

const statusConfig = {
  safe: {
    className: 'bg-status-safe dark:bg-status-safe/50 border-green-200 dark:border-green-800',
    textColor: 'text-status-safe-foreground',
  },
  warning: {
    className: 'bg-status-warning dark:bg-status-warning/50 border-yellow-200 dark:border-yellow-800',
    textColor: 'text-status-warning-foreground',
  },
  danger: {
    className: 'bg-status-danger dark:bg-status-danger/50 border-red-200 dark:border-red-800',
    textColor: 'text-status-danger-foreground',
  },
};

export function IngredientCard({ ingredient, userProfile }: IngredientCardProps) {
  const { user, isUserLoading } = useUser();
  const config = statusConfig[ingredient.status];
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [randomPrompt, setRandomPrompt] = useState(loginPrompts[0]);
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isUserLoading) return;

    if (user) {
      // Logic for logged-in users
      if (userProfile?.plan === 'premium') {
        router.push(`/skladnik/${ingredient.slug}`);
        return;
      }
      
      const userClicks = userProfile?.ingredientViewCount ?? 0;
      if (userClicks < LOGGED_IN_CLICK_LIMIT) {
        incrementIngredientViewCount(); // Server Action
        router.push(`/skladnik/${ingredient.slug}`);
      } else {
        setShowPremiumModal(true);
      }
    } else {
      // Logic for guest users (client-side only)
      const guestClicksStr = sessionStorage.getItem('guestClicks') || '0';
      const guestClicks = parseInt(guestClicksStr, 10);
      
      if (guestClicks < GUEST_CLICK_LIMIT) {
        sessionStorage.setItem('guestClicks', (guestClicks + 1).toString());
        router.push(`/skladnik/${ingredient.slug}`);
      } else {
        const randomIndex = Math.floor(Math.random() * loginPrompts.length);
        setRandomPrompt(loginPrompts[randomIndex]);
        setShowLoginModal(true);
      }
    }
  };

  return (
    <>
      <Card
        className={cn(
          'flex flex-col transition-all duration-300 ease-in-out',
          'hover:shadow-xl hover:-translate-y-1 cursor-pointer group',
          config.className
        )}
        onClick={handleCardClick}
      >
        <div className="flex-grow flex flex-col">
          <CardHeader className="text-center items-center">
            <div className="text-5xl mb-2 transition-transform duration-300 group-hover:scale-110">{ingredient.icon}</div>
            <CardTitle className={cn('text-xl font-bold font-headline', config.textColor)}>
              {ingredient.name}
            </CardTitle>
            <CardDescription className={cn('font-semibold', config.textColor, 'opacity-80')}>
              {ingredient.category}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
             <p className={cn('text-sm text-center', config.textColor, 'opacity-90 line-clamp-3')}>{ingredient.desc}</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4 border-t border-black/10 dark:border-white/10 mt-auto">
             <div className="flex justify-center items-center text-accent w-full font-semibold">
                <Button variant="link" className={cn(config.textColor, 'font-semibold')}>
                    Zobacz szczegóły
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>
          </CardFooter>
        </div>
      </Card>
      
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <div className="text-center">
              <PawPrint className="mx-auto w-16 h-16 text-accent mb-4" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold font-headline text-primary">
              {randomPrompt.title}
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-base">
              {randomPrompt.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
             <Button asChild>
                <Link href="/login">Dołącz do Stada!</Link>
            </Button>
            <Button variant="outline" onClick={() => setShowLoginModal(false)}>Może później</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
        <DialogContent>
          <DialogHeader>
            <div className="text-center">
              <Gem className="mx-auto w-16 h-16 text-accent mb-4" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold font-headline text-primary">
              Apetyt rośnie w miarę jedzenia!
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-base">
              Nero zauważył, że masz ogromny apetyt na wiedzę! Wykorzystałeś darmowy limit odsłon. Aby kontynuować bez ograniczeń, odblokuj plan Premium.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
             <Button asChild>
                <Link href="/pricing">Zobacz Plany Premium</Link>
            </Button>
            <Button variant="outline" onClick={() => setShowPremiumModal(false)}>Zamknij</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
