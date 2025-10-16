
import { notFound } from 'next/navigation';
import { ingredients } from '@/app/data/ingredients';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertCircle, Link as LinkIcon, Home, PawPrint, ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShareButton } from '@/components/share-button';
import type { IngredientStatus } from '@/lib/types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"


export async function generateStaticParams() {
  return ingredients.map((ingredient) => ({
    slug: ingredient.slug,
  }));
}

const statusBadgeMap: Record<IngredientStatus, string> = {
  safe: '✅ Bezpieczny',
  warning: '⚠️ Umiarkowany',
  danger: '❌ Zakazany',
};

const statusVariantMap: Record<IngredientStatus, Record<string, string>> = {
  safe: {
    card: 'bg-[#e9f9ed] border-green-200',
    title: 'text-green-800 dark:text-green-300',
    description: 'text-green-700 dark:text-green-400',
    badge: 'bg-green-600 text-white',
    warningBox: 'border-emerald-300 bg-[#f0fff4]',
    detailsBox: 'border-[#b7e2c2] bg-[#f4fbf5]',
    detailsLink: 'text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-600/5',
    neroQuote: 'border-l-green-500 bg-green-100/50 dark:bg-green-950/20 text-green-900/90 dark:text-green-200/90',
  },
  warning: {
    card: 'bg-[#fff5e5] border-amber-200',
    title: 'text-amber-800 dark:text-amber-300',
    description: 'text-amber-700 dark:text-amber-400',
    badge: 'bg-amber-500 text-amber-950',
    warningBox: 'border-amber-400 bg-[#fff7ed]',
    detailsBox: 'border-[#fbd38d] bg-[#fff9f0]',
    detailsLink: 'text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-600/5',
    neroQuote: 'border-l-amber-500 bg-amber-100/50 dark:bg-amber-950/20 text-amber-900/90 dark:text-amber-200/90',
  },
  danger: {
    card: 'bg-[#ffecec] border-red-200',
    title: 'text-red-800 dark:text-red-300',
    description: 'text-red-700 dark:text-red-400',
    badge: 'bg-red-600 text-white',
    warningBox: 'border-red-400 bg-[#fff2f2]',
    detailsBox: 'border-[#fecaca] bg-[#fff6f6]',
    detailsLink: 'text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-600/5',
    neroQuote: 'border-l-red-500 bg-red-100/50 dark:bg-red-950/20 text-red-900/90 dark:text-red-200/90',
  },
};


export default function IngredientPage({ params }: { params: { slug: string } }) {
  const ingredient = ingredients.find((p) => p.slug === params.slug);

  if (!ingredient) {
    notFound();
  }

  const variant = statusVariantMap[ingredient.status];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
            <Button asChild variant="outline">
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Wróć do bazy
                </Link>
            </Button>
            <ShareButton ingredient={ingredient} variant="outline" />
        </div>

        <Collapsible defaultOpen={true} className="md:!block">
          <Card className={cn(
              'overflow-hidden !p-6 !rounded-2xl transition-all duration-200 ease-in-out',
              variant.card, 
              'shadow-lg border-opacity-50'
          )}>
            <CardHeader className="text-center items-center p-2 md:p-8">
              <div className="text-7xl mb-4">{ingredient.icon}</div>
              <CardTitle className={cn('text-4xl font-extrabold font-headline tracking-tight', variant.title)}>
                {ingredient.name}
              </CardTitle>
              <CardDescription className={cn('font-semibold text-lg', variant.description)}>
                {ingredient.category}
              </CardDescription>
              <div className={cn('mt-4 px-4 py-1 rounded-full text-sm font-bold', variant.badge)}>
                {statusBadgeMap[ingredient.status]}
              </div>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="p-0 md:p-2 space-y-6">
                <div>
                  <h3 className={cn("text-xl font-extrabold mb-2", variant.title)}>Opis</h3>
                  <p className="text-base leading-relaxed text-foreground/80">{ingredient.desc}</p>
                </div>

                {ingredient.WARNING && (
                  <div className={cn("p-4 rounded-lg", variant.warningBox)}>
                    <div className="flex items-center gap-2 text-lg font-extrabold !text-red-700 dark:!text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        <h4>Uwaga!</h4>
                    </div>
                    <div className="mt-1 pl-7 font-bold text-red-800/90 dark:text-red-300/80">
                        <span>{ingredient.WARNING}</span>
                    </div>
                  </div>
                )}
                
                <div className={cn("p-6 rounded-xl", variant.detailsBox)}>
                    <h3 className={cn("text-xl font-extrabold mb-4", variant.title)}>Szczegóły</h3>
                    <div className="space-y-3 text-base text-foreground/80 dark:text-foreground/70">
                    {ingredient.portion && (
                        <p><strong className="font-extrabold text-foreground/90 dark:text-foreground/80">Sugerowana porcja:</strong> {ingredient.portion}</p>
                    )}
                    {ingredient.prep && (
                        <p><strong className="font-extrabold text-foreground/90 dark:text-foreground/80">Sposób przygotowania:</strong> {ingredient.prep}</p>
                    )}
                    {ingredient.source && (
                        <div className="flex items-center gap-2 pt-2 border-t border-black/10 dark:border-white/10">
                            <strong className="font-extrabold text-foreground/90 dark:text-foreground/80">Źródło naukowe:</strong> 
                            <a 
                                href={ingredient.source} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={cn(
                                    "inline-flex items-center gap-1.5 font-bold underline decoration-2 underline-offset-4 rounded-md -m-1 p-1 transition-colors",
                                    variant.detailsLink
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
              <CardFooter className="flex-col md:flex-row items-center justify-between p-0 md:p-2 mt-6 gap-4">
                  {ingredient.nero && (
                    <div className={cn("relative w-full p-5 pl-8 pt-10 rounded-xl border-l-4", variant.neroQuote)}>
                        <div className="absolute left-4 top-3 inline-flex items-center gap-2 bg-white/70 dark:bg-black/20 text-xs font-extrabold text-foreground/80 dark:text-foreground/70 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10">
                            <PawPrint className="w-4 h-4" /> Nero mówi:
                        </div>
                        <blockquote className="italic text-lg leading-relaxed">
                            "{ingredient.nero}"
                        </blockquote>
                    </div>
                  )}
              </CardFooter>
            </CollapsibleContent>
          </Card>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full mt-4 md:hidden text-muted-foreground group">
                <span className="group-data-[state=open]:hidden">Rozwiń szczegóły</span>
                <span className="group-data-[state=closed]:hidden">Zwiń szczegóły</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
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
