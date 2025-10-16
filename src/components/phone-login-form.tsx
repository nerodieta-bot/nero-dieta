'use client';

import { useState, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
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
import { Loader2, AlertTriangle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  type UserCredential,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

async function createSessionCookie(idToken: string) {
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  return response.ok;
}

export function PhoneLoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) return;

    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response: any) => {},
      'expired-callback': () => {
        setError('Weryfikacja reCAPTCHA wygasła. Odśwież stronę i spróbuj ponownie.');
      }
    });

    (window as any).recaptchaVerifier = verifier;

    return () => {
      verifier.clear();
      (window as any).recaptchaVerifier = null;
    };
  }, [auth]);

  async function handleSuccessfulLogin(userCredential: UserCredential) {
    setIsPending(true);
    const user = userCredential.user;
    if (firestore) {
      const userRef = doc(firestore, 'users', user.uid);
      const isNewUser = userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime;

      if (isNewUser) {
        const userData = {
            email: user.email, // Will be null for phone auth
            ownerName: user.displayName || '',
            dogName: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            plan: 'starter',
            ingredientViewCount: 0,
            mealPlanGenerations: 0,
        };
        setDocumentNonBlocking(userRef, userData, { merge: true });
      } else {
         const userData = {
            email: user.email, // Ensure email is not overwritten if it exists
            updatedAt: serverTimestamp(),
        };
        setDocumentNonBlocking(userRef, userData, { merge: true });
      }
    }

    const idToken = await user.getIdToken();
    await createSessionCookie(idToken);

    toast({
      title: `Witaj w stadzie!`,
      description: 'Logowanie zakończone pomyślnie.',
    });

    const redirectUrl = searchParams.get('redirect') || '/';
    router.push(redirectUrl);
  }
  
  const handlePhoneAuth = async () => {
    if (!auth) return;
    setIsPending(true);
    setError(null);

    try {
        const appVerifier = (window as any).recaptchaVerifier;
        if (!appVerifier) {
          throw new Error("RecaptchaVerifier nie jest gotowy.");
        }

        if (!isCodeSent) {
          // Stage 1: Send verification code
          const result = await signInWithPhoneNumber(auth, phone, appVerifier);
          setConfirmationResult(result);
          setIsCodeSent(true);
          toast({ title: 'Kod weryfikacyjny wysłany!', description: 'Sprawdź SMS na swoim telefonie.' });
        } else {
          // Stage 2: Confirm code and sign in
          if (confirmationResult) {
            const userCredential = await confirmationResult.confirm(verificationCode);
            await handleSuccessfulLogin(userCredential);
          } else {
            throw new Error("Brak obiektu confirmationResult.");
          }
        }
    } catch (error: any) {
      console.error(`Phone Auth Error:`, error);
      let message = 'Wystąpił nieznany błąd. Spróbuj ponownie.';
       switch (error.code) {
        case 'auth/invalid-verification-code':
             message = 'Nieprawidłowy kod weryfikacyjny. Spróbuj ponownie.';
             break;
        case 'auth/invalid-phone-number':
             message = 'Nieprawidłowy numer telefonu. Podaj go w formacie międzynarodowym (np. +48123456789).';
             break;
        case 'auth/too-many-requests':
             message = 'Zbyt wiele prób. Spróbuj ponownie później lub odśwież stronę.';
             break;
        default:
             message = 'Wystąpił błąd logowania. Spróbuj ponownie.';
             break;
       }
      setError(message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full">
      <div id="recaptcha-container"></div>
      <CardHeader>
        <CardTitle>Logowanie przez telefon</CardTitle>
        <CardDescription>
          {isCodeSent 
            ? 'Wpisz kod, który otrzymałeś w wiadomości SMS.' 
            : 'Podaj swój numer telefonu, aby otrzymać kod weryfikacyjny.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCodeSent ? (
            <div className="space-y-2">
                <Label htmlFor="phone">Numer telefonu</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+48 123 456 789" />
                <p className="text-xs text-muted-foreground">Podaj numer w formacie międzynarodowym.</p>
            </div>
        ) : (
            <div className="space-y-2">
                <Label htmlFor="code">Kod weryfikacyjny</Label>
                <Input id="code" type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="Wpisz 6-cyfrowy kod" />
            </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-4">
         <Button onClick={handlePhoneAuth} disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isCodeSent ? 'Zaloguj się' : 'Wyślij kod'}
         </Button>
         {isCodeSent && (
            <Button variant="link" size="sm" onClick={() => { setIsCodeSent(false); setError(null); }} disabled={isPending} className="text-muted-foreground">
                Zmień numer telefonu
            </Button>
         )}
          {error && (
            <div className="w-full flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
