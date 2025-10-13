'use client';
import Link from 'next/link';
import { PawPrint, Mail, Youtube, Instagram, Award, BadgeDollarSign, ChevronDown, Building } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from './ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const organizations = [
    {
        name: 'FCI',
        logoUrl: 'https://www.fci.be/img/logo_fci.png',
        link: 'https://www.fci.be/en/',
    },
    {
        name: 'ZKwP',
        logoUrl: 'https://www.zkwp.pl/zg/images/logo_zkwp.png',
        link: 'https://www.zkwp.pl/',
    },
];

const recommendations = [
    {
        name: 'Silky Beauty',
        logoUrl: '/images/Silky-Beauty.png',
        link: 'https://chihuahuafci.com'
    },
    {
        name: 'NERO STUDIO',
        logoUrl: '/images/nero-studio.png',
        link: '/contact'
    }
];

export function Footer() {
  const year = new Date().getFullYear();
  const [isOrgsOpen, setIsOrgsOpen] = useState(false);
  const [isRecsOpen, setIsRecsOpen] = useState(false);

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Organizations Section */}
        <Collapsible open={isOrgsOpen} onOpenChange={setIsOrgsOpen} className='mb-4'>
          <div className="text-center">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="text-lg font-headline text-primary hover:bg-accent/20 transition-all p-4 rounded-lg group">
                <Building className="w-6 h-6 mr-3 text-accent group-hover:scale-110 transition-transform" />
                <span className='group-hover:text-foreground'>Organizacje Kynologiczne</span>
                 <ChevronDown className={cn("ml-2 h-5 w-5 transition-transform duration-300", isOrgsOpen && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-4 mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 items-center justify-center text-center">
                {organizations.map((org) => (
                   <Link 
                    key={org.name}
                    href={org.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 border rounded-lg bg-background/50 h-32 hover:bg-accent/10 hover:border-accent/50 transition-colors group"
                  >
                     <img
                        src={org.logoUrl}
                        alt={`Logo ${org.name}`}
                        className="max-h-16 w-auto"
                        loading="lazy"
                    />
                  </Link>
                ))}
              </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Recommended by Nero Section */}
        <Collapsible open={isRecsOpen} onOpenChange={setIsRecsOpen}>
          <div className="text-center mb-8">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="text-lg font-headline text-primary hover:bg-accent/20 transition-all p-4 rounded-lg group">
                <Award className="w-6 h-6 mr-3 text-accent group-hover:scale-110 transition-transform" />
                <span className='group-hover:text-foreground'>Polecane przez Nero</span>
                 <ChevronDown className={cn("ml-2 h-5 w-5 transition-transform duration-300", isRecsOpen && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 items-center justify-center text-center">
                {recommendations.map((rec) => (
                  <Link 
                    key={rec.name}
                    href={rec.link}
                    target={rec.link.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 border rounded-lg bg-background/50 h-32 hover:bg-accent/10 hover:border-accent/50 transition-colors group"
                  >
                     <img
                        src={rec.logoUrl}
                        alt={`Logo ${rec.name}`}
                        className="max-h-16 w-auto"
                        loading="lazy"
                    />
                  </Link>
                ))}
                 {/* CTA for advertising */}
                <Link href="/contact" className="flex flex-col items-center justify-center p-4 border border-dashed border-accent/50 rounded-lg bg-accent/10 h-full min-h-32 hover:bg-accent/20 hover:border-accent transition-colors group">
                    <BadgeDollarSign className="w-8 h-8 text-accent mb-2 transition-transform group-hover:scale-110" />
                    <span className="text-sm font-semibold text-accent/80 group-hover:text-accent">Twój produkt tutaj?</span>
                </Link>
                <Link href="/contact" className="flex flex-col items-center justify-center p-4 border border-dashed border-accent/50 rounded-lg bg-accent/10 h-full min-h-32 hover:bg-accent/20 hover:border-accent transition-colors group">
                    <BadgeDollarSign className="w-8 h-8 text-accent mb-2 transition-transform group-hover:scale-110" />
                    <span className="text-sm font-semibold text-accent/80 group-hover:text-accent">Twoja firma tutaj?</span>
                </Link>
              </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About Section */}
          <div>
            <Link href="/" className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <PawPrint className="w-6 h-6 text-accent" />
              <span className="font-bold text-lg font-headline text-primary">Dieta Nero</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Twój przewodnik po zdrowym żywieniu psa, stworzony z miłości do małych wielkich przyjaciół.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Ważne linki</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Regulamin
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Polityka Prywatności
                </Link>
              </li>
               <li>
                <Link href="/submit" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Zgłoś składnik
                </Link>
              </li>
              <li>
                <Link href="/report-bug" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Zgłoś błąd
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Kontakt</h3>
            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-4">
              <Mail className="w-4 h-4" />
              <Link href="/contact" className="text-sm hover:text-primary transition-colors">
                Napisz do nas
              </Link>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4">
                <Link href="https://www.youtube.com/@DIETANERO" aria-label="YouTube" className="text-muted-foreground hover:text-primary">
                    <Youtube className="w-5 h-5"/>
                </Link>
                 <Link href="https://www.instagram.com/dieta.nero/" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
                    <Instagram className="w-5 h-5"/>
                </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; {year} Dieta Nero. Wszelkie prawa zastrzeżone.</p>
          <p className="mt-1">Stworzone z miłością dla Nero i wszystkich małych wojowników.</p>
        </div>
      </div>
    </footer>
  );
}
