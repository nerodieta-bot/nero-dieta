'use client';
import Link from 'next/link';
import { PawPrint, Mail, Youtube, Instagram, Award, BadgeDollarSign, Building, Code } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

const organizations = [
    {
        name: 'FCI',
        logoUrl: '/images/fci-logo.png',
        link: 'https://www.fci.be/en/',
    },
    {
        name: 'ZKwP',
        logoUrl: '/images/zkwp-logo.png',
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
  const [year, setYear] = useState<number | null>(null);
  const [isRecsOpen, setIsRecsOpen] = useState(false);

  useEffect(() => {
    // This will only run on the client, after hydration
    setYear(new Date().getFullYear());
  }, []);


  return (
    <footer className="bg-card border-t mt-auto" id="recommendations">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Combined Collapsible Section */}
        <Collapsible open={isRecsOpen} onOpenChange={setIsRecsOpen} className='mb-8'>
           <CollapsibleTrigger asChild>
              <div className={cn("gradient-background flex items-center justify-center p-6 rounded-lg text-primary-foreground text-center cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group", isRecsOpen && "rounded-b-none")}>
                <Award className="w-10 h-10 mr-4 text-yellow-300 drop-shadow-lg transform group-hover:scale-110 transition-transform" />
                <div>
                    <h3 className="text-2xl font-bold font-headline tracking-wider">Polecane przez Nero</h3>
                    <p className="text-sm opacity-80">Sprawdzone miejsca i produkty</p>
                </div>
              </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-0 border-x border-b rounded-b-lg p-6 bg-background/30">
              {/* Recommendations */}
              <div className="flex flex-wrap items-stretch justify-center gap-4 text-center">
                {recommendations.map((rec) => (
                  <Link 
                    key={rec.name}
                    href={rec.link}
                    target={rec.link.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                     className="flex flex-col items-center justify-between p-4 border rounded-lg bg-background/50 w-40 hover:bg-accent/10 hover:border-accent/50 transition-colors group"
                  >
                     <img
                        src={rec.logoUrl}
                        alt={`Logo ${rec.name}`}
                        className="max-h-16 w-auto object-contain flex-grow"
                        loading="lazy"
                      />
                    <span className="text-xs font-semibold text-foreground/90 mt-2 pt-2 border-t w-full group-hover:text-primary transition-colors">{rec.name}</span>
                  </Link>
                ))}
                 {/* CTA for advertising */}
                <Link href="/contact" className="flex flex-col items-center justify-center p-4 border border-dashed border-accent/50 rounded-lg bg-accent/10 w-40 hover:bg-accent/20 hover:border-accent transition-colors group">
                    <BadgeDollarSign className="w-8 h-8 text-accent mb-2 transition-transform group-hover:scale-110" />
                    <span className="text-sm text-center font-semibold text-accent/80 group-hover:text-accent">Twój produkt tutaj?</span>
                </Link>
                <Link href="/contact" className="flex flex-col items-center justify-center p-4 border border-dashed border-accent/50 rounded-lg bg-accent/10 w-40 hover:bg-accent/20 hover:border-accent transition-colors group">
                    <BadgeDollarSign className="w-8 h-8 text-accent mb-2 transition-transform group-hover:scale-110" />
                    <span className="text-sm text-center font-semibold text-accent/80 group-hover:text-accent">Twoja firma tutaj?</span>
                </Link>
              </div>

              <Separator className='my-8' />

              {/* Organizations */}
              <div>
                <h4 className="text-center text-md font-headline text-primary mb-4 flex items-center justify-center gap-2">
                  <Building className="w-5 h-5 text-accent" />
                  Organizacje Kynologiczne
                </h4>
                <div className="flex flex-wrap items-stretch justify-center gap-4 text-center">
                  {organizations.map((org) => (
                     <Link 
                      key={org.name}
                      href={org.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-between p-4 border rounded-lg bg-background/50 w-40 hover:bg-accent/10 hover:border-accent/50 transition-colors group"
                    >
                       <img
                          src={org.logoUrl}
                          alt={`Logo ${org.name}`}
                          className="max-h-16 w-auto object-contain flex-grow"
                          loading="lazy"
                        />
                      <span className="text-xs font-semibold text-foreground/90 mt-2 pt-2 border-t w-full group-hover:text-primary transition-colors">{org.name}</span>
                    </Link>
                  ))}
                </div>
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
            <p className="text-sm text-foreground/90">
              Twój przewodnik po zdrowym żywieniu psa, stworzony z miłości do małych wielkich przyjaciół.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Ważne linki</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-foreground/90 hover:text-accent hover:font-bold transition-colors">
                  Regulamin
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-foreground/90 hover:text-accent hover:font-bold transition-colors">
                  Polityka Prywatności
                </Link>
              </li>
               <li>
                <Link href="/submit" className="text-sm text-foreground/90 hover:text-accent hover:font-bold transition-colors">
                  Zgłoś składnik
                </Link>
              </li>
              <li>
                <Link href="/report-bug" className="text-sm text-foreground/90 hover:text-accent hover:font-bold transition-colors">
                  Zgłoś błąd
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Kontakt</h3>
            <div className="flex items-center justify-center md:justify-start gap-2 text-foreground/90 mb-4">
              <Mail className="w-4 h-4" />
              <Link href="/contact" className="text-sm hover:text-accent hover:font-bold transition-colors">
                Napisz do nas
              </Link>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4">
                <Link href="https://www.youtube.com/@DIETANERO" aria-label="YouTube" className="text-foreground/90 hover:text-primary transition-colors">
                    <Youtube className="w-6 h-6"/>
                </Link>
                 <Link href="https://www.instagram.com/dieta.nero/" aria-label="Instagram" className="text-foreground/90 hover:text-primary transition-colors">
                    <Instagram className="w-6 h-6"/>
                </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center">
            <Collapsible>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs text-foreground/90 hover:text-accent-foreground hover:font-bold transition-transform hover:-translate-y-0.5 hover:bg-accent">
                        <Code className="mr-2 h-3 w-3" />
                        Informacje o twórcy
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-card p-4 rounded-md mt-2">
                    <p className="text-xs text-foreground/90">
                        Zaprojektowane i zbudowane od podstaw przez <Link href="/contact" className="font-semibold text-accent/90 hover:text-accent underline">NERO STUDIO</Link>.
                    </p>
                </CollapsibleContent>
            </Collapsible>
        </div>


        <div className="mt-4 pt-4 border-t text-center text-xs text-foreground/70">
          {year && <p>&copy; {year} Dieta Nero. Wszelkie prawa zastrzeżone.</p>}
          <p className="mt-1">Stworzone z miłością dla Nero i wszystkich małych wojowników.</p>
        </div>
      </div>
    </footer>
  );
}
