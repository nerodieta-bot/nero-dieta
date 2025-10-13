'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { Cookie, FileText, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CookieConsentBanner() {
  const [isClient, setIsClient] = useState(false);
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setConsent(localStorage.getItem('dieta_nero_consent'));
  }, []);

  const handleAccept = () => {
    localStorage.setItem('dieta_nero_consent', 'accepted');
    setConsent('accepted');
  };

  if (!isClient) {
    return null; // Render nothing on the server
  }

  const isOpen = consent !== 'accepted';

  return (
    <Dialog open={isOpen}>
      <DialogContent 
        className="max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Cookie className="h-12 w-12 text-accent" />
          </div>
          <DialogTitle className="text-center text-2xl font-headline text-primary">Witaj w Świecie Dieta Nero!</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Zanim zaczniesz, prosimy o akceptację naszych zasad. To ważne dla Twojego bezpieczeństwa i świadomego korzystania z serwisu.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4 text-sm">
            <p>
                Korzystając z serwisu, potwierdzasz, że rozumiesz i akceptujesz, iż wszystkie treści, w tym te generowane przez AI, mają charakter wyłącznie informacyjny i <strong>nie zastępują profesjonalnej porady weterynaryjnej</strong>.
            </p>
            <div className='flex flex-col space-y-2'>
                 <Link href="/terms" target="_blank" className='flex items-center gap-2 hover:text-primary transition-colors'>
                    <FileText className='h-4 w-4 text-muted-foreground'/>
                    <span>Przeczytaj Regulamin</span>
                </Link>
                 <Link href="/privacy" target="_blank" className='flex items-center gap-2 hover:text-primary transition-colors'>
                    <ShieldCheck className='h-4 w-4 text-muted-foreground'/>
                    <span>Przeczytaj Politykę Prywatności</span>
                </Link>
            </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAccept} className="w-full">
            Rozumiem i akceptuję
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
