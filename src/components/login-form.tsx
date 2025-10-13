'use client';

import { useState, useTransition } from 'react';
import { sendSignInLinkToEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase/provider';
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
import { Loader2, Mail, CheckCircle, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const NameSchema = z.string().min(2, 'Imię musi mieć co najmniej 2 znaki.');
const DogNameSchema = z.string().min(2, 'Imię psa musi mieć co najmniej 2 znaki.');
const EmailSchema = z.string().email('Proszę podać poprawny adres e-mail.');

type AuthState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

type Step = 'initial' | 'emailSent';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691c-2.242 3.756-3.086 8.514-2.222 13.011l6.75-5.238C8.921 19.34 7.822 16.81 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-4.819C28.91 37.297 26.61 38 24 38c-3.866 0-7.22-1.722-9.408-4.417l-6.75 5.238C11.086 40.822 17.15 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.443-2.67 4.333-5.073 5.602l6.19 4.819c3.918-3.596 6.375-8.942 6.375-14.821c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);


export function LoginForm() {
  const [step, setStep] = useState<Step>('initial');
  const [authState, setAuthState] = useState<AuthState>({ status: 'idle', message: '' });
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();

  const [name, setName] = useState('');
  const [dogName, setDogName] = useState('');
  const [email, setEmail] = useState('');
  
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();


  const handleGoogleSignIn = () => {
    startGoogleTransition(async () => {
      if (!auth || !firestore) {
        setAuthState({ status: 'error', message: 'Błąd inicjalizacji. Spróbuj ponownie za chwilę.' });
        return;
      }
      
      const provider = new GoogleAuthProvider();
      try {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

        const userRef = doc(firestore, 'users', user.uid);
        const userData = {
            email: user.email,
            displayName: user.displayName,
            createdAt: serverTimestamp(),
        };

        await setDoc(userRef, userData, { merge: true }).catch(error => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: userRef.path,
            operation: 'write',
            requestResourceData: userData
          }))
          throw error;
        });

        router.push('/');

      } catch (error: any) {
        if (error.code === 'auth/popup-closed-by-user') {
          setAuthState({ status: 'error', message: 'Logowanie przez Google zostało anulowane.' });
        } else {
            console.error('Google Sign-In Error:', error);
            let userMessage = 'Wystąpił nieoczekiwany błąd podczas logowania przez Google.';
            if (error.code === 'auth/account-exists-with-different-credential') {
            userMessage = 'Konto z tym adresem e-mail już istnieje, ale jest powiązane z inną metodą logowania.';
            }
            setAuthState({ status: 'error', message: userMessage });
        }
      }
    });
  };
  

  const handleSendSignInLink = (e: React.FormEvent) => {
    e.preventDefault();
    const nameValidation = NameSchema.safeParse(name);
    const dogNameValidation = DogNameSchema.safeParse(dogName);
    const emailValidation = EmailSchema.safeParse(email);

    if (!nameValidation.success || !dogNameValidation.success || !emailValidation.success) {
      let errorMessages = [];
      if (!nameValidation.success) errorMessages.push(nameValidation.error.flatten().formErrors[0]);
      if (!dogNameValidation.success) errorMessages.push(dogNameValidation.error.flatten().formErrors[0]);
      if (!emailValidation.success) errorMessages.push(emailValidation.error.flatten().formErrors[0]);
      setAuthState({ status: 'error', message: errorMessages.join(' ') });
      return;
    }
    
    startTransition(async () => {
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      };

      try {
        if (!auth) {
          throw new Error("Błąd inicjalizacji Firebase. Spróbuj ponownie za chwilę.");
        }
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);

        const userData = { name, dogName };
        window.localStorage.setItem('emailForSignIn', email);
        window.localStorage.setItem('userDataForSignIn', JSON.stringify(userData));

        setAuthState({
          status: 'success',
          message: `Wysłaliśmy link logujący na adres ${email}. Otwórz go na tym samym urządzeniu, aby dokończyć.`,
        });
        setStep('emailSent');
      } catch (error: any) {
        console.error('Error sending sign-in link:', error.code, error.message);
        let userMessage = 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.';
        if (error.code === 'auth/invalid-email') {
          userMessage = 'Podany adres e-mail jest nieprawidłowy.';
        }
        setAuthState({ status: 'error', message: userMessage });
      }
    });
  };
  
  if (step === 'emailSent') {
    return (
      <Card className="border-green-500/50 bg-green-500/10">
        <CardHeader className="items-center text-center">
          <CheckCircle className="h-16 w-16 text-green-600" />
          <CardTitle className="text-2xl text-green-800 dark:text-green-300">Sprawdź swoją skrzynkę!</CardTitle>
          <CardDescription className="text-green-700 dark:text-green-400">
            {authState.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
      <Card>
        <CardHeader>
            <CardTitle>Utwórz konto lub zaloguj się</CardTitle>
            <CardDescription>Dołącz do stada, aby w pełni korzystać z możliwości Dieta Nero.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGooglePending || isPending}>
                {isGooglePending ? <Loader2 className="mr-2 animate-spin" /> : <GoogleIcon />}
                {isGooglePending ? 'Logowanie...' : 'Kontynuuj z Google'}
            </Button>
            <div className="relative">
                <Separator />
                <span className="absolute left-1/2 -translate-x-1/2 top-[-0.7rem] bg-card px-2 text-sm text-muted-foreground">LUB</span>
            </div>
        </CardContent>
        <form onSubmit={handleSendSignInLink}>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Twoje imię</Label>
                  <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="np. Anna" required disabled={isPending || isGooglePending} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dogName">Imię psa</Label>
                  <Input id="dogName" name="dogName" value={dogName} onChange={(e) => setDogName(e.target.value)} placeholder="np. Nero" required disabled={isPending || isGooglePending}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="np. anna@example.com" required disabled={isPending || isGooglePending} />
                </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
                <Button type="submit" disabled={isPending || isGooglePending}>
                    {isPending ? <Loader2 className="mr-2 animate-spin" /> : <Mail className="mr-2" />}
                    {isPending ? 'Wysyłanie...' : 'Wyślij link do logowania'}
                </Button>
                {authState.status === 'error' && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        {authState.message}
                    </div>
                )}
            </CardFooter>
        </form>
      </Card>
  );
}
