export function TermsContent() {
  return (
    <div className="space-y-6 prose prose-sm dark:prose-invert max-w-none">
      <section>
        <h3>§1 Postanowienia ogólne</h3>
        <ol>
          <li>Niniejszy regulamin (zwany dalej „Regulaminem”) określa zasady korzystania z serwisu internetowego Dieta Nero, dostępnego pod adresem URL, na którym jest opublikowany (zwanego dalej „Serwisem”).</li>
          <li>Korzystanie z Serwisu jest możliwe wyłącznie po akceptacji niniejszego Regulaminu oraz Polityki Prywatności. Brak akceptacji jest równoznaczny z brakiem możliwości korzystania z Serwisu.</li>
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
              <li>Korzystanie z narzędzia "Kreator Posiłków" do generowania przykładowych planów posiłków przy użyciu sztucznej inteligencji (AI).</li>
              <li>Korzystanie z narzędzia "Skaner Etykiet" do analizy składu produktów na podstawie zdjęcia.</li>
              <li>Zgłaszanie propozycji nowych składników do bazy danych.</li>
            </ul>
          </li>
          <li>Wszystkie usługi w Serwisie są świadczone nieodpłatnie.</li>
        </ol>
      </section>

      <section>
        <h3>§3 Zasady korzystania z Serwisu</h3>
        <ol>
          <li>Informacje zawarte w Serwisie, w tym te generowane przez narzędzia AI (Kreator Posiłków, Skaner Etykiet), mają charakter wyłącznie poglądowy i inspiracyjny.</li>
          <li>Każda decyzja dotycząca diety, zdrowia i żywienia psa powinna być bezwzględnie skonsultowana z lekarzem weterynarii lub specjalistą ds. żywienia zwierząt.</li>
          <li>Użytkownik, zgłaszając nowy składnik, oświadcza, że posiada prawa do wprowadzanych treści lub że pochodzą one z legalnych i publicznie dostępnych źródeł.</li>
          <li>Zabronione jest dostarczanie treści o charakterze bezprawnym, obraźliwym, naruszającym dobre obyczaje lub prawa osób trzecich.</li>
          <li>Administrator zastrzega sobie prawo do weryfikacji, edycji lub usunięcia treści zgłoszonych przez Użytkowników bez podania przyczyny.</li>
        </ol>
      </section>

      <section>
        <h3>§4 Odpowiedzialność</h3>
        <ol>
          <li>Administrator dokłada wszelkich starań, aby treści w Serwisie były rzetelne i aktualne, jednak nie daje żadnej gwarancji ich stuprocentowej poprawności, kompletności czy przydatności.</li>
          <li>Administrator nie ponosi żadnej odpowiedzialności za jakiekolwiek szkody (w tym zdrowotne u zwierząt, majątkowe lub inne) wynikłe z interpretacji i zastosowania się do informacji zawartych w Serwisie. Całkowite ryzyko i odpowiedzialność spoczywają po stronie Użytkownika.</li>
          <li>Narzędzia oparte na sztucznej inteligencji (AI), takie jak Kreator Posiłków i Skaner Etykiet, mogą generować informacje nieprawdziwe, niekompletne lub nieadekwatne. Wyniki ich działania należy traktować jako wstępną sugestię, która wymaga bezwzględnej weryfikacji przez specjalistę.</li>
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
    </div>
  );
}
