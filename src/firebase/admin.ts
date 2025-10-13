import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';

// IMPORTANT: DO NOT MODIFY THIS FILE

function initializeAdminApp(): { app: App; auth: ReturnType<typeof getAuth>; firestore: ReturnType<typeof getFirestore> } {
  const apps = getApps();
  if (apps.length > 0) {
    const app = apps[0];
    return { app, auth: getAuth(app), firestore: getFirestore(app) };
  }

  // This environment variable is automatically set by Firebase App Hosting.
  const serviceAccountId = process.env.FIREBASE_SERVICE_ACCOUNT_ID;

  if (!serviceAccountId) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_ID environment variable is not set. ' +
      'This is required for Firebase Admin SDK initialization on the server.'
    );
  }

  const app = initializeApp({
    credential: credential.applicationDefault(),
    databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
    projectId: process.env.GCLOUD_PROJECT,
    storageBucket: `${process.env.GCLOUD_PROJECT}.appspot.com`,
  });

  return { app, auth: getAuth(app), firestore: getFirestore(app) };
}

export { initializeAdminApp };
