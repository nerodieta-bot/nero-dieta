
'use client';

import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Gem, Star, HelpCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { createCheckoutSession } from "./actions";
import { useUser } from "@/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { useToast } from "@/hooks/use-toast";


const plans = [
    {
        name: "Starter",
        price: "0 zł",
        priceDescription: "na zawsze",
        description: "Idealny na początek, aby poznać podstawowe możliwości Dieta Nero.",
        features: [
            "Limit 5 odsłon składników w bazie",
            "3 generacje planu posiłków",
            "5 skanów etykiet miesięcznie",
            "Możliwość zgłaszania składników"
        ],
        buttonText: "Zaczynasz tutaj",
        isFeatured: false,
    },
    {
        name: "Premium",
        price: "9,99 zł",
        annualPrice: "99 zł",
        priceDescription: "miesięcznie",
        annualPriceDescription: "rocznie (oszczędzasz ~2 miesiące!)",
        description: "Pełna moc Nero bez żadnych ograniczeń. Dla prawdziwych entuzjastów.",
        features: [
            "Wszystko z planu Starter",
            "Nielimitowany dostęp do bazy składników",
            "Nielimitowane generacje planu posiłków",
            "Nielimitowane skany etykiet",
            "Priorytetowe wsparcie mailowe",
            "Wczesny dostęp do nowych funkcji"
        ],
        buttonText: "Kupuję Premium",
        isFeatured: true,
    },
    {
        name: "Hodowca / Biznes",
        price: "od 49 zł",
        priceDescription: "miesięcznie",
        description: "Dedykowane rozwiązania dla profesjonalistów i biznesu.",
        features: [
            "Wszystko z planu Premium",
            "Wsparcie dla wielu profili psów",
            "Możliwość brandingu i personalizacji",
            "Dedykowany opiekun klienta",
            "Dostęp do API (w przygotowaniu)"
        ],
        buttonText: "Skontaktuj się z nami",
        isFeatured: false,
    }
]

