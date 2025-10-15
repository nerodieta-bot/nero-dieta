
# Dieta Jedi - Dokumentacja Projektu

## 1. Opis Ogólny

**Dieta Jedi** to aplikacja internetowa stworzona jako przewodnik po żywieniu psa. Jej głównym celem jest pomoc właścicielom w podejmowaniu świadomych decyzji dotyczących diety ich pupili. Aplikacja została zbudowana jako w pełni funkcjonalny prototyp (MVP - Minimum Viable Product).

**Główne Funkcje:**
*   **Baza Składników:** Obszerna, przeszukiwalna i filtrowalna baza danych składników żywności z oceną ich bezpieczeństwa dla psów (Bezpieczny, Umiarkowany, Zakazany).
*   **Kreator Posiłków (AI):** Narzędzie oparte na AI (Genkit/Gemini), które generuje spersonalizowane plany żywieniowe na podstawie danych psa i dostępnych składników.
*   **Skaner Etykiet (AI):** Funkcja wykorzystująca AI do analizy zdjęcia etykiety karmy dla zwierząt i oceny jej składu pod kątem bezpieczeństwa.
*   **System Użytkowników:** Możliwość rejestracji i logowania (za pomocą Google), co daje dostęp do rozszerzonych funkcji.
*   **System Płatności (Subskrypcje):** Integracja z systemem Stripe w celu obsługi planów subskrypcyjnych (Starter i Premium), które odblokowują nielimitowany dostęp do funkcji.
*   **Społeczność:** Użytkownicy mogą zgłaszać nowe składniki do bazy, pomagając w jej rozbudowie.

---

## 2. Architektura i Technologie

Projekt został zbudowany w oparciu o nowoczesny stos technologiczny, z wyraźnym podziałem na frontend, backend i usługi AI.

