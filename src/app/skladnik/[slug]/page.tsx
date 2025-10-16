
import { notFound } from 'next/navigation';
import { ingredients } from '@/app/data/ingredients';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertCircle, Link as LinkIcon, Home, PawPrint } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShareButton } from '@/components/share-button';


export async function generateStaticParams() {
  return ingredients.map((ingredient) => ({
    slug: ingredient.slug,
  }));
}

const statusConfig = {
  safe: {
    card: 'bg-status-safe dark:bg-green-950/30 border-green-200 dark:border-green-800/50',
    title: 'text-green-800 dark:text-green-300',
    description: 'text-green-700 dark:text-green-400',
    badge: 'bg-green-600 text-white',
    warningBox: 'border border-emerald-300 bg-[#f0fff4] dark:bg-emerald-950/20',
    detailsBox: 'bg-[#f4fbf5] dark:bg-green-950/20 border border-[#b7e2c2] dark:border-green-800/40',
    detailsStrong: 'text-green-900 dark:text-green-200 font-extrabold',
    detailsLink: 'text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-500/10',
    quoteBorder: 'border-l-4 border-green-500',
    quoteBg: 'bg-green-100/50 dark:bg-green-950/20',
    quoteText: 'text-green-900/90 dark:text-green-200/90 font-semibold',
    quoteAuthor: 'text-green-900 dark:text-green-200 font-bold',
  },
  warning: {
    card: 'bg-status-warning dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/50',
    title: 'text-amber-800 dark:text-amber-300',
    description: 'text-amber-700 dark:text-amber-400',
    badge: 'bg-amber-500 text-amber-950',
    warningBox: 'border border-amber-400 bg-[#fff7ed] dark:bg-amber-950/20',
    detailsBox: 'bg-[#fff9f0] dark:bg-amber-950/20 border border-[#fbd38d] dark:border-amber-800/40',
    detailsStrong: 'text-amber-900 dark:text-amber-200 font-extrabold',
    detailsLink: 'text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-500/10',
    quoteBorder: 'border-l-4 border-amber-500',
    quoteBg: 'bg-amber-100/50 dark:bg-amber-950/20',
    quoteText: 'text-amber-900/90 dark:text-amber-200/90 font-semibold',
    quoteAuthor: 'text-amber-900 dark:text-amber-200 font-bold',
  },
  danger: {
    card: 'bg-status-danger dark:bg-red-950/30 border-red-300 dark:border-red-800/50',
    title: 'text-red-800 dark:text-red-300',
    description: 'text-red-700 dark:text-red-400',
    badge: 'bg-red-600 text-white',
    warningBox: 'border border-red-400 bg-[#fff2f2] dark:bg-red-950/20',
    detailsBox: 'bg-[#fff6f6] dark:bg-red-950/20 border border-[#fecaca] dark:border-red-800/40',
    detailsStrong: 'text-red-900 dark:text-red-200 font-extrabold',
    detailsLink: 'text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-500/10',
    quoteBorder: 'border-l-4 border-red-500',
    quoteBg: 'bg-red-100/50 dark:bg-red-950/20',
    quoteText: 'text-red-900/90 dark:text-red-200/90 font-semibold',
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
        <div className="mb-8 flex flex-wrap gap-2">
            <Button asChild variant="outline">
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Wróć do bazy
                </Link>
            </Button>
            <ShareButton ingredient={ingredient} variant="outline" />
        </div>

        <Card className={cn('overflow-hidden', config.card)}>
          <CardHeader className="text-center items-center p-8">
            <div className="text-7xl mb-4">{ingredient.icon}</div>
            <CardTitle className={cn('text-4xl font-extrabold font-headline tracking-tight', config.title)}>
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
              <h3 className={cn("text-xl font-extrabold mb-2", config.title)}>Opis</h3>
              <p className="text-base leading-relaxed text-foreground/80">{ingredient.desc}</p>
            </div>

            {ingredient.WARNING && (
              <div className={cn("p-4 rounded-lg", config.warningBox)}>
                <div className="flex items-center gap-2 text-lg font-extrabold !text-red-700 dark:!text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <h4>Uwaga!</h4>
                </div>
                <div className="mt-1 pl-7 font-bold text-foreground/80 dark:text-foreground/70">
                    <span>{ingredient.WARNING}</span>
                </div>
              </div>
            )}
            
            <div className={cn("p-6 rounded-lg", config.detailsBox)}>
                <h3 className={cn("text-xl font-extrabold mb-4", config.title)}>Szczegóły</h3>
                <div className="space-y-3 text-base text-foreground/80 dark:text-foreground/70">
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
                                "inline-flex items-center gap-1.5 font-bold underline decoration-2 underline-offset-4 decoration-current/50 transition-all p-1 rounded-md -m-1", 
                                "hover:bg-black/5 dark:hover:bg-white/10",
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
          {ingredient.nero && (
            <CardFooter className="p-6 md:p-8">
              <div className={cn("relative w-full p-5 pl-8 pt-10 rounded-lg", config.quoteBorder, config.quoteBg)}>
                  <div className="absolute left-4 top-3 inline-flex items-center gap-2 bg-white/70 dark:bg-black/20 text-xs font-extrabold text-foreground/80 dark:text-foreground/70 px-3 py-1 rounded-full border border-black/10 dark:border-white/10">
                      <PawPrint className="w-3 h-3" /> Nero mówi:
                  </div>
                  <blockquote className={cn("italic text-lg leading-relaxed", config.quoteText)}>
                      "{ingredient.nero}"
                  </blockquote>
              </div>
            </CardFooter>
          )}
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
