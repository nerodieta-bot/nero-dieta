import { ReportBugForm } from "@/components/report-bug-form";
import { Bug } from "lucide-react";

export default function ReportBugPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <Bug className="mx-auto w-12 h-12 text-accent mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-2">Zgłoś błąd w aplikacji</h1>
            <p className="text-muted-foreground text-lg">Znalazłeś błąd? Dziękujemy, że pomagasz nam ulepszać Dieta Nero!</p>
        </div>
        <ReportBugForm />
      </div>
    </div>
  );
}
