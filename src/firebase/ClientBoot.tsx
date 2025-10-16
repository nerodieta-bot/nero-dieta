'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { doc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from './core';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function ClientBoot() {
  useEffect(() => {
    const { firestore, firebaseApp } = initializeFirebase();
    const auth = getAuth(firebaseApp);

    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      const ref = doc(firestore, 'users', user.uid);
      // domyślnie merge: true → idempotentny UPSERT
      setDocumentNonBlocking(ref, { updatedAt: serverTimestamp() });
    });

    return () => unsub();
  }, []);

  return null;
}
