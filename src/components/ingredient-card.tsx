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
import { ChevronDown, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';

type IngredientCardProps = {
  ingredient: Ingredient;
  isOpen: boolean;
  onToggle: () => void;
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

export function IngredientCard({ ingredient, isOpen, onToggle }: IngredientCardProps) {
  const config = statusConfig[ingredient.status];

  return (
    <Card
      className={cn(
        'flex flex-col cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1',
        config.className,
        isOpen && 'shadow-xl'
      )}
      onClick={onToggle}
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
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="overflow-hidden">
            <p className={cn('text-sm mb-4', config.textColor, 'opacity-90')}>{ingredient.desc}</p>
            {ingredient.WARNING && (
              <Badge variant="destructive" className="mb-4 whitespace-normal text-center bg-red-500/20 text-red-900 dark:text-red-200 border-red-500/30">
                <AlertCircle className="w-4 h-4 mr-2" />
                {ingredient.WARNING}
              </Badge>
            )}
            <div className="text-sm space-y-2">
              {ingredient.portion && (
                 <p><strong className={cn(config.textColor)}>Porcja:</strong> {ingredient.portion}</p>
              )}
               {ingredient.prep && (
                 <p><strong className={cn(config.textColor)}>Przygotowanie:</strong> {ingredient.prep}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-4 border-t border-black/10 dark:border-white/10">
        <div className="text-center w-full">
           <p className={cn('italic text-sm', config.textColor)}>
            <strong className={cn(config.textColor)}>Nero:</strong> "{ingredient.nero}"
          </p>
        </div>
        <div className="flex justify-center items-center text-muted-foreground w-full">
          <span className="text-xs mr-2">Pokaż szczegóły</span>
          <ChevronDown
            className={cn(
              'h-5 w-5 transition-transform duration-300',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
