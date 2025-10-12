import { ContributionForm } from "@/components/contribution-form";
import { HeartHandshake } from "lucide-react";

export default function SubmitPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
            <HeartHandshake className="mx-auto w-12 h-12 text-accent mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-2">Dołącz do stada Nero!</h1>
            <p className="text-muted-foreground text-lg">Podziel się swoją wiedzą i pomóż innym psim opiekunom. Każdy wkład jest cenny!</p>
        </div>
        <ContributionForm />
      </div>
    </div>
  );
}
