
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
    card: 'bg-[#e9f9ed] dark:bg-green-950/30 border-green-200 dark:border-green-800/50',
    title: 'text-green-800 dark:text-green-300',
    description: 'text-green-700 dark:text-green-400',
    badge: 'bg-green-600 text-white',
    warningBox: 'border border-emerald-300 bg-[#f0fff4] dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300',
    warningTitle: 'text-emerald-900 dark:text-emerald-200',
    detailsBox: 'bg-[#f4fbf5] dark:bg-green-950/20 border border-[#b7e2c2] dark:border-green-800/40',
    detailsStrong: 'text-green-800 dark:text-green-300',
    detailsLink: 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300',
    quoteBorder: 'border-l-4 border-green-500',
    quoteBg: 'bg-[#f0fff4] dark:bg-green-950/20',
    quoteText: 'text-green-900/80 dark:text-green-200/80',
    quoteAuthor: 'text-green-900 dark:text-green-200 font-bold',
  },
  warning: {
    card: 'bg-[#fff5e5] dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/50',
    title: 'text-amber-800 dark:text-amber-300',
    description: 'text-amber-700 dark:text-amber-400',
    badge: 'bg-amber-500 text-amber-950',
    warningBox: 'border border-amber-400 bg-[#fff7ed] dark:bg-amber-950/20 text-amber-800 dark:text-amber-300',
    warningTitle: 'text-amber-900 dark:text-amber-200',
    detailsBox: 'bg-[#fff9f0] dark:bg-amber-950/20 border border-[#fbd38d] dark:border-amber-800/40',
    detailsStrong: 'text-amber-800 dark:text-amber-300',
    detailsLink: 'text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300',
    quoteBorder: 'border-l-4 border-amber-500',
    quoteBg: 'bg-[#fffdf5] dark:bg-amber-950/20',
    quoteText: 'text-amber-900/80 dark:text-amber-200/80',
    quoteAuthor: 'text-amber-900 dark:text-amber-200 font-bold',
  },
  danger: {
    card: 'bg-[#ffecec] dark:bg-red-950/30 border-red-300 dark:border-red-800/50',
    title: 'text-red-800 dark:text-red-300',
    description: 'text-red-700 dark:text-red-400',
    badge: 'bg-red-600 text-white',
    warningBox: 'border border-red-400 bg-[#fff2f2] dark:bg-red-950/20 text-red-800 dark:text-red-300',
    warningTitle: 'text-red-900 dark:text-red-200',
    detailsBox: 'bg-[#fff6f6] dark:bg-red-950/20 border border-[#fecaca] dark:border-red-800/40',
    detailsStrong: 'text-red-800 dark:text-red-300',
    detailsLink: 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300',
    quoteBorder: 'border-l-4 border-red-500',
    quoteBg: 'bg-[#fff5f5] dark:bg-red-950/20',
    quoteText: 'text-red-900/80 dark:text-red-200/80',
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

        <Card className={cn('overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5', config.card)}>
          <CardHeader className="text-center items-center p-8">
            <div className="text-7xl mb-4">{ingredient.icon}</div>
            <CardTitle className={cn('text-4xl font-bold font-headline', config.title)}>
              {ingredient.name}
            </CardTitle>
            <CardDescription className={cn('font-semibold text-lg', config.description)}>
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
              <p className={cn('text-base leading-relaxed', config.card)}>{ingredient.desc}</p>
            </div>

            {ingredient.WARNING && (
              <div className={cn("p-4 rounded-lg flex items-start text-left", config.warningBox)}>
                <AlertCircle className="w-8 h-8 mr-4 flex-shrink-0 mt-0.5" />
                <div className="flex-grow">
                    <h4 className={cn("font-bold text-lg mb-1", config.warningTitle)}>Uwaga!</h4>
                    <span className="text-base">{ingredient.WARNING}</span>
                </div>
              </div>
            )}
            
            <div className={cn("p-6 rounded-lg", config.detailsBox)}>
                <h3 className={cn("text-xl font-bold mb-4", config.title)}>Szczegóły</h3>
                <div className="space-y-3 text-base">
                {ingredient.portion && (
                    <p><strong className={cn(config.detailsStrong)}>Sugerowana porcja:</strong> {ingredient.portion}</p>
                )}
                {ingredient.prep && (
                    <p><strong className={cn(config.detailsStrong)}>Sposób przygotowania:</strong> {ingredient.prep}</p>
                )}
                {ingredient.source && (
                    <div className="flex items-center gap-2 pt-2 border-t border-black/10 dark:border-white/10">
                        <strong className={cn(config.detailsStrong)}>Źródło naukowe:</strong> 
                        <a 
                            href={ingredient.source} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={cn(
                                "inline-flex items-center gap-1.5 font-semibold underline decoration-dotted underline-offset-4 decoration-current/50 transition-colors", 
                                config.detailsLink
                            )}
                        >
                            <span>Dowiedz się więcej</span>
                            <LinkIcon className="w-4 h-4" />
                        </a>
                    </div>
                )}
                </div>
            </div>

          </CardContent>
          <CardFooter className="p-6 md:p-8">
             <div className={cn("w-full p-5 rounded-lg", config.quoteBorder, config.quoteBg)}>
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

  const statusMap: Record<string, string> = {
    safe: 'jest bezpieczna',
    warning: 'jest warunkowo bezpieczna',
    danger: 'jest niebezpieczna',
  }

  return {
    title: `Czy pies może jeść ${ingredient.name}? | Dieta Nero`,
    description: `Sprawdź, czy ${ingredient.name.toLowerCase()} ${statusMap[ingredient.status]} dla psa. Poznaj właściwości, dawkowanie i opinię Nero.`,
  };
}
