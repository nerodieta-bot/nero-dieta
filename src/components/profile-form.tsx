'use client';

import { useState } from 'react';
import type { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { z } from 'zod';

interface ProfileFormProps {
  user: User;
  userProfile: any; // The profile data from Firestore
}

const ProfileSchema = z.object({
  ownerName: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki.'),
  dogName: z.string().min(2, 'Imię psa musi mieć co najmniej 2 znaki.'),
});

export function ProfileForm({ user, userProfile }: ProfileFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<{ ownerName?: string; dogName?: string; }>({});


  const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setErrors({});
    
    const formData = new FormData(event.currentTarget);
    const data = {
        ownerName: formData.get('ownerName'),
        dogName: formData.get('dogName'),
    };

    const validatedFields = ProfileSchema.safeParse(data);

    if (!validatedFields.success) {
        const flatErrors = validatedFields.error.flatten().fieldErrors;
        setErrors({
            ownerName: flatErrors.ownerName?.[0],
            dogName: flatErrors.dogName?.[0],
        });
        setIsPending(false);
        return;
    }


    if (!firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'Błąd',
        description: 'Brak autoryzacji lub połączenia z bazą danych.',
      });
      setIsPending(false);
      return;
    }
    
    try {
      const userRef = doc(firestore, 'users', user.uid);
      updateDocumentNonBlocking(userRef, validatedFields.data);

      toast({
        title: 'Sukces!',
        description: 'Twój profil został pomyślnie zaktualizowany!',
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Błąd',
        description: 'Wystąpił błąd podczas aktualizacji profilu.',
      });
    } finally {
        setIsPending(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Twoje dane</CardTitle>
        <CardDescription>Uzupełnij informacje, aby w pełni korzystać z personalizacji w Dieta Nero.</CardDescription>
      </CardHeader>
      <form onSubmit={handleUpdateProfile}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Adres e-mail</Label>
            <Input id="email" name="email" type="email" value={user.email || ''} disabled />
            <p className="text-xs text-muted-foreground">Adres e-mail jest powiązany z Twoim kontem i nie można go zmienić.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerName">Twoje imię</Label>
            <Input id="ownerName" name="ownerName" placeholder="np. Jan" defaultValue={userProfile?.ownerName || user.displayName || ''} />
            {errors.ownerName && <p className="text-sm text-destructive">{errors.ownerName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dogName">Imię Twojego psa</Label>
            <Input id="dogName" name="dogName" placeholder="np. Nero" defaultValue={userProfile?.dogName || ''} />
            {errors.dogName && <p className="text-sm text-destructive">{errors.dogName}</p>}
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

    