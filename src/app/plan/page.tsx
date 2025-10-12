import { MealPlanForm } from '@/components/meal-plan-form';
import { Lightbulb } from 'lucide-react';

export default function MealPlanPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
            <Lightbulb className="mx-auto w-12 h-12 text-accent mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-2">Kreator Posiłków</h1>
            <p className="text-muted-foreground text-lg">Wygeneruj zbilansowany plan żywieniowy dla swojego psa z pomocą Nero.</p>
        </div>
        <MealPlanForm />
      </div>
    </div>
  );
}
