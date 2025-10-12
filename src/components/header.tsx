'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { PawPrint, Home, Bot, PlusSquare, Dog, X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Baza Wiedzy', icon: Home },
  { href: '/plan', label: 'Kreator', icon: Bot },
  { href: '/submit', label: 'Dodaj', icon: PlusSquare },
  { href: '/nero', label: 'O Nero', icon: Dog },
];

const NAV_BUTTON_SIZE = 64; // w-16 h-16
const NAV_RADIUS = 120; // Radius of the circle in pixels
const START_ANGLE = -90; // Start angle in degrees (pointing upwards)
const ANGLE_STEP = 45; // Angle between items

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (!isMounted) {
    return (
        <header className="h-16 border-b flex items-center justify-between container mx-auto px-4 sm:px-6 lg:px-8">
             <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
                <PawPrint className="w-6 h-6 text-accent" />
                <span className="font-headline">Dieta Nero</span>
            </Link>
        </header>
    );
  }

  return (
    <>
      {/* Invisible placeholder to maintain layout space */}
      <header className="h-16" />

      {/* Actual Navigation */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
        <div className="relative flex items-center justify-center">
          
          {/* Animated navigation items */}
          {navLinks.map((link, index) => {
            const angle = START_ANGLE + index * ANGLE_STEP;
            const x = Math.cos((angle * Math.PI) / 180) * NAV_RADIUS;
            const y = Math.sin((angle * Math.PI) / 180) * NAV_RADIUS;

            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'absolute flex flex-col items-center justify-center w-16 h-16 rounded-full bg-card shadow-lg border transition-all duration-300 ease-in-out',
                  'transform-gpu',
                  isOpen
                    ? `translate-x-[${x}px] translate-y-[${y}px] opacity-100`
                    : 'translate-x-0 translate-y-0 opacity-0 pointer-events-none',
                   isActive ? 'text-primary ring-2 ring-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
                )}
                style={{
                  // Inline styles are needed for dynamic transform values
                  transform: isOpen ? `translate(${x}px, ${y}px)` : 'translate(0, 0)',
                }}
                aria-label={link.label}
              >
                <link.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{link.label}</span>
              </Link>
            );
          })}

          {/* Main toggle button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-primary-foreground transition-transform duration-500 ease-in-out hover:scale-110"
            aria-label="Otwórz menu"
            aria-expanded={isOpen}
          >
            <div className="relative w-8 h-8 flex items-center justify-center">
                 <X className={cn("absolute h-8 w-8 transition-all duration-300 transform", isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0")} />
                 <Menu className={cn("absolute h-8 w-8 transition-all duration-300 transform", isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")} />
            </div>
          </Button>
        </div>
      </div>
    </>
  );
}
