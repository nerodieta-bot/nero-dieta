'use client';
import { useActionState, useRef } from 'react';
import { createMealPlanAction, type FormState } from '@/app/plan/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Printer, Lock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import Link from 'next/link';

const initialState: FormState = {
  message: '',
  mealPlan: undefined,
  errors: undefined,
  generationsLeft: 2,
};

interface MealPlanFormProps {
    generationsLeft: number;
}

export function MealPlanForm({ generationsLeft }: MealPlanFormProps) {
  const [formState, formAction, isPending] = useActionState(
    createMealPlanAction,
    {...initialState, generationsLeft}
  );

  const mealPlanRef = useRef<HTMLDivElement>(null);
  const hasReachedLimit = formState.generationsLeft <= 0;

  const handlePrint = () => {
    const printContent = mealPlanRef.current?.innerHTML;
    if (printContent) {
      const printWindow = window.open('', '', 'height=800,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Dieta Nero - Plan Posiłków</title>');
        printWindow.document.write(`
          <style>
            @import url('https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap');
            body { 
              font-family: 'PT Sans', sans-serif; 
              line-height: 1.6; 
              margin: 40px;
              color: #333;
            }
            h1, h2, h3 { 
              font-family: 'PT Sans', sans-serif;
              color: #386641;
              border-bottom: 2px solid #f0f0f0;
              padding-bottom: 10px;
              margin-top: 24px;
            }
            h1 { font-size: 2.25rem; }
            h2 { font-size: 1.75rem; }
            h3 { font-size: 1.25rem; font-weight: bold; }
            ul { 
              list-style-type: '✓ ';
              padding-left: 20px; 
            }
            li { 
              margin-bottom: 10px; 
              padding-left: 10px;
            }
            p {
              margin-bottom: 16px;
            }
            strong {
              color: #386641;
            }
          </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h1>Oto Twój Plan Posiłków!</h1>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };


  const getHtml = (html?: string) => {
    if (!html) return { __html: '' };
    return { __html: html };
  };

  return (
    <Card className="w-full">
        {hasReachedLimit ? (
             <CardHeader>
                <CardTitle className="text-destructive">Osiągnięto limit generacji</CardTitle>
                <CardDescription>
                    Wykorzystałeś już swoje dwie darmowe generacje planu posiłków.
                </CardDescription>
             </CardHeader>
        ) : (
            <CardHeader>
                <CardTitle>Dane Twojego psa</CardTitle>
                <CardDescription>
                Wypełnij formularz, abyśmy mogli stworzyć idealny plan posiłków. Pozostało Ci <span className="font-bold text-primary">{formState.generationsLeft}</span> darmowych generacji.
                </CardDescription>
            </CardHeader>
        )}
      
      {hasReachedLimit ? (
         <CardContent>
            <Alert variant="destructive" className="bg-destructive/10">
                <Lock className="h-4 w-4" />
                <AlertTitle>Dostęp zablokowany</AlertTitle>
                <AlertDescription>
                    Dziękujemy za zainteresowanie! Aby uzyskać nielimitowany dostęp do Kreatora Posiłków oraz indywidualne konsultacje, skontaktuj się z nami w celu omówienia planu premium.
                    <Button asChild className="mt-4 w-full">
                        <Link href="/contact">Skontaktuj się z nami</Link>
                    </Button>
                </AlertDescription>
            </Alert>
         </CardContent>
      ) : (
        <form action={formAction}>
            <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="dogWeight">Waga psa (kg)</Label>
                <Input type="number" id="dogWeight" name="dogWeight" defaultValue="3" step="0.1" min="0.5" max="10" />
                {formState.errors?.dogWeight && (
                <p className="text-sm text-destructive">{formState.errors.dogWeight[0]}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="dogAge">Wiek psa (lata)</Label>
                <Input type="number" id="dogAge" name="dogAge" defaultValue="5" step="1" min="0" max="20" />
                {formState.errors?.dogAge && (
                <p className="text-sm text-destructive">{formState.errors.dogAge[0]}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label>Poziom aktywności</Label>
                <Select name="activityLevel" defaultValue="moderate">
                <SelectTrigger>
                    <SelectValue placeholder="Wybierz poziom aktywności..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="sedentary">
                    Kanapowiec (mało aktywny)
                    </SelectItem>
                    <SelectItem value="moderate">
                    Spacerowicz (średnio aktywny)
                    </SelectItem>
                    <SelectItem value="active">
                    Sportowiec (bardzo aktywny)
                    </SelectItem>
                </SelectContent>
                </Select>
                {formState.errors?.activityLevel && (
                <p className="text-sm text-destructive">{formState.errors.activityLevel[0]}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="ingredients">Dostępne składniki</Label>
                <Textarea
                id="ingredients"
                name="ingredients"
                placeholder="Wpisz dostępne składniki, oddzielając je przecinkami (np. kurczak, marchew, ryż)..."
                defaultValue="Gotowany kurczak, ryż, marchewka, olej z łososia"
                rows={4}
                />
                {formState.errors?.ingredients && (
                <p className="text-sm text-destructive">{formState.errors.ingredients[0]}</p>
                )}
            </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
            <Button type="submit" disabled={isPending} className="w-full md:w-auto">
                {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isPending ? 'Generowanie...' : 'Generuj plan'}
            </Button>

            {formState.message && !formState.mealPlan && !formState.errors && (
                <p className="text-sm text-destructive">{formState.message}</p>
            )}

            {isPending && (
                <div className="w-full text-center p-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-4 text-muted-foreground">
                    Analizuję dane i tworzę plan... To może zająć chwilę.
                </p>
                </div>
            )}

            {formState.mealPlan && !isPending && (
                <Card className="w-full bg-primary/5 dark:bg-primary/10">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Oto Twój Plan Posiłków!</CardTitle>
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Drukuj
                    </Button>
                </CardHeader>
                <CardContent>
                    <div
                    ref={mealPlanRef}
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={getHtml(formState.mealPlan)}
                    />
                </CardContent>
                </Card>
            )}
            </CardFooter>
        </form>
      )}
    </Card>
  );
}
