
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Gem, Star } from "lucide-react";
import Link from "next/link";

const plans = [
    {
        name: "Starter",
        price: "0 zł",
        priceDescription: "na zawsze",
        description: "Idealny na początek, aby poznać podstawowe możliwości Dieta Nero.",
        features: [
            "Limit 5 odsłon składników w bazie",
            "3 generacje planu posiłków AI",
            "5 skanów etykiet miesięcznie",
            "Możliwość zgłaszania składników"
        ],
        buttonText: "Zaczynasz tutaj",
        isFeatured: false,
    },
    {
        name: "Premium",
        price: "19 zł",
        priceDescription: "miesięcznie",
        description: "Pełna moc Nero bez żadnych ograniczeń. Dla prawdziwych entuzjastów.",
        features: [
            "Wszystko z planu Starter",
            "Nielimitowany dostęp do bazy składników",
            "Nielimitowane generacje planu posiłków AI",
            "Nielimitowane skany etykiet",
            "Priorytetowe wsparcie mailowe",
            "Wczesny dostęp do nowych funkcji"
        ],
        buttonText: "Kupuję Premium",
        isFeatured: true,
    },
    {
        name: "Hodowca / Biznes",
        price: "od 99 zł",
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

export default function PricingPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
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
                                    <Link href={plan.price === "0 zł" ? "/" : "/contact"}>{plan.buttonText}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                 <div className="text-center mt-12 text-sm text-muted-foreground">
                    <p>Masz pytania? <Link href="/contact" className="underline hover:text-primary">Skontaktuj się z nami</Link>, chętnie pomożemy.</p>
                </div>
            </div>
        </div>
    );
}
