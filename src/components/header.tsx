'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { PawPrint, Home, Bot, PlusSquare, Dog, X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'Baza Wiedzy', icon: Home },
  { href: '/plan', label: 'Kreator', icon: Bot },
  { href: '/submit', label: 'Dodaj', icon: PlusSquare },
  { href: '/nero', label: 'O Nero', icon: Dog },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    // Zamyka panel po zmianie ścieżki
    setIsSheetOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary transition-transform hover:scale-105">
            <PawPrint className="w-6 h-6 text-accent" />
            <span className="font-headline">Dieta Nero</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Button key={link.href} asChild variant={isActive ? 'secondary' : 'ghost'}>
                  <Link href={link.href} className="flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Otwórz menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-primary">
                     <PawPrint className="w-6 h-6 text-accent" />
                     <span className='font-headline'>Dieta Nero</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-4">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Button
                        key={link.href}
                        asChild
                        variant={isActive ? 'secondary' : 'ghost'}
                        size="lg"
                        className='justify-start'
                      >
                        <Link href={link.href} className="flex items-center gap-4 text-base">
                          <link.icon className="h-5 w-5" />
                          {link.label}
                        </Link>
                      </Button>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      {/* Placeholder to prevent content overlap */}
      <div className="h-16" />
    </>
  );
}
