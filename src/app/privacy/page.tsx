import { ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          <CardContent className="space-y-6 prose prose-sm dark:prose-invert max-w-none">
            <section>
              <h3>§1 Informacje ogólne</h3>
              <ol>
                <li>Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazywanych przez Użytkowników w związku z korzystaniem przez nich z usług oferowanych przez serwis Dieta Nero (dalej: "Serwis").</li>
                <li>Administratorem danych osobowych zawartych w serwisie jest podmiot zarządzający aplikacją (dalej: "Administrator").</li>
                <li>Szanujemy prawo do prywatności i dbamy o bezpieczeństwo danych. W tym celu używany jest m.in. bezpieczny protokół szyfrowania komunikacji (SSL).</li>
              </ol>
            </section>
            
            <section>
              <h3>§2 Jakie dane zbieramy?</h3>
              <ol>
                <li>
                  <strong>Dane wprowadzane w formularzach:</strong>
                  <ul>
                    <li>Podczas generowania planu posiłków: waga psa, wiek, poziom aktywności, lista składników.</li>
                    <li>Podczas analizy etykiety za pomocą Skanera: obraz etykiety produktu.</li>
                    <li>Podczas zgłaszania nowego składnika: nazwa składnika, status, kategoria, opis, opcjonalny komentarz.</li>
                  </ul>
                </li>
                <li>
                  <strong>Dane zbierane automatycznie:</strong>
                  <ul>
                    <li>Podczas wizyty w Serwisie automatycznie zbierane są dane dotyczące wizyty, np. adres IP, typ przeglądarki, nazwa domeny, typ systemu operacyjnego. Dane te są wykorzystywane w celach statystycznych i administracyjnych.</li>
                  </ul>
                </li>
                <li>Serwis nie wymaga zakładania konta, a dane wprowadzane w formularzach nie są publicznie łączone z tożsamością Użytkownika.</li>
              </ol>
            </section>

            <section>
              <h3>§3 W jakim celu wykorzystujemy dane?</h3>
              <ol>
                <li>Dane podane w formularzu generowania planu posiłków oraz obrazy przesyłane w Skanerze Etykiet są przetwarzane wyłącznie w celu wygenerowania odpowiedzi przez model AI i nie są trwale zapisywane w powiązaniu z Użytkownikiem.</li>
                <li>Dane podane w formularzu zgłaszania składnika są przetwarzane w celu weryfikacji i ewentualnego dodania nowego składnika do publicznej bazy danych Serwisu.</li>
                <li>Dane zbierane automatycznie mogą być użyte do analizy zachowań użytkowników w Serwisie (np. przy użyciu narzędzi analitycznych) w celu poprawy jego działania.</li>
              </ol>
            </section>

            <section>
              <h3>§4 Prawa Użytkownika</h3>
              <ol>
                <li>Użytkownik ma prawo dostępu do swoich danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania.</li>
                <li>Ponieważ Serwis nie wymaga logowania, realizacja tych praw może wymagać dodatkowej weryfikacji tożsamości w celu potwierdzenia, że jesteś osobą, której dane dotyczą. W celu realizacji swoich praw, prosimy o kontakt mailowy.</li>
              </ol>
            </section>

             <section>
              <h3>§5 Pliki Cookies</h3>
              <ol>
                <li>Serwis używa plików cookies (tzw. "ciasteczek") w celu zapisania zgody na warunki Regulaminu i Polityki Prywatności. Jest to niezbędne do prawidłowego funkcjonowania Serwisu.</li>
                <li>Ciasteczka mogą być również używane w celach statystycznych do analizy ruchu w Serwisie.</li>
                 <li>Użytkownik może w każdej chwili wyłączyć obsługę plików cookies w ustawieniach swojej przeglądarki internetowej, jednak może to uniemożliwić korzystanie z Serwisu.</li>
              </ol>
            </section>

            <section>
              <h3>§6 Postanowienia końcowe</h3>
              <ol>
                <li>Administrator zastrzega sobie prawo do wprowadzania zmian w polityce prywatności.</li>
                <li>O wszelkich zmianach Administrator będzie informować w sposób widoczny i zrozumiały.</li>
                <li>W sprawach nieuregulowanych niniejszą Polityką Prywatności mają zastosowanie odpowiednie przepisy prawa polskiego.</li>
                <li>Data ostatniej aktualizacji: {new Date().toLocaleDateString('pl-PL')}.</li>
              </ol>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
