
import { notFound } from 'next/navigation';
import { ingredients } from '@/app/data/ingredients';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertCircle, Link as LinkIcon, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function generateStaticParams() {
  return ingredients.map((ingredient) => ({
    slug: ingredient.slug,
  }));
}

const statusConfig = {
  safe: {
    className: 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    textColor: 'text-green-800 dark:text-green-300',
    badgeClass: 'bg-green-600 text-white',
  },
  warning: {
    className: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
    textColor: 'text-yellow-800 dark:text-yellow-300',
    badgeClass: 'bg-yellow-500 text-yellow-900',
  },
  danger: {
    className: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    textColor: 'text-red-800 dark:text-red-300',
    badgeClass: 'bg-red-600 text-white',
  },
};

export default function IngredientPage({ params }: { params: { slug: string } }) {
  const ingredient = ingredients.find((p) => p.slug === params.slug);

  if (!ingredient) {
    notFound();
  }

  const config = statusConfig[ingredient.status];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <Button asChild variant="outline">
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Wróć do bazy wiedzy
                </Link>
            </Button>
        </div>

        <Card className={cn('overflow-hidden', config.className)}>
          <CardHeader className="text-center items-center p-8 bg-background/30">
            <div className="text-7xl mb-4">{ingredient.icon}</div>
            <CardTitle className={cn('text-4xl font-bold font-headline', config.textColor)}>
              {ingredient.name}
            </CardTitle>
            <CardDescription className={cn('font-semibold text-lg', config.textColor, 'opacity-80')}>
              {ingredient.category}
            </CardDescription>
            <div className={cn(
                'mt-4 px-4 py-1 rounded-full text-sm font-bold',
                config.badgeClass
            )}>
              {ingredient.status === 'safe' && '✅ Bezpieczny'}
              {ingredient.status === 'warning' && '⚠️ Umiarkowany'}
              {ingredient.status === 'danger' && '❌ Zakazany'}
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div>
              <h3 className={cn("text-xl font-bold mb-2", config.textColor)}>Opis</h3>
              <p className={cn('text-base', config.textColor, 'opacity-90')}>{ingredient.desc}</p>
            </div>

            {ingredient.WARNING && (
              <div className="mb-4 p-4 rounded-lg bg-red-500/20 text-red-900 dark:text-red-200 border border-red-500/30 flex items-start text-left">
                <AlertCircle className="w-6 h-6 mr-4 flex-shrink-0 mt-0.5" />
                <div className="flex-grow">
                    <h4 className="font-bold text-lg mb-1">Uwaga!</h4>
                    <span className="text-base">{ingredient.WARNING}</span>
                </div>
              </div>
            )}
            
            <div className={cn("p-6 rounded-lg bg-background/40 border", config.className, "border-opacity-30")}>
                <h3 className={cn("text-xl font-bold mb-4", config.textColor)}>Szczegóły</h3>
                <div className="space-y-3 text-base">
                {ingredient.portion && (
                    <p><strong className={cn(config.textColor)}>Sugerowana porcja:</strong> {ingredient.portion}</p>
                )}
                {ingredient.prep && (
                    <p><strong className={cn(config.textColor)}>Sposób przygotowania:</strong> {ingredient.prep}</p>
                )}
                {ingredient.source && (
                    <p className="flex items-center gap-2">
                    <strong className={cn(config.textColor)}>Źródło naukowe:</strong> 
                    <a href={ingredient.source} target="_blank" rel="noopener noreferrer" className={cn("inline-flex items-center gap-1 hover:underline font-semibold", config.textColor, 'opacity-90')}>
                        <span>Dowiedz się więcej</span>
                        <LinkIcon className="w-4 h-4" />
                    </a>
                    </p>
                )}
                </div>
            </div>

          </CardContent>
          <CardFooter className={cn("p-8 bg-background/30", config.className, "border-opacity-30")}>
            <div className="text-center w-full">
                <p className={cn('italic text-lg', config.textColor)}>
                <strong className={cn(config.textColor)}>Nero mówi:</strong> "{ingredient.nero}"
                </p>
            </div>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const ingredient = ingredients.find(p => p.slug === params.slug);

  if (!ingredient) {
    return {
      title: 'Nie znaleziono składnika | Dieta Nero',
      description: 'Strona nie została znaleziona.',
    };
  }

  const statusMap = {
    safe: 'jest bezpieczna',
    warning: 'jest warunkowo bezpieczna',
    danger: 'jest niebezpieczna',
  }

  return {
    title: `Czy pies może jeść ${ingredient.name}? | Dieta Nero`,
    description: `Sprawdź, czy ${ingredient.name.toLowerCase()} ${statusMap[ingredient.status]} dla psa. Poznaj właściwości, dawkowanie i opinię Nero.`,
  };
}
