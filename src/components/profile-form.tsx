'use client';

import { useActionState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { updateProfileDataAction, type ProfileFormState } from '@/app/profil/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';


const initialState: ProfileFormState = {
  message: '',
  success: false,
};

interface ProfileFormProps {
  user: User;
  userProfile: any; // The profile data from Firestore
}

export function ProfileForm({ user, userProfile }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfileDataAction, initialState);
  const { toast } = useToast();
  const firestore = useFirestore();

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Sukces!',
        description: state.message,
      });
    } else if (state.message && (state.errors || !state.success)) {
       toast({
        variant: 'destructive',
        title: 'Błąd',
        description: state.message,
      });
    }
  }, [state, toast]);
  
  // This side-effect ensures that a user document is created if it doesn't exist
  // without blocking the rendering of the form.
  useEffect(() => {
    if (user && firestore && !userProfile) {
        const userRef = doc(firestore, 'users', user.uid);
        const initialData = {
            email: user.email,
            createdAt: serverTimestamp(),
        };
        // Use a non-blocking write operation
        setDocumentNonBlocking(userRef, initialData, { merge: true });
    }
  }, [user, firestore, userProfile]);

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
            {state.errors?.ownerName && <p className="text-sm text-destructive">{state.errors.ownerName[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dogName">Imię Twojego psa</Label>
            <Input id="dogName" name="dogName" placeholder="np. Nero" defaultValue={userProfile?.dogName || ''} />
            {state.errors?.dogName && <p className="text-sm text-destructive">{state.errors.dogName[0]}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isPending ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
          {state.message && !state.success && state.errors && (
             <div className="flex items-center gap-2 text-sm text-destructive mt-2">
                <AlertTriangle className="h-4 w-4" />
                {state.message}
              </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
