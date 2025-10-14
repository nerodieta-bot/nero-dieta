
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import type { Ingredient } from '@/lib/types';
import { Lock, ArrowRight, PawPrint } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { loginPrompts } from '@/app/data/login-prompts';

type IngredientCardProps = {
  ingredient: Ingredient;
  isUserLoggedIn: boolean;
};

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

export function IngredientCard({ ingredient, isUserLoggedIn }: IngredientCardProps) {
  const config = statusConfig[ingredient.status];
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [randomPrompt, setRandomPrompt] = useState(loginPrompts[0]);
  const router = useRouter();

  const handleCardClick = () => {
    if (isUserLoggedIn) {
      router.push(`/skladnik/${ingredient.slug}`);
    } else {
      const randomIndex = Math.floor(Math.random() * loginPrompts.length);
      setRandomPrompt(loginPrompts[randomIndex]);
      setShowLoginModal(true);
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
                {!isUserLoggedIn ? (
                    <>
                        <Lock className="h-4 w-4 mr-2"/>
                        <span className="text-xs">Zaloguj się, by zobaczyć</span>
                    </>
                ) : (
                    <>
                        <span className="text-xs mr-2">Zobacz szczegóły</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                )}
            </div>
          </CardFooter>
        </div>
      </Card>
      
      <AlertDialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <AlertDialogContent className="shadow-2xl border-accent/20 bg-background/95 backdrop-blur-lg rounded-2xl ring-1 ring-black/5">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 bg-accent/30 rounded-full blur-xl animate-pulse"></div>
                <PawPrint className="relative w-20 h-20 text-accent animate-pulse" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-3xl font-bold font-headline text-primary">
              {randomPrompt.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-foreground/80 text-lg pt-2 leading-relaxed">
              <span className="italic">{randomPrompt.message}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-3 pt-4">
            <AlertDialogAction asChild className='w-full text-lg py-6'>
              <Link href="/login?redirect=/">Dołącz do Stada!</Link>
            </AlertDialogAction>
            <AlertDialogCancel asChild className='w-full text-lg py-6'>
              <Button variant="ghost">Może później</Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
