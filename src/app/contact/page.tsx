import { ContactForm } from "@/components/contact-form";
import { Bug } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <Bug className="mx-auto w-12 h-12 text-accent mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-2">Zgłoś błąd lub sugestię</h1>
            <p className="text-muted-foreground text-lg">Znalazłeś błąd w aplikacji lub masz pomysł na ulepszenie? Daj nam znać!</p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
