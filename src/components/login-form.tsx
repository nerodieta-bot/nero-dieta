
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
import { Loader2, AlertTriangle, Phone, Mail, MessageSquare } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  GoogleAuthProvider,
  signInWithPopup,
  type UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

async function createSessionCookie(idToken: string) {
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  return response.ok;
}

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);

  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

   useEffect(() => {
    if (auth && recaptchaContainerRef.current) {
        if (!recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
                'size': 'invisible',
                'callback': (response: any) => {
                    setIsRecaptchaReady(true);
                },
                'expired-callback': () => {
                   setIsRecaptchaReady(false);
                }
            });
            recaptchaVerifierRef.current.render().then(() => {
              setIsRecaptchaReady(true);
            });
        }
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
            ownerName: user.displayName || email.split('@')[0] || '',
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
            ...(user.displayName && { ownerName: user.displayName }),
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
  
  const handleAuthAction = async (action: 'google' | 'email' | 'phoneSend' | 'phoneVerify') => {
    if (!auth) return;
    setIsPending(true);
    setError(null);

    if (action === 'email' && isRegisterMode && password !== confirmPassword) {
      setError("Hasła nie są zgodne.");
      setIsPending(false);
      return;
    }

    try {
      let userCredential: UserCredential | undefined;
      switch (action) {
        case 'google':
          const provider = new GoogleAuthProvider();
          userCredential = await signInWithPopup(auth, provider);
          break;
        case 'email':
          if (isRegisterMode) {
             userCredential = await createUserWithEmailAndPassword(auth, email, password);
          } else {
             userCredential = await signInWithEmailAndPassword(auth, email, password);
          }
          break;
        case 'phoneSend':
          if (recaptchaVerifierRef.current) {
            const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifierRef.current);
            setConfirmationResult(result);
            toast({ title: 'Kod SMS został wysłany!' });
          } else {
            throw new Error("reCAPTCHA nie jest gotowa.");
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
        case 'auth/popup-closed-by-user':
            message = 'Logowanie przez Google zostało przerwane.';
            break;
        case 'auth/email-already-in-use':
            message = 'Ten adres e-mail jest już używany. Spróbuj się zalogować.';
            break;
        case 'auth/wrong-password':
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
             message = 'Nieprawidłowy e-mail lub hasło.';
             break;
        case 'auth/weak-password':
             message = 'Hasło jest zbyt słabe. Powinno mieć co najmniej 6 znaków.';
             break;
        case 'auth/invalid-phone-number':
             message = 'Nieprawidłowy format numeru telefonu. Podaj go w formacie międzynarodowym (np. +48123456789).';
             break;
        case 'auth/code-expired':
             message = 'Kod weryfikacyjny wygasł. Wyślij go ponownie.';
             break;
        case 'auth/invalid-verification-code':
             message = 'Nieprawidłowy kod weryfikacyjny.';
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
      <Tabs defaultValue="google" onValueChange={() => setError(null)}>
        <CardHeader>
          <CardTitle>Dołącz do stada</CardTitle>
          <CardDescription>Wybierz metodę logowania, aby uzyskać pełen dostęp.</CardDescription>
          <TabsList className="grid w-full grid-cols-3 mt-4">
            <TabsTrigger value="google">
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.8 0 265.8c0-57.5 22.9-108.9 59.9-146.9L120.3 176c-18.1 34.2-28.7 75.3-28.7 119.8 0 85.4 69.3 154.8 154.8 154.8 85.4 0 154.8-69.3 154.8-154.8 0-11.7-1.3-23.2-3.8-34.5H244v-92.4h139.7c5.6 24.1 8.3 49.3 8.3 75.5zM128 123.4l-75.1-59.1C87.8 28.5 160.4 0 244 0c87.3 0 162.2 45.4 203.2 114.2L380.3 173c-28.9-34.2-70.5-54.8-116.3-54.8-59.5 0-109.8 34.3-135.7 85z"></path>
                </svg> Google
            </TabsTrigger>
            <TabsTrigger value="email"><Mail /> E-mail</TabsTrigger>
            <TabsTrigger value="phone"><Phone /> Telefon</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <TabsContent value="google">
            <CardContent>
                <Button variant="outline" onClick={() => handleAuthAction('google')} disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.8 0 265.8c0-57.5 22.9-108.9 59.9-146.9L120.3 176c-18.1 34.2-28.7 75.3-28.7 119.8 0 85.4 69.3 154.8 154.8 154.8 85.4 0 154.8-69.3 154.8-154.8 0-11.7-1.3-23.2-3.8-34.5H244v-92.4h139.7c5.6 24.1 8.3 49.3 8.3 75.5zM128 123.4l-75.1-59.1C87.8 28.5 160.4 0 244 0c87.3 0 162.2 45.4 203.2 114.2L380.3 173c-28.9-34.2-70.5-54.8-116.3-54.8-59.5 0-109.8 34.3-135.7 85z"></path>
                    </svg>
                )}
                {isPending ? 'Logowanie...' : 'Kontynuuj z Google'}
                </Button>
            </CardContent>
        </TabsContent>

        <TabsContent value="email">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="pies@przyklad.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
             {isRegisterMode && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button onClick={() => handleAuthAction('email')} disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isRegisterMode ? 'Zarejestruj się' : 'Zaloguj się'}
            </Button>
            <Button variant="link" size="sm" type="button" onClick={() => setIsRegisterMode(!isRegisterMode)} className="text-muted-foreground">
              {isRegisterMode ? 'Masz już konto? Zaloguj się' : 'Nie masz konta? Zarejestruj się'}
            </Button>
          </CardFooter>
        </TabsContent>

        <TabsContent value="phone">
          <CardContent className="space-y-4">
            {!confirmationResult ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Numer telefonu</Label>
                  <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+48 123 456 789" />
                  <p className="text-xs text-muted-foreground">Podaj numer w formacie międzynarodowym.</p>
                </div>
                 <div ref={recaptchaContainerRef}></div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="code">Kod weryfikacyjny</Label>
                <Input id="code" type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="123456" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {!confirmationResult ? (
              <Button onClick={() => handleAuthAction('phoneSend')} disabled={isPending || !isRecaptchaReady} className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare />} Wyślij kod
              </Button>
            ) : (
               <div className='w-full flex flex-col gap-2'>
                <Button onClick={() => handleAuthAction('phoneVerify')} disabled={isPending} className="w-full">
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Weryfikuj i zaloguj
                </Button>
                <Button variant="outline" onClick={() => setConfirmationResult(null)} disabled={isPending} className="w-full">
                    Zmień numer
                </Button>
               </div>
            )}
          </CardFooter>
        </TabsContent>

        {error && (
            <div className="m-6 mt-0 flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
            </div>
        )}
      </Tabs>
    </Card>
  );
}