const faqItems = [
    {
        question: "Co się stanie, gdy wykorzystam darmowe limity w planie Starter?",
        answer: "Po wykorzystaniu limitów (np. 5 odsłon składników lub 3 generacje planów), funkcje te zostaną tymczasowo zablokowane. Zawsze będziesz mieć dostęp do podstawowych informacji i możliwości zgłaszania nowych składników. Aby odzyskać pełny dostęp, wystarczy przejść na plan Premium."
    },
    {
        question: "Jak mogę dodać składnik, którego nie ma w bazie?",
        answer: "To proste! Przejdź do zakładki 'Zgłoś składnik' w menu. Wypełnij krótki formularz, a nasz zespół (i osobiście Nero) zweryfikuje Twoje zgłoszenie. Dzięki Tobie nasza baza staje się coraz lepsza! To praca zespołowa naszego stada."
    },
    {
        question: "Czy muszę podawać dane mojego psa w profilu?",
        answer: "Nie jest to obowiązkowe, ale bardzo to polecamy! W przyszłości planujemy wprowadzić funkcje, które będą wykorzystywać te dane (np. wagę czy wiek) do jeszcze lepszej personalizacji rekomendacji i planów żywieniowych. Twoje dane są u nas bezpieczne."
    },
    {
        question: "Do czego służą 'Polecane przez Nero' w stopce strony?",
        answer: "To specjalne miejsce, gdzie Nero dzieli się swoimi odkryciami – od sprawdzonych hodowli, przez ulubione produkty, po partnerów, których cenimy. To nasz sposób na promowanie jakości i budowanie społeczności wokół zaufanych marek."
    },
    {
        question: "Czy aplikacja działa na telefonie i komputerze?",
        answer: "Oczywiście! Dieta Nero została zaprojektowana tak, aby działać płynnie na każdym urządzeniu – od smartfonów, przez tablety, po komputery stacjonarne. Możesz sprawdzać składniki na zakupach i planować posiłki w domu."
    },
    {
        question: "Czym różni się plan miesięczny Premium od rocznego?",
        answer: "Oba plany dają Ci pełen, nielimitowany dostęp do wszystkich funkcji. Różnica leży w cenie i wygodzie. Wybierając plan roczny, płacisz raz i oszczędzasz równowartość około dwóch miesięcy subskrypcji. To najlepsza opcja dla zaangażowanych psich opiekunów!"
    },
    {
        question: "Jakie macie plany na rozwój aplikacji?",
        answer: "Mamy wielkie plany! Pracujemy nad modułem śledzenia zdrowia, bardziej zaawansowaną personalizacją, alertami o szkodliwych produktach i integracją z kalendarzem. Subskrypcja Premium to bezpośrednie wsparcie naszego rozwoju i gwarancja, że będziesz pierwszy/pierwsza, aby przetestować nowości."
    },
    {
        question: "Czy mogę zrezygnować z subskrypcji w dowolnym momencie?",
        answer: "Tak. Subskrypcją można zarządzać z poziomu panelu użytkownika. Po anulowaniu będziesz mieć dostęp do funkcji Premium do końca opłaconego okresu rozliczeniowego."
    },
    {
        question: "Czy to jednorazowa opłata, czy subskrypcja?",
        answer: "Plan Premium to subskrypcja odnawiana miesięcznie lub rocznie, w zależności od wybranej opcji. Daje Ci to stały dostęp do wszystkich funkcji i aktualizacji. Plan roczny jest bardziej opłacalny i pozwala zaoszczędzić."
    },
    {
        question: "Czy Skaner Etykiet jest w 100% dokładny?",
        answer: "Skaner wykorzystuje zaawansowaną technologię do odczytywania tekstu ze zdjęć. Działa najlepiej na wyraźnych, dobrze oświetlonych etykietach. Pamiętaj, że to narzędzie pomocnicze – jeśli masz wątpliwości co do odczytu, zawsze porównaj wynik z listą składników na opakowaniu."
    },
    {
        question: "Dlaczego mam ufać informacjom w aplikacji?",
        answer: "Każdy składnik w naszej bazie jest starannie weryfikowany na podstawie wielu wiarygodnych, międzynarodowych źródeł, takich jak publikacje American Kennel Club (AKC), ASPCA, czy amerykańskiej Agencji Żywności i Leków (FDA). Co więcej, na stronie szczegółów każdego składnika znajdziesz bezpośredni, klikalny link do głównego źródła, z którego pochodzą informacje. Dzięki temu masz pełną przejrzystość i możesz samodzielnie zweryfikować dane. Pamiętaj jednak, że aplikacja ma charakter informacyjny i nie zastępuje porady lekarza weterynarii."
    },
    {
        question: "Pytanie od Nero: Czy jak kupię Premium, dostanę więcej smaczków?",
        answer: "Nero macha ogonem i szczeka radośnie! 'Mój człowiek mówi, że każda subskrypcja wspiera moją misję i rozwój tej aplikacji. A jak on jest szczęśliwy, to... tak, prawdopodobieństwo smaczków rośnie! Kupując Premium, dołączasz do mojego elitarnego stada i pomagasz dbać o brzuszki wszystkich psów!'"
    },
    {
        question: "Czym różni się Kreator Posiłków od Skanera Etykiet?",
        answer: "Kreator Posiłków generuje kompletne, zbilansowane przepisy na podstawie podanych przez Ciebie składników. Skaner Etykiet służy do szybkiej analizy gotowych produktów – robisz zdjęcie składu karmy, a Nero ocenia go pod kątem bezpieczeństwa dla Twojego psa."
    },
    {
        question: "Czy moje dane są bezpieczne?",
        answer: "Absolutnie. Bezpieczeństwo Twoich danych to dla nas priorytet. Korzystamy z bezpiecznego uwierzytelniania Firebase by Google i szyfrowanego połączenia SSL. Nigdy nie udostępniamy Twoich danych stronom trzecim. Więcej informacji znajdziesz w naszej Polityce Prywatności."
    },
    {
        question: "Czy oferujecie zwroty za subskrypcję?",
        answer: "Ze względu na cyfrowy charakter naszych usług, co do zasady nie oferujemy zwrotów. Jeśli jednak napotkasz problemy techniczne lub nie jesteś zadowolony/zadowolona z usługi, skontaktuj się z nami. Każdy przypadek rozpatrujemy indywidualnie."
    },
     {
        question: "Czy płatności są bezpieczne?",
        answer: "Oczywiście. Wkrótce zintegrujemy system płatności Stripe, światowego lidera w dziedzinie bezpiecznych transakcji online. Dane Twojej karty nigdy nie trafiają na nasze serwery, a cały proces jest szyfrowany i chroniony zgodnie z najwyższymi standardami."
    },
]

