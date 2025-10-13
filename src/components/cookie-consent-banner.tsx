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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from './ui/scroll-area';
import { TermsContent } from './terms-content';
import { PrivacyContent } from './privacy-content';

import { Cookie, FileText, ShieldCheck } from 'lucide-react';

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
          <DialogDescription className="text-center text-muted-foreground !text-sm sm:!text-base">
            Zanim zaczniesz, prosimy o akceptację naszych zasad. To ważne dla Twojego bezpieczeństwa i świadomego korzystania z serwisu.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2 sm:py-4 space-y-4 text-sm">
            <p className="!text-xs sm:!text-sm">
                Korzystając z serwisu, potwierdzasz, że rozumiesz i akceptujesz, iż wszystkie treści mają charakter wyłącznie informacyjny i <strong>nie zastępują profesjonalnej porady weterynaryjnej</strong>.
            </p>
            <div className='flex flex-col sm:flex-row gap-2'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full text-xs sm:text-sm">
                    <FileText className='mr-2 h-4 w-4'/>
                    Przeczytaj Regulamin
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Regulamin Serwisu Dieta Nero</AlertDialogTitle>
                  </AlertDialogHeader>
                  <ScrollArea className="h-[60vh] pr-6">
                    <TermsContent />
                  </ScrollArea>
                  <AlertDialogFooter>
                    <AlertDialogAction>Zamknij</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full text-xs sm:text-sm">
                    <ShieldCheck className='mr-2 h-4 w-4'/>
                    Przeczytaj Politykę Prywatności
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Polityka Prywatności Dieta Nero</AlertDialogTitle>
                  </AlertDialogHeader>
                  <ScrollArea className="h-[60vh] pr-6">
                    <PrivacyContent />
                  </ScrollArea>
                  <AlertDialogFooter>
                    <AlertDialogAction>Zamknij</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
