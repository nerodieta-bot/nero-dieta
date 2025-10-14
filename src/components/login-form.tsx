'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { z } from 'zod';
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
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle, Mail, KeyRound } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  type UserCredential,
} from 'firebase/auth';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';


const SignUpSchema = z
  .object({
    email: z.string().email('Proszę podać poprawny adres e-mail.'),
    password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła nie są takie same.',
    path: ['confirmPassword'],
  });

const SignInSchema = z.object({
  email: z.string().email('Proszę podać poprawny adres e-mail.'),
  password: z.string().min(1, 'Hasło jest wymagane.'),
});

type EmailMode = 'signin' | 'signup';

async function createSessionCookie(idToken: string) {
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  return response.ok;
}

export function LoginForm() {
  const [emailMode, setEmailMode] = useState<EmailMode>('signin');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  async function handleSuccessfulLogin(userCredential: UserCredential) {
    setIsPending(true);
    const user = userCredential.user;
    if (firestore) {
      const userRef = doc(firestore, 'users', user.uid);
      
      const isNewUser = userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime;

      if (isNewUser) {
        const userData = {
            email: user.email,
            ownerName: user.displayName || '',
            dogName: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
        setDocumentNonBlocking(userRef, userData);
      } else {
         const userData = {
            ownerName: user.displayName || '',
            updatedAt: serverTimestamp(),
        };
        updateDocumentNonBlocking(userRef, userData);
      }
    }

    const idToken = await user.getIdToken();
    await createSessionCookie(idToken);

    toast({
      title: `Witaj w stadzie, ${user.displayName || user.email || 'użytkowniku'}!`,
      description: 'Logowanie zakończone pomyślnie.',
    });

    const redirectUrl = searchParams.get('redirect') || '/';
    router.push(redirectUrl);
  }
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    if (!auth) {
        setError('Usługa autoryzacji jest niedostępna.');
        setIsPending(false);
        return;
    }
    
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    try {
        const schema = emailMode === 'signup' ? SignUpSchema : SignInSchema;
        const validation = schema.safeParse(data);
        
        if (!validation.success) {
            const errors = validation.error.flatten().fieldErrors;
            const firstError = Object.values(errors)[0]?.[0];
            setError(firstError || 'Popraw błędy w formularzu.');
            setIsPending(false);
            return;
        }

        let userCredential: UserCredential;
        if (emailMode === 'signup') {
            userCredential = await createUserWithEmailAndPassword(auth, validation.data.email, validation.data.password);
        } else {
            userCredential = await signInWithEmailAndPassword(auth, validation.data.email, (validation.data as z.infer<typeof SignInSchema>).password);
        }
        await handleSuccessfulLogin(userCredential);
    } catch (error: any) {
        console.error('Authentication Error:', error);
        if (error.code === 'auth/email-already-in-use') {
            setError('Ten adres e-mail jest już zajęty.');
        } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
             setError('Niepoprawny e-mail lub hasło.');
        } else if (error.code === 'auth/invalid-verification-code') {
            setError('Niepoprawny kod weryfikacyjny.');
        } else if (error.code === 'auth/too-many-requests') {
            setError('Zbyt wiele prób. Spróbuj ponownie później.');
        } else {
            setError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
        }
    } finally {
        setIsPending(false);
    }
  }


  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsPending(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await handleSuccessfulLogin(userCredential);
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setError('Nie udało się zalogować przez Google. Spróbuj ponownie.');
      }
      setIsPending(false); 
    }
  };

  return (
    <Card>
      <CardHeader>
          <CardTitle>Dołącz do stada</CardTitle>
          <CardDescription>Wybierz preferowaną metodę logowania lub rejestracji.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" value={emailMode} onValueChange={(value) => setEmailMode(value as EmailMode)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Logowanie</TabsTrigger>
            <TabsTrigger value="signup">Rejestracja</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit}>
            <TabsContent value="signin">
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="email-signin">Adres e-mail</Label>
                        <Input id="email-signin" name="email" type="email" placeholder="np. jan.kowalski@email.com" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="password-signin">Hasło</Label>
                        <Input id="password-signin" name="password" type="password" required />
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-stretch">
                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending && emailMode === 'signin' ? <Loader2 className="mr-2 animate-spin" /> : <Mail className="mr-2" />}
                        {isPending && emailMode === 'signin' ? 'Logowanie...' : 'Zaloguj się'}
                    </Button>
                </CardFooter>
            </TabsContent>
            <TabsContent value="signup">
               <CardContent className="space-y-4 pt-6">
                     <div className="space-y-2">
                        <Label htmlFor="email-signup">Adres e-mail</Label>
                        <Input id="email-signup" name="email" type="email" placeholder="np. jan.kowalski@email.com" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="password-signup">Hasło</Label>
                        <Input id="password-signup" name="password" type="password" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
                        <Input id="confirmPassword" name="confirmPassword" type="password" required />
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-stretch">
                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending && emailMode === 'signup' ? <Loader2 className="mr-2 animate-spin" /> : <KeyRound className="mr-2" />}
                        {isPending && emailMode === 'signup' ? 'Tworzenie konta...' : 'Zarejestruj się'}
                    </Button>
                </CardFooter>
            </TabsContent>
          </form>
        </Tabs>
      </CardContent>
      <Separator className="my-4" />
      <div className="p-6 pt-0 space-y-4">
        <Button variant="outline" onClick={handleGoogleSignIn} disabled={isPending} className="w-full">
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.8 0 265.8c0-57.5 22.9-108.9 59.9-146.9L120.3 176c-18.1 34.2-28.7 75.3-28.7 119.8 0 85.4 69.3 154.8 154.8 154.8 85.4 0 154.8-69.3 154.8-154.8 0-11.7-1.3-23.2-3.8-34.5H244v-92.4h139.7c5.6 24.1 8.3 49.3 8.3 75.5zM128 123.4l-75.1-59.1C87.8 28.5 160.4 0 244 0c87.3 0 162.2 45.4 203.2 114.2L380.3 173c-28.9-34.2-70.5-54.8-116.3-54.8-59.5 0-109.8 34.3-135.7 85z"></path>
          </svg>
          Kontynuuj z Google
        </Button>
      </div>
      
      {error && (
        <div className="px-6 pb-4">
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
            </div>
        </div>
      )}
    </Card>
  );
}
