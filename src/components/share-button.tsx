'use client';

import { useToast } from '@/hooks/use-toast';
import { Button, type ButtonProps } from './ui/button';
import { Share2 } from 'lucide-react';
import type { Ingredient } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ShareButtonProps extends ButtonProps {
  ingredient: Ingredient;
  className?: string;
  variant?: ButtonProps['variant'];
  label?: string;
}

export function ShareButton({
  ingredient,
  className,
  variant = 'outline',
  label = 'Udostępnij',
  ...props
}: ShareButtonProps) {
  const { toast } = useToast();

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card navigation if inside a link/card
    e.preventDefault();

    const shareUrl = `${window.location.origin}/skladnik/${ingredient.slug}`;
    const shareData = {
      title: `Dieta Nero: ${ingredient.name}`,
      text: `Sprawdź, czy ${ingredient.name.toLowerCase()} jest bezpieczny dla psa.`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: 'Link skopiowany!',
          description: 'Możesz teraz wkleić go i udostępnić.',
        });
      }
    } catch (error) {
       if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled the share action, do nothing.
      } else {
        console.error('Błąd udostępniania, kopiowanie linku:', error);
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast({
                title: 'Link skopiowany do schowka',
                description: 'Nie udało się otworzyć okna udostępniania, ale link jest w schowku.',
            });
        } catch (copyError) {
            toast({
                title: 'Błąd udostępniania',
                description: 'Nie udało się ani udostępnić, ani skopiować linku.',
                variant: 'destructive',
            });
        }
      }
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleShare}
      className={className}
      aria-label={`Udostępnij informacje o ${ingredient.name}`}
      {...props}
    >
      <Share2 className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