function PricingPageContent() {
    const { user } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [loadingPlan, setLoadingPlan] = useState<'monthly' | 'yearly' | null>(null);

    useEffect(() => {
        const status = searchParams.get('status');
        if (status === 'cancelled') {
            toast({
                title: 'Płatność anulowana',
                description: 'Twoja płatność została anulowana. Możesz spróbować ponownie w dowolnym momencie.',
                variant: 'destructive',
            });
            // Clean up the URL
            router.replace('/pricing', { scroll: false });
        }
    }, [searchParams, router, toast]);


    const handleCheckout = async (plan: 'monthly' | 'yearly') => {
        if (!user) {
            router.push('/login?redirect=/pricing');
            return;
        }

        setLoadingPlan(plan);

        try {
            if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
                 toast({
                    variant: 'destructive',
                    title: 'Błąd konfiguracji',
                    description: 'Płatności są chwilowo niedostępne. Spróbuj ponownie później.',
                });
                return;
            }
            
            const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

            const res = await createCheckoutSession(plan);
            if (res.error || !res.sessionId) {
                throw new Error(res.error || 'Nie udało się utworzyć sesji płatności.');
            }

            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('Stripe.js nie został załadowany.');
            }

            const { error } = await stripe.redirectToCheckout({
                sessionId: res.sessionId,
            });

            if (error) {
                throw new Error(error.message);
            }

        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Błąd płatności',
                description: error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.',
            });
        } finally {
            setLoadingPlan(null);
        }
    };


    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-12">
                    <Gem className="mx-auto w-12 h-12 text-accent mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
                        Wybierz plan dla siebie
                    </h1>
                    <p className="text-lg text-muted-foreground">Odblokuj pełen potencjał Dieta Nero i zadbaj o swojego psa jak nigdy dotąd.</p>
                </header>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan) => (
                        <Card key={plan.name} className={cn("flex flex-col h-full", plan.isFeatured && "border-primary ring-2 ring-primary shadow-2xl")}>
                            {plan.isFeatured && (
                                <div className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider text-center py-1 rounded-t-lg flex items-center justify-center gap-2">
                                   <Star className="w-4 h-4" /> Najpopularniejszy
                                </div>
                            )}
                            <CardHeader className="items-center text-center">
                                <CardTitle className="text-2xl font-headline text-primary">{plan.name}</CardTitle>
                                <div className="text-4xl font-bold">
                                    {plan.price}
                                </div>
                                <CardDescription>{plan.priceDescription}</CardDescription>
                                {plan.annualPrice && (
                                    <div className="mt-2">
                                        <div className="font-semibold text-sm">
                                            lub {plan.annualPrice}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {plan.annualPriceDescription}
                                        </div>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-center text-muted-foreground mb-6 h-12">{plan.description}</p>
                                <ul className="space-y-3 text-sm">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <Check className="w-4 h-4 mr-2 mt-1 text-green-500 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                {plan.name === 'Starter' && (
                                    <Button asChild className="w-full" variant="outline">
                                        <Link href="/">{plan.buttonText}</Link>
                                    </Button>
                                )}
                                {plan.name === 'Hodowca / Biznes' && (
                                     <Button asChild className="w-full" variant="outline">
                                        <Link href="/contact">{plan.buttonText}</Link>
                                    </Button>
                                )}
                                {plan.isFeatured && (
                                    <>
                                        <Button 
                                            onClick={() => handleCheckout('monthly')} 
                                            className="w-full"
                                            disabled={loadingPlan !== null}
                                        >
                                            {loadingPlan === 'monthly' ? <Loader2 className="animate-spin" /> : 'Kupuję Premium (miesięcznie)'}
                                        </Button>
                                         <Button 
                                            onClick={() => handleCheckout('yearly')}
                                            className="w-full"
                                            variant="secondary"
                                            disabled={loadingPlan !== null}
                                        >
                                            {loadingPlan === 'yearly' ? <Loader2 className="animate-spin" /> : 'Kupuję Premium (rocznie)'}
                                        </Button>
                                    </>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                
                <section id="faq" className="mt-20">
                    <header className="text-center mb-12">
                        <HelpCircle className="mx-auto w-12 h-12 text-accent mb-4" />
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-4">
                            Często Zadawane Pytania
                        </h2>
                        <p className="text-lg text-muted-foreground">Masz wątpliwości? Tutaj znajdziesz odpowiedzi.</p>
                    </header>
                    <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                        {faqItems.map((item, index) => (
                            <AccordionItem value={`item-${index + 1}`} key={index}>
                                <AccordionTrigger className="text-lg text-left font-semibold hover:no-underline">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className='text-base text-muted-foreground'>
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>


                 <div className="text-center mt-16 text-sm text-muted-foreground">
                    <p>Nadal masz pytania? <Link href="/contact" className="underline hover:text-primary">Skontaktuj się z nami</Link>, chętnie pomożemy.</p>
                </div>
            </div>
        </div>
    );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Ładowanie cennika...</p>
        </div>
      </div>
    }>
      <PricingPageContent />
    </Suspense>
  );
}

    
