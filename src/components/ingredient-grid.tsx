'use client';
import { useState, useMemo } from 'react';
import type { Ingredient, IngredientStatus } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IngredientCard } from './ingredient-card';
import { Search, CheckCircle, AlertTriangle, XCircle, List, ChevronsUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils';

type IngredientGridProps = {
  ingredients: Ingredient[];
  isUserLoggedIn: boolean;
  userProfile: any;
};

const filterOptions: {
  label: string;
  value: IngredientStatus | 'all';
  icon: React.ElementType;
  baseClass: string;
  hoverClass: string;
  activeClass: string;
}[] = [
  { label: 'Wszystkie', value: 'all', icon: List, baseClass: 'bg-secondary text-secondary-foreground', hoverClass: 'hover:bg-secondary/80', activeClass: 'ring-primary' },
  { label: 'Bezpieczne', value: 'safe', icon: CheckCircle, baseClass: 'bg-green-600 text-white', hoverClass: 'hover:bg-green-700', activeClass: 'ring-green-700' },
  { label: 'Umiarkowane', value: 'warning', icon: AlertTriangle, baseClass: 'bg-yellow-500 text-yellow-900', hoverClass: 'hover:bg-yellow-600', activeClass: 'ring-yellow-600' },
  { label: 'Zakazane', value: 'danger', icon: XCircle, baseClass: 'bg-red-600 text-white', hoverClass: 'hover:bg-red-700', activeClass: 'ring-red-700' },
];

export function IngredientGrid({ ingredients, isUserLoggedIn, userProfile }: IngredientGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<IngredientStatus | 'all'>('all');

  const filteredIngredients = useMemo(() => {
    return ingredients
      .filter((p) => filter === 'all' || p.status === filter)
      .filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (isUserLoggedIn && p.desc.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [ingredients, filter, searchQuery, isUserLoggedIn]);
  
  const handleFilterChange = (value: IngredientStatus | 'all') => {
    setFilter(value);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8 sticky top-[63px] md:top-16 bg-background/80 backdrop-blur-sm z-10 py-4">
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
        
        {/* Desktop Filters */}
        <div className="hidden md:flex items-center justify-center gap-4 pt-4">
          {filterOptions.map(option => (
            <Button
              key={option.value}
              variant="default"
              onClick={() => handleFilterChange(option.value)}
              className={cn(
                'transition-all duration-200 shadow-sm border-0 w-36',
                'focus-visible:ring-2 focus-visible:ring-offset-2',
                option.baseClass,
                option.hoverClass,
                filter === option.value
                  ? `ring-2 ring-offset-2 ${option.activeClass}`
                  : ''
              )}
            >
              <option.icon className="mr-2 h-4 w-4" />
              {option.label}
            </Button>
          ))}
        </div>
        
        {/* Mobile Filter */}
        <div className='md:hidden'>
            <Select value={filter} onValueChange={(value: IngredientStatus | 'all') => handleFilterChange(value)}>
              <SelectTrigger className="w-full text-base py-6">
                 <div className="flex items-center gap-2">
                    <ChevronsUpDown className="h-5 w-5 text-muted-foreground" />
                    <span>Filtruj: <span className='font-bold'>{filterOptions.find(o => o.value === filter)?.label}</span></span>
                 </div>
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-base py-2">
                     <div className="flex items-center gap-2">
                        <option.icon className="h-5 w-5" />
                        {option.label}
                      </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredIngredients.map((ingredient) => (
          <IngredientCard 
            key={ingredient.slug} 
            ingredient={ingredient}
            isUserLoggedIn={isUserLoggedIn}
            userProfile={userProfile}
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
