'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

type Sdks = { firebaseApp: FirebaseApp; auth: Auth; firestore: Firestore };

export function initializeFirebase(): Sdks {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return {
    firebaseApp: app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  };
}
