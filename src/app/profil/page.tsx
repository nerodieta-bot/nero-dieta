'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, User as UserIcon } from 'lucide-react';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { ProfileForm } from '@/components/profile-form';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  useEffect(() => {
    // Redirect user if not logged in after loading has completed.
    if (!user && !isUserLoading) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Ładuję Twój profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // This case is handled by useEffect, but it's good practice to have it.
    return null;
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
