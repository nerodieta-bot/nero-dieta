'use client';

import { useState, useActionState } from 'react';
import type { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateProfileDataAction, type ProfileFormState } from '@/app/profil/actions';
import { useEffect } from 'react';


const initialState: ProfileFormState = {
  message: '',
  success: false,
};

interface ProfileFormProps {
  user: User;
  userProfile: any; // The profile data from Firestore
}


export function ProfileForm({ user, userProfile }: ProfileFormProps) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(updateProfileDataAction, initialState);
  
  useEffect(() => {
    if(state.message) {
        toast({
            title: state.success ? 'Sukces!' : 'Błąd',
            description: state.message,
            variant: state.success ? 'default' : 'destructive',
        });
    }
  }, [state, toast])


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Twoje dane</CardTitle>
        <CardDescription>Uzupełnij informacje, aby w pełni korzystać z personalizacji w Dieta Nero.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Adres e-mail</Label>
            <Input id="email" name="email" type="email" value={user.email || ''} disabled />
            <p className="text-xs text-muted-foreground">Adres e-mail jest powiązany z Twoim kontem i nie można go zmienić.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerName">Twoje imię</Label>
            <Input id="ownerName" name="ownerName" placeholder="np. Jan" defaultValue={userProfile?.ownerName || user.displayName || ''} />
            {state.errors?.ownerName && <p className="text-sm text-destructive">{state.errors.ownerName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dogName">Imię Twojego psa</Label>
            <Input id="dogName" name="dogName" placeholder="np. Nero" defaultValue={userProfile?.dogName || ''} />
            {state.errors?.dogName && <p className="text-sm text-destructive">{state.errors.dogName}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isPending ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
