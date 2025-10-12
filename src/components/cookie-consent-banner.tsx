'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Sprawdzamy po stronie klienta, czy zgoda została już wyrażona
    const consent = localStorage.getItem('cookie_consent');
    if (consent === null) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 animate-in slide-in-from-bottom-10 duration-500">
      <Card className="max-w-2xl mx-auto shadow-2xl border-accent/50 bg-background/95 backdrop-blur-sm">
        <CardHeader className="flex-row items-start gap-4 space-y-0">
            <Cookie className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
            <div>
                <CardTitle className="text-lg text-primary font-headline">Stawiamy na przejrzystość!</CardTitle>
                <CardDescription>
                    Używamy plików cookie, aby zapewnić najlepsze doświadczenia na naszej stronie. Pomagają nam one analizować ruch i personalizować treści.
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <p className="text-xs text-muted-foreground flex-grow">
            Wybierając "Akceptuj", zgadzasz się na użycie wszystkich plików cookie. Możesz dowiedzieć się więcej, czytając naszą{' '}
            <Link href="/privacy" className="underline hover:text-primary">
              Politykę Prywatności
            </Link>
            .
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" onClick={handleDecline}>
              Odrzuć
            </Button>
            <Button onClick={handleAccept}>Akceptuj</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
