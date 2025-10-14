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
  
  // In a deployed App Hosting environment, the GOOGLE_APPLICATION_CREDENTIALS is not set,
  // but default credentials are still available.
  const useDefaultCredentials = !process.env.GOOGLE_APPLICATION_CREDENTIALS;

  const app = initializeApp({
    credential: useDefaultCredentials 
      ? credential.applicationDefault() 
      : cert(process.env.GOOGLE_APPLICATION_CREDENTIALS!),
    databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
    projectId: process.env.GCLOUD_PROJECT,
    storageBucket: `${process.env.GCLOUD_PROJECT}.appspot.com`,
  });

  return { app, auth: getAuth(app), firestore: getFirestore(app) };
}

export { initializeAdminApp };
