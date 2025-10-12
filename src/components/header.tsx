'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { PawPrint, Home, Bot, PlusSquare, Dog, X, Menu, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Baza Wiedzy', icon: Home },
  { href: '/plan', label: 'Kreator', icon: Bot },
  { href: '/submit', label: 'Dodaj', icon: PlusSquare },
  { href: '/nero', label: 'O Nero', icon: Dog },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Zamyka menu po zmianie ścieżki
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop Header */}
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

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 right-4 left-4 z-50">
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex flex-col gap-2 mb-4"
            >
              {navLinks.map((link) => (
                <Link
                  href={link.href}
                  key={link.href}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-lg shadow-lg text-lg font-semibold w-full transition-colors',
                     pathname === link.href
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-card-foreground hover:bg-muted'
                  )}
                >
                  <link.icon className="h-6 w-6" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>

        <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full h-16 bg-accent text-accent-foreground rounded-xl shadow-2xl flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={isMenuOpen ? 'close' : 'open'}
                    initial={{ opacity: 0, rotate: -30 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 30 }}
                    transition={{ duration: 0.2 }}
                >
                    {isMenuOpen ? <X className="h-8 w-8" /> : <ChevronUp className="h-8 w-8" />}
                </motion.div>
            </AnimatePresence>
            <span className='ml-2 font-bold text-lg'>MENU</span>
        </motion.button>
      </div>
    </>
  );
}
