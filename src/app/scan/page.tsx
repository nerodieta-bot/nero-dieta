import { LabelScanner } from "@/components/label-scanner";
import { ScanLine } from "lucide-react";

export default function ScanPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
            <ScanLine className="mx-auto w-12 h-12 text-accent mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-2">Skaner Etykiet</h1>
            <p className="text-muted-foreground text-lg">Zrób zdjęcie składu karmy, a Nero pomoże Ci go przeanalizować.</p>
        </div>
        <LabelScanner />
      </div>
    </div>
  );
}
