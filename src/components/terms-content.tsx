export function TermsContent() {
  return (
    <div className="space-y-6 prose prose-sm dark:prose-invert max-w-none">
      <section>
        <h3>§1 Postanowienia ogólne</h3>
        <ol>
          <li>Niniejszy regulamin (dalej „Regulamin”) określa zasady i warunki świadczenia usług drogą elektroniczną w ramach serwisu internetowego Dieta Nero (dalej „Serwis”), w tym zasady korzystania z kont użytkowników oraz usług płatnych.</li>
           <li>Właścicielem i administratorem Serwisu jest podmiot zarządzający aplikacją (dalej „Administrator”). Kontakt z Administratorem jest możliwy poprzez formularz kontaktowy dostępny w Serwisie.</li>
          <li>Korzystanie z Serwisu, w tym założenie konta, jest równoznaczne z pełną akceptacją niniejszego Regulaminu oraz Polityki Prywatności.</li>
          <li>Serwis ma charakter informacyjno-edukacyjny. <strong>Wszystkie treści, w tym te generowane przez narzędzia Serwisu, nie zastępują profesjonalnej porady weterynaryjnej ani dietetycznej. Każda decyzja dotycząca zdrowia i żywienia zwierzęcia musi być skonsultowana z lekarzem weterynarii.</strong></li>
        </ol>
      </section>
      
      <section>
        <h3>§2 Konta Użytkowników</h3>
        <ol>
          <li>Korzystanie z pełni funkcjonalności Serwisu wymaga założenia bezpłatnego konta Użytkownika.</li>
          <li>Rejestracja jest możliwa za pomocą adresu e-mail lub poprzez konto Google. Użytkownik jest zobowiązany do podania prawdziwych i aktualnych danych.</li>
          <li>Użytkownik jest odpowiedzialny za utrzymanie poufności swojego hasła i konta. Zabronione jest udostępnianie konta osobom trzecim.</li>
           <li>Administrator zastrzega sobie prawo do zablokowania lub usunięcia konta Użytkownika w przypadku naruszenia postanowień niniejszego Regulaminu, w szczególności dostarczania treści o charakterze bezprawnym.</li>
        </ol>
      </section>

       <section>
        <h3>§3 Plany subskrypcyjne i płatności</h3>
        <ol>
            <li>Serwis oferuje usługi w ramach planu darmowego ("Starter") oraz płatnego ("Premium"). Zakres funkcji dla każdego planu jest szczegółowo opisany w zakładce "Cennik".</li>
            <li>Dostęp do planu "Premium" wymaga uiszczenia opłaty subskrypcyjnej zgodnie z cennikiem. Subskrypcja może być opłacana w cyklu miesięcznym lub rocznym.</li>
            <li>Płatności będą obsługiwane przez zewnętrznego operatora płatności (np. Stripe), który zapewnia bezpieczeństwo transakcji. Administrator nie przechowuje danych kart kredytowych Użytkowników.</li>
            <li>Subskrypcja odnawia się automatycznie na kolejny okres rozliczeniowy, chyba że Użytkownik anuluje ją przed końcem bieżącego okresu.</li>
            <li>Użytkownik może zarządzać swoją subskrypcją i anulować ją w dowolnym momencie z poziomu panelu ustawień swojego konta. Po anulowaniu, dostęp do funkcji Premium będzie aktywny do końca opłaconego okresu.</li>
            <li>Ceny podane w cenniku są cenami brutto (zawierają podatek VAT).</li>
        </ol>
      </section>

      <section>
        <h3>§4 Zasady korzystania z Serwisu</h3>
        <ol>
          <li>Wszystkie treści w Serwisie, w tym teksty, grafiki, logo i komentarze Nero, są chronione prawem autorskim i stanowią własność Administratora.</li>
          <li>Zabronione jest dostarczanie treści o charakterze bezprawnym, obraźliwym, naruszającym dobre obyczaje lub prawa osób trzecich.</li>
          <li>Użytkownik, zgłaszając nowy składnik do bazy, oświadcza, że posiada prawa do wprowadzanych treści lub że pochodzą one z legalnych źródeł i nie naruszają praw autorskich. Administrator zastrzega sobie prawo do moderacji i edycji zgłoszonych treści.</li>
        </ol>
      </section>

      <section>
        <h3>§5 Odpowiedzialność</h3>
        <ol>
          <li>Administrator dokłada wszelkich starań, aby treści w Serwisie były rzetelne i aktualne, jednak nie daje żadnej gwarancji ich stuprocentowej poprawności, kompletności czy przydatności.</li>
          <li><strong>Administrator nie ponosi żadnej odpowiedzialności za jakiekolwiek szkody (w tym zdrowotne u zwierząt, majątkowe lub inne) wynikłe z interpretacji i zastosowania się do informacji zawartych w Serwisie. Całkowite ryzyko i odpowiedzialność spoczywają po stronie Użytkownika.</strong></li>
          <li>Narzędzia oparte na sztucznej inteligencji (AI), takie jak Kreator Posiłków i Skaner Etykiet, mogą generować informacje nieprawdziwe lub niekompletne. Wyniki ich działania należy traktować jako wstępną sugestię, która wymaga bezwzględnej weryfikacji.</li>
          <li>Administrator nie ponosi odpowiedzialności za przerwy w funkcjonowaniu Serwisu spowodowane przyczynami technicznymi lub siłą wyższą.</li>
        </ol>
      </section>

       <section>
        <h3>§6 Postanowienia końcowe</h3>
        <ol>
          <li>Administrator zastrzega sobie prawo do wprowadzania zmian w Regulaminie. O istotnych zmianach Użytkownicy zostaną poinformowani drogą mailową lub poprzez komunikat w Serwisie.</li>
          <li>Aktualna wersja Regulaminu jest zawsze dostępna w Serwisie.</li>
          <li>W sprawach nieuregulowanych niniejszym Regulaminem mają zastosowanie przepisy prawa polskiego.</li>
          <li>Data ostatniej aktualizacji: 25.07.2024.</li>
        </ol>
      </section>
    </div>
  );
}
