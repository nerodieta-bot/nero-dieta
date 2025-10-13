
import { LoginForm } from '@/components/login-form';
import { PawPrint } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
            <PawPrint className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary font-headline">
                Witaj z powrotem w stadzie!
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Zaloguj się, aby w pełni korzystać z Dieta Nero.
            </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
