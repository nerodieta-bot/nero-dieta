
import { notFound } from 'next/navigation';
import { ingredients } from '@/app/data/ingredients';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertCircle, Link as LinkIcon, Home, MessageSquareQuote } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function generateStaticParams() {
  return ingredients.map((ingredient) => ({
    slug: ingredient.slug,
  }));
}

const statusConfig = {
  safe: {
    card: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/50',
    title: 'text-green-800 dark:text-green-300',
    description: 'text-green-700 dark:text-green-400',
    badge: 'bg-green-600 text-white',
    content: 'text-green-900/90 dark:text-green-200/90',
    detailsBox: 'bg-green-100/70 dark:bg-green-900/20 border-green-200/80 dark:border-green-800/40',
    detailsStrong: 'text-green-800 dark:text-green-300',
    detailsLink: 'text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300',
    quoteBorder: 'border-green-500/80',
    quoteBg: 'bg-green-100/60 dark:bg-green-950/20',
    quoteText: 'text-green-800/90 dark:text-green-300/90',
    quoteAuthor: 'text-green-900 dark:text-green-200 font-bold',
  },
  warning: {
    card: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-800/50',
    title: 'text-yellow-800 dark:text-yellow-300',
    description: 'text-yellow-700 dark:text-yellow-400',
    badge: 'bg-yellow-500 text-yellow-950',
    content: 'text-yellow-900/90 dark:text-yellow-200/90',
    detailsBox: 'bg-yellow-100/70 dark:bg-yellow-900/20 border-yellow-200/80 dark:border-yellow-800/40',
    detailsStrong: 'text-yellow-800 dark:text-yellow-300',
    detailsLink: 'text-yellow-700 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300',
    quoteBorder: 'border-yellow-500/80',
    quoteBg: 'bg-yellow-100/60 dark:bg-yellow-950/20',
    quoteText: 'text-yellow-800/90 dark:text-yellow-300/90',
    quoteAuthor: 'text-yellow-900 dark:text-yellow-200 font-bold',
  },
  danger: {
    card: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50',
    title: 'text-red-800 dark:text-red-300',
    description: 'text-red-700 dark:text-red-400',
    badge: 'bg-red-600 text-white',
    content: 'text-red-900/90 dark:text-red-200/90',
    detailsBox: 'bg-red-100/70 dark:bg-red-900/20 border-red-200/80 dark:border-red-800/40',
    detailsStrong: 'text-red-800 dark:text-red-300',
    detailsLink: 'text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300',
    quoteBorder: 'border-red-500/80',
    quoteBg: 'bg-red-100/60 dark:bg-red-950/20',
    quoteText: 'text-red-800/90 dark:text-red-300/90',
    quoteAuthor: 'text-red-900 dark:text-red-200 font-bold',
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

        <Card className={cn('overflow-hidden transition-shadow duration-300 hover:shadow-2xl', config.card)}>
          <CardHeader className="text-center items-center p-8 bg-background/30">
            <div className="text-7xl mb-4">{ingredient.icon}</div>
            <CardTitle className={cn('text-4xl font-bold font-headline', config.title)}>
              {ingredient.name}
            </CardTitle>
            <CardDescription className={cn('font-semibold text-lg', config.description, 'opacity-80')}>
              {ingredient.category}
            </CardDescription>
            <div className={cn(
                'mt-4 px-4 py-1 rounded-full text-sm font-bold',
                config.badge
            )}>
              {ingredient.status === 'safe' && '✅ Bezpieczny'}
              {ingredient.status === 'warning' && '⚠️ Umiarkowany'}
              {ingredient.status === 'danger' && '❌ Zakazany'}
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className={cn("text-xl font-bold mb-2", config.title)}>Opis</h3>
              <p className={cn('text-base leading-relaxed', config.content)}>{ingredient.desc}</p>
            </div>

            {ingredient.WARNING && (
              <div className="mb-4 p-4 rounded-lg border-l-4 border-red-500 bg-transparent flex items-start text-left">
                <AlertCircle className="w-8 h-8 mr-4 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <div className="flex-grow">
                    <h4 className="font-bold text-lg mb-1 text-red-700 dark:text-red-300">Uwaga!</h4>
                    <span className="text-base text-red-700 dark:text-red-300">{ingredient.WARNING}</span>
                </div>
              </div>
            )}
            
            <div className={cn("p-6 rounded-lg border", config.detailsBox)}>
                <h3 className={cn("text-xl font-bold mb-4", config.title)}>Szczegóły</h3>
                <div className="space-y-3 text-base">
                {ingredient.portion && (
                    <p className={config.content}><strong className={cn(config.detailsStrong)}>Sugerowana porcja:</strong> {ingredient.portion}</p>
                )}
                {ingredient.prep && (
                    <p className={config.content}><strong className={cn(config.detailsStrong)}>Sposób przygotowania:</strong> {ingredient.prep}</p>
                )}
                {ingredient.source && (
                    <div className="flex items-center gap-2 pt-2 border-t border-black/10 dark:border-white/10">
                        <strong className={cn(config.detailsStrong)}>Źródło naukowe:</strong> 
                        <a 
                            href={ingredient.source} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={cn(
                                "inline-flex items-center gap-1.5 text-lg font-bold underline decoration-dotted underline-offset-4 decoration-2 decoration-current/50 transition-all hover:decoration-current/100 hover:text-opacity-100", 
                                config.detailsLink
                            )}
                        >
                            <span>Dowiedz się więcej</span>
                            <LinkIcon className="w-5 h-5" />
                        </a>
                    </div>
                )}
                </div>
            </div>

          </CardContent>
          <CardFooter className={cn("p-6 md:p-8 bg-background/30", config.card, "border-t border-opacity-30")}>
             <div className={cn("w-full p-5 rounded-lg border-l-4", config.quoteBorder, config.quoteBg)}>
                <MessageSquareQuote className={cn("w-6 h-6 mb-2", config.description)} />
                <blockquote className={cn("italic text-lg leading-relaxed", config.quoteText)}>
                    "{ingredient.nero}"
                </blockquote>
                 <p className={cn("text-right mt-3 text-sm font-headline", config.quoteAuthor)}>- Nero</p>
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
