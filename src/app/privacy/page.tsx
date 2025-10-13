import { ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PrivacyContent } from '@/components/privacy-content';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <ShieldCheck className="mx-auto w-12 h-12 text-accent mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
            Polityka Prywatności
          </h1>
          <p className="text-lg text-muted-foreground">Jak chronimy Twoje dane w Dieta Nero</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Polityka Prywatności serwisu Dieta Nero</CardTitle>
          </CardHeader>
          <CardContent>
            <PrivacyContent />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
