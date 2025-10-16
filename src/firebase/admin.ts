import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
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
  
  // Use application default credentials in production. In development, use a service account key.
  // This is more robust than checking for GOOGLE_APPLICATION_CREDENTIALS.
  const useDefaultCredentials = process.env.NODE_ENV === 'production';

  const app = initializeApp({
    credential: useDefaultCredentials
      ? credential.applicationDefault()
      : credential.cert('firebase-credentials.json'), // Expects the file in the root for local dev
    databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
    projectId: process.env.GCLOUD_PROJECT,
    storageBucket: `${process.env.GCLOUD_PROJECT}.appspot.com`,
  });

  return { app, auth: getAuth(app), firestore: getFirestore(app) };
}

export { initializeAdminApp };
