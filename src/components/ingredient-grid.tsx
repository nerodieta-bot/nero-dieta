'use client';
import { useState, useMemo } from 'react';
import type { Ingredient, IngredientStatus } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IngredientCard } from './ingredient-card';
import { Search, CheckCircle, AlertTriangle, XCircle, List } from 'lucide-react';
import { cn } from '@/lib/utils';

type IngredientGridProps = {
  ingredients: Ingredient[];
};

const filterOptions: {
  label: string;
  value: IngredientStatus | 'all';
  icon: React.ElementType;
  className: string;
}[] = [
  { label: 'Wszystkie', value: 'all', icon: List, className: 'hover:bg-secondary/50 focus:bg-secondary/50' },
  { label: 'Bezpieczne', value: 'safe', icon: CheckCircle, className: 'hover:bg-status-safe focus:bg-status-safe dark:hover:bg-status-safe/30 dark:focus:bg-status-safe/30 text-status-safe-foreground' },
  { label: 'Umiarkowane', value: 'warning', icon: AlertTriangle, className: 'hover:bg-status-warning focus:bg-status-warning dark:hover:bg-status-warning/30 dark:focus:bg-status-warning/30 text-status-warning-foreground' },
  { label: 'Zakazane', value: 'danger', icon: XCircle, className: 'hover:bg-status-danger focus:bg-status-danger dark:hover:bg-status-danger/30 dark:focus:bg-status-danger/30 text-status-danger-foreground' },
];

export function IngredientGrid({ ingredients }: IngredientGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<IngredientStatus | 'all'>('all');
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const filteredIngredients = useMemo(() => {
    return ingredients
      .filter((p) => filter === 'all' || p.status === filter)
      .filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a,b) => a.name.localeCompare(b.name));
  }, [ingredients, filter, searchQuery]);
  
  return (
    <div>
      <div className="flex flex-col gap-4 mb-8 sticky top-16 bg-background/80 backdrop-blur-sm z-10 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            id="search"
            placeholder="🔍 Szukaj składnika..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-lg shadow-sm"
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {filterOptions.map(option => (
            <Button
              key={option.value}
              variant="outline"
              onClick={() => setFilter(option.value)}
              className={cn(
                'rounded-full transition-all duration-200 border-2',
                filter === option.value
                  ? 'border-primary font-bold'
                  : 'border-transparent',
                option.className
              )}
            >
              <option.icon className="mr-2 h-4 w-4" />
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredIngredients.map((ingredient) => (
          <IngredientCard 
            key={ingredient.name} 
            ingredient={ingredient}
            isOpen={openCardId === ingredient.name}
            onToggle={() => setOpenCardId(prevId => prevId === ingredient.name ? null : ingredient.name)}
          />
        ))}
      </div>
      {filteredIngredients.length === 0 && (
        <div className="text-center col-span-full py-16">
          <p className="text-muted-foreground text-lg">Nie znaleziono składników pasujących do Twoich kryteriów.</p>
        </div>
      )}
    </div>
  );
}
