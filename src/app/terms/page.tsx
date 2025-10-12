import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          <CardContent className="space-y-6 prose prose-sm dark:prose-invert max-w-none">
            <section>
              <h3>§1 Postanowienia ogólne</h3>
              <ol>
                <li>Niniejszy regulamin (zwany dalej „Regulaminem”) określa zasady korzystania z serwisu internetowego Dieta Nero, dostępnego pod adresem URL, na którym jest opublikowany (zwanego dalej „Serwisem”).</li>
                <li>Właścicielem i administratorem Serwisu jest podmiot zarządzający aplikacją (zwany dalej „Administratorem”).</li>
                <li>Każdy użytkownik z chwilą podjęcia czynności zmierzających do korzystania z Serwisu zobowiązany jest do przestrzegania postanowień niniejszego Regulaminu.</li>
                <li>Serwis ma charakter informacyjno-edukacyjny i nie zastępuje profesjonalnej porady weterynaryjnej ani dietetycznej.</li>
              </ol>
            </section>
            
            <section>
              <h3>§2 Rodzaj i zakres usług</h3>
              <ol>
                <li>Serwis umożliwia Użytkownikom:
                  <ul>
                    <li>Przeglądanie bazy danych składników żywieniowych dla psów.</li>
                    <li>Korzystanie z narzędzia do generowania przykładowych planów posiłków przy użyciu sztucznej inteligencji (AI).</li>
                    <li>Zgłaszanie propozycji nowych składników do bazy danych.</li>
                  </ul>
                </li>
                <li>Wszystkie usługi w Serwisie są świadczone nieodpłatnie.</li>
              </ol>
            </section>

            <section>
              <h3>§3 Zasady korzystania z Serwisu</h3>
              <ol>
                <li>Informacje zawarte w Serwisie, w tym te generowane przez AI, mają charakter wyłącznie poglądowy. Administrator nie ponosi odpowiedzialności za ich interpretację i stosowanie.</li>
                <li>Każda decyzja dotycząca diety i zdrowia psa powinna być bezwzględnie skonsultowana z lekarzem weterynarii.</li>
                <li>Użytkownik, zgłaszając nowy składnik, oświadcza, że posiada prawa do wprowadzanych treści lub że pochodzą one z legalnych i publicznie dostępnych źródeł.</li>
                <li>Zabronione jest dostarczanie treści o charakterze bezprawnym, obraźliwym, naruszającym dobre obyczaje lub prawa osób trzecich.</li>
                <li>Administrator zastrzega sobie prawo do weryfikacji, edycji lub usunięcia treści zgłoszonych przez Użytkowników bez podania przyczyny.</li>
              </ol>
            </section>

            <section>
              <h3>§4 Odpowiedzialność</h3>
              <ol>
                <li>Administrator dokłada wszelkich starań, aby treści w Serwisie były rzetelne i aktualne, jednak nie daje gwarancji ich stuprocentowej poprawności.</li>
                <li>Administrator nie ponosi odpowiedzialności za jakiekolwiek szkody (w tym zdrowotne u zwierząt) wynikłe z zastosowania się do informacji zawartych w Serwisie.</li>
                <li>Narzędzie do generowania planów żywieniowych jest oparte na modelu językowym AI i może generować informacje nieprawdziwe lub niekompletne. Wyniki jego działania należy traktować jako inspirację, a nie gotową dietę.</li>
                <li>Administrator nie ponosi odpowiedzialności za przerwy w funkcjonowaniu Serwisu spowodowane przyczynami technicznymi.</li>
              </ol>
            </section>

            <section>
              <h3>§5 Postanowienia końcowe</h3>
              <ol>
                <li>Administrator zastrzega sobie prawo do wprowadzania zmian w Regulaminie w dowolnym czasie.</li>
                <li>Aktualna wersja Regulaminu jest zawsze dostępna w Serwisie.</li>
                <li>W sprawach nieuregulowanych niniejszym Regulaminem mają zastosowanie przepisy prawa polskiego.</li>
                <li>Data ostatniej aktualizacji: {new Date().toLocaleDateString('pl-PL')}.</li>
              </ol>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
