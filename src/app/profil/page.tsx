
'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Loader2, User as UserIcon } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { ProfileForm } from '@/components/profile-form';
import { useToast } from '@/hooks/use-toast';

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      toast({
        title: 'Płatność udana!',
        description: 'Dziękujemy! Twój plan Premium jest już aktywny.',
      });
      // Clean up the URL
      router.replace('/profil', { scroll: false });
    }
  }, [searchParams, router, toast]);

  useEffect(() => {
    // Redirect user if not logged in after loading has completed.
    if (!user && !isUserLoading) {
      router.replace('/login?redirect=/profil');
    }
  }, [user, isUserLoading, router]);

  const isLoading = isUserLoading || (user && isProfileLoading);

  if (isLoading || !user) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Ładuję Twój profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="text-center mb-8">
        <UserIcon className="mx-auto w-12 h-12 text-accent mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-2">Mój profil</h1>
        <p className="text-muted-foreground text-lg">Zarządzaj swoimi danymi i informacjami o swoim psie.</p>
      </div>
      <ProfileForm user={user} userProfile={userProfile} />
    </div>
  );
}

function ProfilePageSuspenseWrapper() {
    return (
        <Suspense fallback={
            <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Ładowanie profilu...</p>
                </div>
            </div>
        }>
            <ProfilePageContent />
        </Suspense>
    )
}


export default function ProfilePage() {
    return (
        <ProfilePageSuspenseWrapper />
    )
}
