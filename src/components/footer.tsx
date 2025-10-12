import Link from 'next/link';
import { PawPrint, Mail, Youtube, Instagram } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About Section */}
          <div>
            <Link href="/" className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <PawPrint className="w-6 h-6 text-accent" />
              <span className="font-bold text-lg font-headline text-primary">Dieta Nero</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Twój przewodnik po zdrowym żywieniu psa, stworzony z miłości do małych wielkich przyjaciół.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Ważne linki</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Regulamin
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Polityka Prywatności
                </Link>
              </li>
               <li>
                <Link href="/submit" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Zgłoś składnik
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Zgłoś błąd
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Kontakt</h3>
            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-4">
              <Mail className="w-4 h-4" />
              <Link href="/contact" className="text-sm hover:text-primary transition-colors">
                Napisz do nas
              </Link>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4">
                <Link href="#" aria-label="YouTube" className="text-muted-foreground hover:text-primary">
                    <Youtube className="w-5 h-5"/>
                </Link>
                 <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
                    <Instagram className="w-5 h-5"/>
                </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; {year} Dieta Nero. Wszelkie prawa zastrzeżone.</p>
          <p className="mt-1">Stworzone z miłością dla Nero i wszystkich małych wojowników.</p>
        </div>
      </div>
    </footer>
  );
}
