'use client';
import { useFormState } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import {
  submitIngredientAction,
  type ContributionFormState,
} from '@/app/submit/actions';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from './ui/label';
import { Loader2, CheckCircle } from 'lucide-react';

const initialState: ContributionFormState = {
  message: '',
  success: false,
};

export function ContributionForm() {
  const [state, formAction] = useFormState(submitIngredientAction, initialState);
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    const formData = new FormData(event.currentTarget);
    await formAction(formData);
    setIsPending(false);
  };
  
  useEffect(() => {
    if(state.success) {
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
        <CardTitle>Zgłoś nowy składnik</CardTitle>
        <CardDescription>
          Pomóż nam rozbudować bazę! Wypełnij poniższe pola, a nasz zespół zweryfikuje Twoje zgłoszenie.
        </CardDescription>
      </CardHeader>
      <form ref={formRef} onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nazwa składnika</Label>
            <Input id="name" name="name" placeholder="np. Jabłko" />
            {state.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status bezpieczeństwa</Label>
            <Select name="status">
              <SelectTrigger id="status">
                <SelectValue placeholder="Wybierz status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="safe">✅ Bezpieczny</SelectItem>
                <SelectItem value="warning">⚠️ Umiarkowany</SelectItem>
                <SelectItem value="danger">❌ Zakazany</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.status && (
              <p className="text-sm text-destructive">{state.errors.status[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kategoria</Label>
            <Input id="category" name="category" placeholder="np. 🍎 Owocowy Przysmak" />
             {state.errors?.category && (
              <p className="text-sm text-destructive">{state.errors.category[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Opis i właściwości</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Opisz, dlaczego ten składnik jest (lub nie jest) dobry dla psów."
            />
            {state.errors?.description && (
              <p className="text-sm text-destructive">{state.errors.description[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nero_comment">Komentarz Nero (opcjonalnie)</Label>
            <Textarea
              id="nero_comment"
              name="nero_comment"
              placeholder="Co Nero by o tym powiedział?"
            />
             {state.errors?.nero_comment && (
              <p className="text-sm text-destructive">{state.errors.nero_comment[0]}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Wysyłanie...' : 'Wyślij do weryfikacji'}
          </Button>
          {state.message && !state.success && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
