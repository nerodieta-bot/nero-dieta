'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { PawPrint, Home, Bot, PlusSquare, Dog, X, Menu, ScanLine, Award, LogIn, Gem, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { UserNav } from './user-nav';
import { useUser } from '@/firebase';


const navLinks = [
  { href: '/', label: 'Baza Wiedzy', icon: Home },
  { href: '/plan', label: 'Kreator', icon: Bot },
  { href: '/scan', label: 'Skaner', icon: ScanLine },
  { href: '/pricing', label: 'Cennik', icon: Gem },
  { href: '/submit', label: 'Dodaj', icon: PlusSquare },
  { href: '/nero', label: 'O Nero', icon: Dog },
];

const mobileNavLinks = [
  ...navLinks,
  { href: '#recommendations', label: 'Polecane', icon: Award },
  { href: '/pricing#faq', label: 'FAQ', icon: HelpCircle },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user, isUserLoading } = useUser();


  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  const AuthButton = () => {
    if (isUserLoading) {
      return <Button variant="outline" size="icon" className="rounded-full w-auto px-4 h-10 animate-pulse"><div className="w-20 h-4 bg-muted rounded"></div></Button>;
    }
    if (user) {
      return <UserNav />;
    }
    return (
      <Button asChild variant='outline' className='rounded-full border-accent/50 text-accent hover:bg-accent/10 hover:text-accent font-bold transition-all duration-300 transform hover:scale-105'>
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Zaloguj się
        </Link>
      </Button>
    );
  };

  return (
    <>
      <header className="hidden md:flex sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary transition-transform hover:scale-105">
            <PawPrint className="w-6 h-6 text-accent" />
            <span className="font-headline">Dieta Nero</span>
          </Link>
          <nav className="flex items-center gap-1">
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
             <div className="ml-4">
              <AuthButton />
            </div>
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
              <div className='flex items-center gap-2'>
                <AuthButton />
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Otwórz menu">
                            <Menu className="h-6 w-6"/>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[280px]">
                        <SheetHeader>
                          <SheetTitle className='font-headline text-primary'>Menu</SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col gap-4 mt-8">
                             {mobileNavLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                  <Link
                                    href={link.href}
                                    key={link.href}
                                    className={cn(
                                      'flex items-center gap-3 p-3 rounded-lg text-lg font-medium transition-colors',
                                      isActive && !link.href.startsWith('#')
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
          </div>
      </header>
    </>
  );
}
