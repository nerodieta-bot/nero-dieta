'use client';
import { useActionState } from 'react';
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
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { marked } from 'marked';
import { Label } from './ui/label';

const initialState: FormState = {
  message: '',
};

export function MealPlanForm() {
  const [formState, formAction, isPending] = useActionState(createMealPlanAction, initialState);

  const getHtml = (markdown?: string) => {
    if(!markdown) return { __html: '' };
    return { __html: marked(markdown) };
  }

  return (
    <Card className="w-full">
      <form action={formAction}>
        <CardHeader>
          <CardTitle>Dane Twojego psa</CardTitle>
          <CardDescription>
            Wypełnij formularz, abyśmy mogli stworzyć idealny plan posiłków dla
            Twojego małego przyjaciela.
          </CardDescription>
        </CardHeader>
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
            {isPending ? 'Generowanie...' : 'Generuj plan posiłków'}
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
              <CardHeader>
                <CardTitle>Oto Twój Plan Posiłków!</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={getHtml(formState.mealPlan)}
                />
              </CardContent>
            </Card>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
