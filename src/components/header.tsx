'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { PawPrint } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Baza Wiedzy' },
  { href: '/plan', label: 'Kreator Posiłków' },
  { href: '/submit', label: 'Dodaj Składnik' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <PawPrint className="w-6 h-6 text-accent" />
          <span className="font-headline">Dieta Jedi</span>
        </Link>
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              asChild
              variant={pathname === link.href ? 'secondary' : 'ghost'}
              className={cn(pathname === link.href && 'font-bold')}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  className={cn('w-full justify-start', pathname === link.href && 'font-bold')}
                  >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
