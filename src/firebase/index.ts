'use client';

import { firebaseConfig as localFirebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// Konstrukcja konfiguracji na podstawie zmiennych środowiskowych
const envFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Sprawdź, czy wszystkie potrzebne zmienne środowiskowe są dostępne
const isEnvConfigComplete = Object.values(envFirebaseConfig).every(Boolean);


export function initializeFirebase() {
  if (getApps().length) {
    return getSdks(getApp());
  }

  // Użyj konfiguracji ze zmiennych środowiskowych, jeśli jest kompletna; w przeciwnym razie użyj lokalnej
  const configToUse = isEnvConfigComplete ? envFirebaseConfig : localFirebaseConfig;
  const firebaseApp = initializeApp(configToUse);
  
  return getSdks(firebaseApp);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';
