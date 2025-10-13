'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { PawPrint, Home, Bot, PlusSquare, Dog, X, Menu, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"


const navLinks = [
  { href: '/', label: 'Baza Wiedzy', icon: Home },
  { href: '/plan', label: 'Kreator', icon: Bot },
  { href: '/scan', label: 'Skaner', icon: ScanLine },
  { href: '/submit', label: 'Dodaj', icon: PlusSquare },
  { href: '/nero', label: 'O Nero', icon: Dog },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);


  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary transition-transform hover:scale-105">
            <PawPrint className="w-6 h-6 text-accent" />
            <span className="font-headline">Dieta Nero</span>
          </Link>
          <nav className="flex items-center gap-2">
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
        </div>
      </header>
      <div className="hidden md:block h-16" />


      {/* Mobile Header with Sheet Menu */}
      <header className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
                  <PawPrint className="w-6 h-6 text-accent" />
                  <span className="font-headline">Dieta Nero</span>
              </Link>

              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Otwórz menu">
                          <Menu className="h-6 w-6"/>
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[280px]">
                      <nav className="flex flex-col gap-4 mt-8">
                           {navLinks.map((link) => {
                              const isActive = pathname === link.href;
                              return (
                                <Link
                                  href={link.href}
                                  key={link.href}
                                  className={cn(
                                    'flex items-center gap-3 p-3 rounded-lg text-lg font-medium transition-colors',
                                    isActive
                                      ? 'bg-primary text-primary-foreground'
                                      : 'text-foreground hover:bg-muted'
                                  )}
                                >
                                  <link.icon className="h-6 w-6" />
                                  <span>{link.label}</span>
                                </Link>
                              );
                           })}
                      </nav>
                  </SheetContent>
              </Sheet>
          </div>
      </header>
    </>
  );
}