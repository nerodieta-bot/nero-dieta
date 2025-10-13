import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TermsContent } from '@/components/terms-content';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <FileText className="mx-auto w-12 h-12 text-accent mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
            Regulamin
          </h1>
          <p className="text-lg text-muted-foreground">Zasady korzystania z serwisu Dieta Nero</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Regulamin świadczenia usług drogą elektroniczną w ramach serwisu Dieta Nero</CardTitle>
          </CardHeader>
          <CardContent>
            <TermsContent />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
