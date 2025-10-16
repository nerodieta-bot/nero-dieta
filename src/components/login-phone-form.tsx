
'use client';

import { useState, useRef, useEffect } from 'react';
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
import { Loader2, AlertTriangle, MessageSquare, Phone } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  type UserCredential,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

async function createSessionCookie(idToken: string) {
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  return response.ok;
}

export function LoginPhoneForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (auth && recaptchaContainerRef.current && !recaptchaVerifierRef.current) {
        const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
            size: 'invisible',
            'callback': (response: any) => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
            },
            'expired-callback': () => {
              // Response expired. Ask user to solve reCAPTCHA again.
            }
        });
        recaptchaVerifierRef.current = verifier;
    }
  }, [auth]);

  async function handleSuccessfulLogin(userCredential: UserCredential) {
    setIsPending(true);
    const user = userCredential.user;
    if (firestore) {
      const userRef = doc(firestore, 'users', user.uid);
      const isNewUser = userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime;

      if (isNewUser) {
        const userData = {
            email: user.email,
            ownerName: user.displayName || (user.email ? user.email.split('@')[0] : user.phoneNumber) || '',
            dogName: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            plan: 'starter',
            ingredientViewCount: 0,
            mealPlanGenerations: 0,
        };
        setDocumentNonBlocking(userRef, userData);
      } else {
         const userData = {
            updatedAt: serverTimestamp(),
        };
        updateDocumentNonBlocking(userRef, userData);
      }
    }

    const idToken = await user.getIdToken();
    await createSessionCookie(idToken);

    toast({
      title: `Witaj w stadzie, ${user.phoneNumber || 'użytkowniku'}!`,
      description: 'Logowanie zakończone pomyślnie.',
    });

    const redirectUrl = searchParams.get('redirect') || '/';
    router.push(redirectUrl);
  }
  
  const handleAuthAction = async (action: 'phoneSend' | 'phoneVerify') => {
    if (!auth) return;
    setIsPending(true);
    setError(null);

    try {
      let userCredential: UserCredential | undefined;
      switch (action) {
        case 'phoneSend':
          if (recaptchaVerifierRef.current) {
            const verifier = recaptchaVerifierRef.current;
            const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
            setConfirmationResult(result);
            toast({ title: 'Kod SMS został wysłany!' });
          } else {
            throw new Error("Weryfikator reCAPTCHA nie jest gotowy. Spróbuj ponownie za chwilę.");
          }
          break;
        case 'phoneVerify':
          if (confirmationResult) {
            userCredential = await confirmationResult.confirm(verificationCode);
          } else {
            throw new Error("Najpierw wyślij kod weryfikacyjny.");
          }
          break;
      }
      if (userCredential) {
        await handleSuccessfulLogin(userCredential);
      }
    } catch (error: any) {
      console.error(`${action} Error:`, error);
      let message = 'Wystąpił nieznany błąd. Spróbuj ponownie.';
       switch (error.code) {
        case 'auth/invalid-phone-number':
             message = 'Nieprawidłowy format numeru telefonu. Podaj go w formacie międzynarodowym (np. +48123456789).';
             break;
        case 'auth/code-expired':
             message = 'Kod weryfikacyjny wygasł. Wyślij go ponownie.';
             break;
        case 'auth/invalid-verification-code':
             message = 'Nieprawidłowy kod weryfikacyjny.';
             break;
        case 'auth/captcha-check-failed':
             message = 'Weryfikacja reCAPTCHA nie powiodła się. Odśwież stronę i spróbuj ponownie.';
             break;
        case 'auth/too-many-requests':
             message = 'Zbyt wiele prób. Odczekaj chwilę przed ponownym wysłaniem kodu.';
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Phone /> Logowanie telefonem</CardTitle>
          <CardDescription>
            {confirmationResult 
                ? 'Wpisz 6-cyfrowy kod, który wysłaliśmy na Twój numer.'
                : 'Podaj swój numer telefonu, aby otrzymać kod weryfikacyjny.'
            }
          </CardDescription>
        </CardHeader>

          <CardContent className="space-y-4">
            <div ref={recaptchaContainerRef}></div>
            {!confirmationResult ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Numer telefonu</Label>
                  <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+48 123 456 789" />
                  <p className="text-xs text-muted-foreground">Podaj numer w formacie międzynarodowym.</p>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="code">Kod weryfikacyjny</Label>
                <Input id="code" type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="123456" inputMode="numeric" pattern="[0-9]*" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {!confirmationResult ? (
              <Button onClick={() => handleAuthAction('phoneSend')} disabled={isPending || !phoneNumber} className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                 Wyślij kod
              </Button>
            ) : (
               <div className='w-full flex flex-col gap-2'>
                <Button onClick={() => handleAuthAction('phoneVerify')} disabled={isPending || !verificationCode} className="w-full">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Weryfikuj i zaloguj
                </Button>
                <Button variant="outline" onClick={() => setConfirmationResult(null)} disabled={isPending} className="w-full">
                    Zmień numer
                </Button>
               </div>
            )}
          </CardFooter>

        {error && (
            <div className="m-6 mt-0 flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
            </div>
        )}
    </Card>
  );
}
