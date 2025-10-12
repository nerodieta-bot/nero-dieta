'use client';
import { useFormState, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createMealPlanAction, type FormState } from '@/app/plan/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  dogWeight: z.coerce.number().min(1, "Waga musi być większa niż 0."),
  dogAge: z.coerce.number().min(0, "Wiek nie może być ujemny."),
  activityLevel: z.enum(['sedentary', 'moderate', 'active'], { required_error: 'Wybierz poziom aktywności.' }),
  ingredients: z.string().min(10, "Wpisz co najmniej kilka składników (min. 10 znaków)."),
});

type FormData = z.infer<typeof formSchema>;

export function MealPlanForm() {
  const [formState, formAction] = useFormState<FormState, FormData>(createMealPlanAction, {
    message: '',
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dogWeight: 10,
      dogAge: 5,
      activityLevel: 'moderate',
      ingredients: 'Gotowany kurczak, marchewka, ryż basmati',
    },
  });

  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsPending(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    await formAction(formData);
    setIsPending(false);
  };
  
  useEffect(() => {
    if (formState.errors) {
      // Manual error setting for react-hook-form
    }
  }, [formState]);


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Dane Twojego psa</CardTitle>
        <CardDescription>Wypełnij formularz, abyśmy mogli stworzyć idealny plan posiłków.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      max={100}
                      step={1}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz poziom aktywności..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sedentary">Kanapowiec (mało aktywny)</SelectItem>
                      <SelectItem value="moderate">Spacerowicz (średnio aktywny)</SelectItem>
                      <SelectItem value="active">Sportowiec (bardzo aktywny)</SelectItem>
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
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isPending ? 'Generowanie...' : 'Generuj plan posiłków'}
            </Button>
            
            {formState.message && !formState.mealPlan && (
              <p className="text-sm text-destructive">{formState.message}</p>
            )}

            {isPending && (
              <div className="w-full text-center p-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-4 text-muted-foreground">Analizujemy dane i tworzymy plan... To może zająć chwilę.</p>
              </div>
            )}

            {formState.mealPlan && !isPending && (
              <Card className="w-full bg-primary/5 dark:bg-primary/10">
                <CardHeader>
                  <CardTitle>Oto Twój Plan Posiłków!</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap">{formState.mealPlan}</div>
                </CardContent>
              </Card>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
