'use client';
import { useActionState, useEffect, useRef } from 'react';
import {
  reportBugAction,
  type BugReportFormState,
} from '@/app/report-bug/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from './ui/label';
import { Loader2, CheckCircle } from 'lucide-react';

const initialState: BugReportFormState = {
  message: '',
  success: false,
};

export function ReportBugForm() {
  const [state, formAction, isPending] = useActionState(reportBugAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  if (state.success) {
    return (
       <Card className="w-full border-green-500/50 bg-green-500/10">
        <CardHeader className="items-center text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
            <CardTitle className="text-2xl text-green-800 dark:text-green-300">Zgłoszenie przyjęte!</CardTitle>
            <CardDescription className="text-green-700 dark:text-green-400">{state.message}</CardDescription>
        </CardHeader>
       </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Formularz zgłoszenia błędu</CardTitle>
        <CardDescription>
          Opisz dokładnie, co się stało, a my postaramy się to naprawić.
        </CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="page_url">Adres URL strony (opcjonalnie)</Label>
            <Input id="page_url" name="page_url" placeholder="np. /plan" />
            {state.errors?.page_url && (
              <p className="text-sm text-destructive">{state.errors.page_url[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Opis błędu</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Opisz, co się stało, co próbowałeś/aś zrobić i jaki był rezultat..."
              rows={6}
            />
            {state.errors?.description && (
              <p className="text-sm text-destructive">{state.errors.description[0]}</p>
            )}
          </div>
           <div className="space-y-2">
            <Label htmlFor="email">Twój adres e-mail (opcjonalnie)</Label>
            <Input id="email" name="email" type="email" placeholder="np. jan.kowalski@email.com" />
            <p className="text-xs text-muted-foreground">Podaj e-mail, jeśli chcesz, abyśmy mogli się z Tobą skontaktować w sprawie zgłoszenia.</p>
            {state.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email[0]}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
          </Button>
          {state.message && !state.success && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
