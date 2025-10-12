
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PawPrint, Heart, Crown, Mountain } from 'lucide-react';

export default function NeroPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4 flex items-center justify-center gap-3">
              <span role="img" aria-label="black heart">🖤</span> O NERO
            </h1>
            <p className="text-lg text-muted-foreground">Poznaj historię naszego głównego recenzenta</p>
          </header>

          <main className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <Card className="overflow-hidden sticky top-24">
                <Image
                  src="/images/nero.png"
                  alt="Zdjęcie Nero"
                  width={600}
                  height={600}
                  className="object-cover w-full h-auto"
                  data-ai-hint="chihuahua dog"
                  priority
                />
                <CardHeader>
                  <CardTitle className="text-primary font-headline">Nero Silky Beauty</CardTitle>
                  <CardDescription>Urodzony: 28 października 2024 r.</CardDescription>
                </CardHeader>
                <CardContent className='text-sm text-muted-foreground'>
                  Syn <span className='font-semibold text-foreground'>LUXURY OF NADIN GLORIA DIOS</span> & <span className='font-semibold text-foreground'>ADONIS SILKY BEAUTY</span>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3 space-y-8">
                <p className="text-lg leading-relaxed text-foreground/90">
                  Nero to młody samiec rasy Chihuahua o wyjątkowym rodowodzie i niezwykłej osobowości. Urodził się 28 października 2024 roku w hodowli Silky Beauty FCI, jako przedstawiciel prestiżowego miotu „D”. Od pierwszych dni zachwycał spokojem, pewnością siebie i tym charakterystycznym, przenikliwym spojrzeniem, które wydaje się rozumieć więcej, niż mówi świat wokół.
                </p>

                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-headline text-xl text-primary mb-3 flex items-center"><Mountain className="mr-2 h-5 w-5 text-accent"/> Wychowanie w Alpach</h3>
                  <p className='text-muted-foreground'>
                    Obecnie Nero wychowuje się wśród szwajcarskich Alp, w miejscu, gdzie powietrze jest czyste, a krajobraz rozciąga się aż po śnieżne szczyty. Dorasta wśród natury, w otoczeniu jezior i górskich ścieżek, które uczą go równowagi i ciekawości świata. To właśnie tam rozwija swoją siłę, charakter i spokój ducha – z dala od zgiełku, w rytmie górskiego powietrza i w harmonii z naturą.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                    <h3 className="font-headline text-xl text-primary mb-3 flex items-center"><Crown className="mr-2 h-5 w-5 text-accent"/> Królewski Rodowód</h3>
                    <p className='text-muted-foreground'>
                        Jego matka, <strong className='text-foreground'>Luxury of Nadin Gloria Dios</strong>, to suczka o subtelnej urodzie i łagodnym charakterze – Junior Champion of Poland oraz Romanian Junior Champion. Ojciec, <strong className='text-foreground'>Adonis Silky Beauty</strong>, to dumny samiec o międzynarodowej sławie – C.I.B. (International Beauty Champion), wielokrotny zwycięzca i champion wielu krajów Europy.
                    </p>
                </div>

                <p className="text-lg leading-relaxed text-foreground/90">
                  Połączenie tych dwóch linii stworzyło w Nero psa wyjątkowego – harmonijnego, inteligentnego i pewnego siebie. Jego błyszcząca sierść, wyraziste oczy i spokojna postawa sprawiają, że już dziś widać w nim przyszłego ambasadora piękna i klasy Silky Beauty FCI.
                </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
