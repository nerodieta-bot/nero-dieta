import { ContactForm } from "@/components/contact-form";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <Mail className="mx-auto w-12 h-12 text-accent mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-2">Skontaktuj się z nami</h1>
            <p className="text-muted-foreground text-lg">Masz pytania lub sugestie? Chętnie Cię wysłuchamy!</p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
