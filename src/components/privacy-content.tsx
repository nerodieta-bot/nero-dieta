export function PrivacyContent() {
    return (
        <div className="space-y-6 prose prose-sm dark:prose-invert max-w-none">
            <section>
              <h3>§1 Informacje ogólne</h3>
              <ol>
                <li>Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazywanych przez Użytkowników w związku z korzystaniem przez nich z usług oferowanych przez serwis Dieta Nero (dalej: "Serwis").</li>
                <li>Administratorem Twoich danych osobowych w rozumieniu przepisów o ochronie danych osobowych jest podmiot zarządzający aplikacją (dalej: "Administrator").</li>
                <li>Szanujemy Twoje prawo do prywatności i dbamy o bezpieczeństwo danych. W tym celu używany jest m.in. bezpieczny protokół szyfrowania komunikacji (SSL).</li>
                <li>Dane osobowe podawane w formularzach są traktowane jako poufne i nie są widoczne dla osób nieuprawnionych.</li>
              </ol>
            </section>
            
            <section>
              <h3>§2 Jakie dane zbieramy i dlaczego?</h3>
              <ol>
                <li>
                  <strong>Dane zbierane podczas rejestracji i korzystania z konta:</strong>
                  <ul>
                    <li>Gdy tworzysz konto, prosimy Cię o podanie adresu e-mail. Jeśli logujesz się przez Google, automatycznie otrzymujemy Twój adres e-mail oraz imię i nazwisko powiązane z kontem Google.</li>
                    <li>W profilu użytkownika możesz dobrowolnie podać swoje imię oraz imię psa.</li>
                    <li><strong>Cel:</strong> Dane te są niezbędne do świadczenia usługi, czyli założenia i obsługi Twojego konta, umożliwienia logowania oraz personalizacji (np. zwracania się do Ciebie po imieniu). Przetwarzamy je na podstawie art. 6 ust. 1 lit. b RODO (wykonanie umowy).</li>
                  </ul>
                </li>
                 <li>
                  <strong>Dane zbierane podczas korzystania z funkcji Serwisu:</strong>
                  <ul>
                    <li>Gdy korzystasz z Kreatora Posiłków lub Skanera Etykiet, przetwarzamy dane, które wprowadzasz (np. waga psa, dostępne składniki, zdjęcia etykiet), aby wygenerować dla Ciebie odpowiedź. Dane te nie są trwale zapisywane w powiązaniu z Twoim kontem.</li>
                    <li>Zliczamy, ile razy korzystasz z funkcji premium (odsłony składników, generowanie planów), aby zarządzać limitami w planie darmowym.</li>
                    <li><strong>Cel:</strong> Realizacja kluczowych funkcjonalności serwisu.</li>
                  </ul>
                </li>
                <li>
                  <strong>Dane zbierane automatycznie (logi serwera):</strong>
                  <ul>
                     <li>Podczas Twojej wizyty w Serwisie automatycznie zbierane są dane dotyczące Twojej wizyty, np. adres IP, typ przeglądarki, nazwa domeny.</li>
                    <li><strong>Cel:</strong> Diagnozowanie problemów technicznych, zapewnienie bezpieczeństwa oraz tworzenie anonimowych statystyk, które pomagają nam ulepszać Serwis. Podstawą prawną jest tu nasz uzasadniony interes (art. 6 ust. 1 lit. f RODO).</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section>
              <h3>§3 Udostępnianie danych i okres przechowywania</h3>
              <ol>
                <li>Twoje dane osobowe są przetwarzane przez Administratora. Korzystamy z usług zewnętrznych dostawców, którzy wspierają nas w świadczeniu usług (hosting, system uwierzytelniania, analityka), takich jak Google (Firebase). Podmioty te przetwarzają dane na nasze zlecenie i zgodnie z naszymi instrukcjami.</li>
                <li>Twoje dane przechowujemy przez okres posiadania przez Ciebie konta w Serwisie. Po usunięciu konta, Twoje dane zostaną trwale usunięte lub zanonimizowane.</li>
              </ol>
            </section>

            <section>
              <h3>§4 Twoje prawa</h3>
              <ol>
                <li>Przysługuje Ci prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, prawo do wniesienia sprzeciwu, a także prawo do przenoszenia danych.</li>
                <li>Masz prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych, gdy uznasz, iż przetwarzanie Twoich danych osobowych narusza przepisy RODO.</li>
                <li>Podanie danych osobowych jest dobrowolne, ale niezbędne do założenia konta i korzystania z pełni funkcjonalności Serwisu.</li>
              </ol>
            </section>

             <section>
              <h3>§5 Pliki Cookies</h3>
              <ol>
                <li>Serwis używa plików cookies (tzw. "ciasteczek"). Są to niewielkie pliki tekstowe wysyłane przez serwer www i przechowywane przez oprogramowanie komputera przeglądarki.</li>
                <li>Używamy plików cookies w celu:
                    <ul>
                        <li>Zapisania Twojej zgody na warunki Regulaminu i Polityki Prywatności (niezbędne do działania serwisu).</li>
                        <li>Utrzymania Twojej sesji po zalogowaniu (nie musisz logować się na każdej podstronie).</li>
                        <li>Tworzenia anonimowych statystyk, które pomagają zrozumieć, w jaki sposób Użytkownicy korzystają ze stron internetowych, co umożliwia ulepszanie ich struktury i zawartości.</li>
                    </ul>
                </li>
                 <li>Możesz w każdej chwili wyłączyć lub ograniczyć obsługę plików cookies w ustawieniach swojej przeglądarki internetowej. Pamiętaj jednak, że może to wpłynąć na niektóre funkcjonalności dostępne w Serwisie.</li>
              </ol>
            </section>

            <section>
              <h3>§6 Postanowienia końcowe</h3>
              <ol>
                <li>Administrator zastrzega sobie prawo do wprowadzania zmian w polityce prywatności. O wszelkich zmianach będziemy informować w sposób widoczny i zrozumiały.</li>
                <li>W sprawach nieuregulowanych niniejszą Polityką Prywatności mają zastosowanie odpowiednie przepisy prawa polskiego oraz unijnego (RODO).</li>
                <li>Data ostatniej aktualizacji: 25.07.2024.</li>
              </ol>
            </section>
        </div>
    );
}
