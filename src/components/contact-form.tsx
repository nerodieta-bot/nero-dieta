'use client';
import { useActionState, useEffect, useRef } from 'react';
import {
  sendContactMessageAction,
  type ContactFormState,
} from '@/app/contact/actions';
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

const initialState: ContactFormState = {
  message: '',
  success: false,
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContactMessageAction, initialState);
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
            <CardTitle className="text-2xl text-green-800 dark:text-green-300">Wiadomość wysłana!</CardTitle>
            <CardDescription className="text-green-700 dark:text-green-400">{state.message}</CardDescription>
        </CardHeader>
       </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Formularz kontaktowy</CardTitle>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Twoje imię</Label>
            <Input id="name" name="name" placeholder="np. Jan Kowalski" />
            {state.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Twój adres e-mail</Label>
            <Input id="email" name="email" type="email" placeholder="np. jan.kowalski@email.com" />
            {state.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Wiadomość</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Twoja wiadomość..."
              rows={6}
            />
            {state.errors?.message && (
              <p className="text-sm text-destructive">{state.errors.message[0]}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Wysyłanie...' : 'Wyślij wiadomość'}
          </Button>
          {state.message && !state.success && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
