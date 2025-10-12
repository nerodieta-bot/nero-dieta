'use client';
import { useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { marked } from 'marked';

const formSchema = z.object({
  dogWeight: z.coerce
    .number()
    .min(0.5, 'Waga musi być większa niż 0.5 kg.')
    .max(10, 'Kreator jest zoptymalizowany dla psów do 10kg.'),
  dogAge: z.coerce.number().min(0, 'Wiek nie może być ujemny.').max(20),
  activityLevel: z.enum(['sedentary', 'moderate', 'active'], {
    required_error: 'Wybierz poziom aktywności.',
  }),
  ingredients: z
    .string()
    .min(10, 'Wpisz co najmniej kilka składników (min. 10 znaków).'),
});

type FormData = z.infer<typeof formSchema>;

const initialState: FormState = {
  message: '',
};

export function MealPlanForm() {
  const [formState, formAction, isPending] = useActionState(createMealPlanAction, initialState);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dogWeight: 3,
      dogAge: 5,
      activityLevel: 'moderate',
      ingredients: 'Gotowany kurczak, ryż, marchewka, olej z łososia',
    },
  });

  useEffect(() => {
    if (formState.errors) {
      const errors = formState.errors;
      if (errors.dogWeight) form.setError('dogWeight', { message: errors.dogWeight[0] });
      if (errors.dogAge) form.setError('dogAge', { message: errors.dogAge[0] });
      if (errors.activityLevel) form.setError('activityLevel', { message: errors.activityLevel[0] });
      if (errors.ingredients) form.setError('ingredients', { message: errors.ingredients[0] });
    }
  }, [formState, form]);
  
  const getHtml = (markdown?: string) => {
    if(!markdown) return { __html: '' };
    return { __html: marked(markdown) };
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Dane Twojego psa</CardTitle>
        <CardDescription>
          Wypełnij formularz, abyśmy mogli stworzyć idealny plan posiłków dla
          Twojego małego przyjaciela.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          action={formAction}
          className="space-y-6"
        >
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="dogWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waga psa (kg): {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      min={0.5}
                      max={10}
                      step={0.1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dogAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wiek psa (lata): {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      max={20}
                      step={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poziom aktywności</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    name={field.name}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz poziom aktywności..." />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dostępne składniki</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Wpisz dostępne składniki, oddzielając je przecinkami (np. kurczak, marchew, ryż)..."
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
      </Form>
    </Card>
  );
}