*   **Frontend:**
    *   **Framework:** [Next.js](https://nextjs.org/) (z App Router) - framework oparty na React, umożliwiający renderowanie po stronie serwera (SSR) i generowanie statycznych stron (SSG).
    *   **Styling:** [Tailwind CSS](https://tailwindcss.com/) oraz [Shadcn/ui](https://ui.shadcn.com/) - biblioteka gotowych, konfigurowalnych komponentów UI.
    *   **Język:** TypeScript.

*   **Backend i Baza Danych (Firebase):**
    *   **Uwierzytelnianie:** [Firebase Authentication](https://firebase.google.com/products/auth) - obsługa logowania i rejestracji (dostawca Google).
    *   **Baza Danych:** [Firestore](https://firebase.google.com/products/firestore) - nierelacyjna baza danych NoSQL do przechowywania danych o użytkownikach, ich subskrypcjach i zgłoszeniach.
    *   **Logika serwerowa:** [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) oraz [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) - do obsługi logiki biznesowej, np. komunikacji ze Stripe czy aktualizacji profilu.

*   **Sztuczna Inteligencja (AI):**
    *   **Orkiestracja:** [Genkit](https://firebase.google.com/docs/genkit) - framework do budowania i zarządzania przepływami AI.
    *   **Model Językowy:** [Google Gemini](https://ai.google/gemini/) - używany do generowania planów posiłków i analizy etykiet.

---

## 3. Struktura Projektu i Kluczowe Pliki

Najważniejsze pliki i foldery w projekcie:

*   `src/app/` - Główny katalog aplikacji Next.js (App Router).
    *   `src/app/page.tsx` - Strona główna.
    *   `src/app/skladnik/[slug]/page.tsx` - Strona szczegółów składnika.
    *   `src/app/(plan|scan|profil|...)/page.tsx` - Pozostałe podstrony aplikacji.
    *   `src/app/api/` - Endpointy API (np. do obsługi webhooków Stripe).
    *   `src/app/data/ingredients.ts` - Statyczna baza danych składników (serce aplikacji).
*   `src/components/` - Komponenty Reusable React (np. formularze, karty, nawigacja).
    *   `src/components/ui/` - Komponenty z biblioteki Shadcn/ui.
*   `src/firebase/` - Pliki konfiguracyjne i hooki do obsługi Firebase po stronie klienta.
*   `src/ai/flows/` - Definicje przepływów Genkit, które komunikują się z modelem Gemini.
*   `docs/backend.json` - **Kluczowy plik!** To "mapa" lub "schemat" całej struktury backendu w Firestore. Definiuje, jakie kolekcje istnieją (`users`, `ingredients` itp.) i jakiego kształtu (schematu) są przechowywane w nich dane. Służy jako dokumentacja i podstawa do automatyzacji.
*   `firestore.rules` - Plik z regułami bezpieczeństwa dla bazy danych Firestore. Określa, kto ma prawo do odczytu i zapisu danych w poszczególnych kolekcjach.
*   `firebase.json` - Konfiguracja dla emulatorów Firebase. Mówi, które usługi (Auth, Firestore) mają być uruchomione lokalnie podczas dewelopmentu i na jakich portach.
*   `apphosting.yaml` - Podstawowa konfiguracja dla usługi [Firebase App Hosting](https://firebase.google.com/docs/app-hosting). Definiuje, jak aplikacja ma być uruchamiana w środowisku produkcyjnym.

---

## 4. Hosting i Środowisko (Aspekty "Ukryte")

Aplikacja jest przystosowana do wdrożenia na **Firebase App Hosting**, nowoczesnej platformie Google do hostowania aplikacji webowych.

*   **Jak to działa?** Firebase App Hosting automatycznie buduje aplikację Next.js i wdraża ją na zarządzanej infrastrukturze serwerowej. Plik `apphosting.yaml` zawiera podstawowe instrukcje dla tego procesu, np. maksymalną liczbę instancji serwera.
*   **Środowisko deweloperskie vs. produkcyjne:**
    *   **Lokalnie (dewelopersko):** Aplikacja łączy się z **emulatorami Firebase**. To lokalne symulatory usług Auth i Firestore, co pozwala na pracę bez połączenia z internetem i bez ponoszenia kosztów. Konfiguracja emulatorów znajduje się w `firebase.json`.
    *   **W chmurze (produkcyjnie):** Po wdrożeniu na Firebase App Hosting, aplikacja **automatycznie** połączy się z **prawdziwymi usługami Firebase** powiązanymi z Twoim projektem. Nie wymaga to zmiany kodu – platforma sama dostarcza odpowiednie klucze i konfigurację poprzez zmienne środowiskowe.
*   **Klucze i Sekrety:** Wrażliwe dane, takie jak klucze API do Stripe czy Resend (usługa do wysyłania e-maili), powinny być przechowywane jako "Secrets" w Google Secret Manager i podłączane do środowiska App Hosting. W pliku `.env` znajdują się tylko przykładowe nazwy zmiennych.

---

## 5. Aktualny Status i Co Dalej?

### Status:
Projekt jest **w pełni funkcjonalnym prototypem**. Wszystkie opisane na początku funkcje zostały zaimplementowane i działają w środowisku deweloperskim z emulatorami. Stworzono interfejs, logikę biznesową, integrację z AI i Firebase.

### Czego brakuje / Co robić dalej?

1.  **Wdrożenie na produkcję (Deployment):**
    *   **Krok 1: Załóż projekt Firebase.** Jeśli jeszcze go nie masz, utwórz nowy projekt w [konsoli Firebase](https://console.firebase.google.com/).
    *   **Krok 2: Podłącz projekt.** Użyj komendy `firebase use <projectId>` w terminalu, aby połączyć swój lokalny projekt z projektem w chmurze.
    *   **Krok 3: Skonfiguruj sekrety.** Dodaj klucze API (Stripe, Resend) do Google Secret Manager i nadaj do nich uprawnienia w App Hosting.
    *   **Krok 4: Wdróż aplikację.** Użyj komendy `firebase apphosting:backends:deploy` lub skonfiguruj automatyczne wdrożenia z repozytorium GitHub.
    *   **Krok 5: Wdróż reguły Firestore.** Uruchom `firebase deploy --only firestore:rules`, aby wgrać reguły bezpieczeństwa do produkcyjnej bazy danych.

2.  **Rozwój Funkcjonalny:**
    *   **Rozbudowa bazy danych:** Obecnie składniki są w statycznym pliku (`ingredients.ts`). Należy je przenieść do kolekcji `ingredients` w bazie Firestore i zbudować panel administracyjny do zarządzania nimi.
    *   **Zarządzanie zgłoszeniami:** Zbudować interfejs dla administratora do przeglądania i akceptowania składników zgłaszanych przez użytkowników (kolekcja `user_contributions`).
    *   **Testowanie i Optymalizacja:** Przeprowadzić testy wydajności, zoptymalizować zapytania do bazy danych i działanie funkcji AI.
    *   **Monitoring i analityka:** Zintegrować narzędzia do monitorowania błędów i analizy zachowań użytkowników (np. Google Analytics, Sentry).

Projekt "Dieta Jedi" ma solidne fundamenty i jest gotowy do dalszego rozwoju i wdrożenia na środowisko produkcyjne.
