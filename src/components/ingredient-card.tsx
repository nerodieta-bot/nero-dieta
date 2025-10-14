
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Ingredient } from '@/lib/types';
import { ChevronDown, AlertCircle, Link as LinkIcon, Lock } from 'lucide-react';
import { Badge } from './ui/badge';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type IngredientCardProps = {
  ingredient: Ingredient;
  isOpen: boolean;
  onToggle: () => void;
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

export function IngredientCard({ ingredient, isOpen, onToggle, isUserLoggedIn }: IngredientCardProps) {
  const config = statusConfig[ingredient.status];

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent toggle when clicking on a link or if user is not logged in
    if ((e.target as HTMLElement).closest('a') || !isUserLoggedIn) {
      return;
    }
    onToggle();
  };

  const DetailsButton = () => {
    if (!isUserLoggedIn) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex justify-center items-center text-muted-foreground w-full cursor-not-allowed">
                    <Lock className="h-4 w-4 mr-2"/>
                    <span className="text-xs mr-2">Pokaż szczegóły</span>
                    <ChevronDown className="h-5 w-5" />
                </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zaloguj się, aby zobaczyć szczegóły i komentarz Nero!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return (
        <div className="flex justify-center items-center text-accent w-full">
            <span className="text-xs mr-2">Pokaż szczegóły</span>
            <ChevronDown
              className={cn(
                'h-5 w-5 transition-transform duration-300',
                isOpen && 'rotate-180'
              )}
            />
          </div>
    )
  }

  return (
    <Card
      className={cn(
        'flex flex-col transition-all duration-300 ease-in-out',
        !isUserLoggedIn ? 'hover:shadow-md' : 'hover:shadow-lg hover:-translate-y-1',
        config.className,
        isOpen && 'shadow-xl'
      )}
    >
      <div 
        className="flex-grow flex flex-col" 
        onClick={handleCardClick}
        style={{cursor: isUserLoggedIn ? 'pointer' : 'default'}}
    >
        <CardHeader className="text-center items-center">
          <div className="text-4xl mb-2">{ingredient.icon}</div>
          <CardTitle className={cn('text-xl font-bold font-headline', config.textColor)}>
            {ingredient.name}
          </CardTitle>
          <CardDescription className={cn('font-semibold', config.textColor, 'opacity-80')}>
            {ingredient.category}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div
            className={cn(
              'grid transition-all duration-500 ease-in-out',
              isOpen && isUserLoggedIn ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            )}
          >
            <div className="overflow-hidden">
              <p className={cn('text-sm mb-4', config.textColor, 'opacity-90')}>{ingredient.desc}</p>
              {ingredient.WARNING && (
                <div className="mb-4 p-3 rounded-md bg-red-500/20 text-red-900 dark:text-red-200 border border-red-500/30 flex items-start text-left">
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="flex-grow text-sm">{ingredient.WARNING}</span>
                </div>
              )}
              <div className="text-sm space-y-2">
                {ingredient.portion && (
                  <p><strong className={cn(config.textColor)}>Porcja:</strong> {ingredient.portion}</p>
                )}
                {ingredient.prep && (
                  <p><strong className={cn(config.textColor)}>Przygotowanie:</strong> {ingredient.prep}</p>
                )}
                {ingredient.source && (
                  <p className="flex items-center gap-2">
                    <strong className={cn(config.textColor)}>Źródło:</strong> 
                    <Link href={ingredient.source} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-1 hover:underline", config.textColor, 'opacity-90')}>
                      <span>Więcej info</span>
                      <LinkIcon className="w-3 h-3" />
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-4 border-t border-black/10 dark:border-white/10 mt-auto">
          {isOpen && isUserLoggedIn && (
            <div className="text-center w-full">
                <p className={cn('italic text-sm', config.textColor)}>
                <strong className={cn(config.textColor)}>Nero:</strong> "{ingredient.nero}"
                </p>
            </div>
          )}
          <DetailsButton />
        </CardFooter>
      </div>
    </Card>
  );
}
