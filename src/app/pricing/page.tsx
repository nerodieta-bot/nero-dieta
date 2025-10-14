

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Gem, Star, HelpCircle } from "lucide-react";
import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

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
        answer: "Po wykorzystaniu darmowych limitów (5 odsłon składników, 3 generacje planów lub 5 skanów), dane funkcje zostaną tymczasowo zablokowane do czasu odnowienia limitu lub przejścia na plan Premium. Nadal będziesz mógł/mogła zgłaszać nowe składniki."
    },
    {
        question: "Czy płatności są bezpieczne?",
        answer: "Oczywiście. Wkrótce zintegrujemy system płatności Stripe, światowego lidera w dziedzinie bezpiecznych transakcji online. Dane Twojej karty nigdy nie trafiają na nasze serwery, a cały proces jest szyfrowany i chroniony zgodnie z najwyższymi standardami."
    },
    {
        question: "Czy mogę zrezygnować z subskrypcji w dowolnym momencie?",
        answer: "Tak. Subskrypcją można zarządzać z poziomu panelu użytkownika. Po anulowaniu będziesz mieć dostęp do funkcji Premium do końca opłaconego okresu rozliczeniowego."
    },
    {
        question: "Czym różni się Kreator Posiłków od Skanera Etykiet?",
        answer: "Kreator Posiłków generuje kompletne, zbilansowane przepisy na podstawie podanych przez Ciebie składników. Skaner Etykiet służy do szybkiej analizy gotowych produktów – robisz zdjęcie składu karmy, a Nero ocenia go pod kątem bezpieczeństwa dla Twojego psa."
    },
    {
        question: "Dlaczego mam ufać informacjom w aplikacji?",
        answer: "Każdy składnik w naszej bazie jest starannie weryfikowany na podstawie wielu wiarygodnych, międzynarodowych źródeł, takich jak publikacje American Kennel Club (AKC), ASPCA, czy amerykańskiej Agencji Żywności i Leków (FDA). Co więcej, na stronie szczegółów każdego składnika znajdziesz bezpośredni, klikalny link do głównego źródła, z którego pochodzą informacje. Dzięki temu masz pełną przejrzystość i możesz samodzielnie zweryfikować dane. Pamiętaj jednak, że aplikacja ma charakter informacyjny i nie zastępuje porady lekarza weterynarii."
    },
     {
        question: "Czy to jednorazowa opłata, czy subskrypcja?",
        answer: "Plan Premium to subskrypcja odnawiana miesięcznie lub rocznie, w zależności od wybranej opcji. Daje Ci to stały dostęp do wszystkich funkcji i aktualizacji. Plan roczny jest bardziej opłacalny i pozwala zaoszczędzić."
    },
]

export default function PricingPage() {
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
                            <CardFooter>
                                <Button asChild className={cn("w-full", !plan.isFeatured && "variant-outline")} size="lg">
                                    <Link href={plan.name === "Hodowca / Biznes" ? "/contact" : plan.name === "Premium" ? "/login" : "/"}>{plan.buttonText}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                
                <section className="mt-20">
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
