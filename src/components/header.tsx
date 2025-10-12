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

// Radial menu constants
const NAV_RADIUS = 100; // Radius of the circle in pixels
const START_ANGLE = -90; // Start angle in degrees (pointing upwards)
const ANGLE_STEP = 40; // Angle between items

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
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
      {/* Traditional Header for Desktop */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary transition-transform hover:scale-105">
            <PawPrint className="w-6 h-6 text-accent" />
            <span className="font-headline">Dieta Nero</span>
          </Link>

          {/* Desktop Navigation Links (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2">
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
          </div>

          {/* Mobile menu trigger - hidden on desktop */}
          <div className="md:hidden">
            {/* This space is intentionally left blank for the radial menu trigger */}
          </div>
        </div>
      </header>
      
      {/* Placeholder to prevent content overlap */}
      <div className="h-16" />

      {/* Radial Mobile Navigation (hidden on desktop) */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
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
                  'transform-gpu', // Hardware acceleration for smooth animation
                  isOpen
                    ? 'opacity-100'
                    : 'opacity-0 scale-50 pointer-events-none',
                   isActive ? 'text-primary-foreground bg-primary ring-2 ring-primary' : 'text-foreground bg-card hover:text-primary hover:bg-accent/50'
                )}
                style={{
                  transform: isOpen ? `translate(${x}px, ${y}px)` : 'translate(0, 0)',
                }}
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
                <span className="text-xs mt-1 font-medium">{link.label}</span>
              </Link>
            );
          })}

          {/* Main toggle button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center bg-accent text-accent-foreground transition-transform duration-500 ease-in-out hover:scale-110 hover:bg-accent/90"
            aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={isOpen}
          >
            <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
                 <X className={cn("absolute h-7 w-7 transition-all duration-300 transform", isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0")} />
                 <Menu className={cn("absolute h-7 w-7 transition-all duration-300 transform", isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")} />
            </div>
          </Button>
        </div>
      </div>
    </>
  );
}
