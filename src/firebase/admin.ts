
import { initializeApp, getApps, App, cert, credential } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// IMPORTANT: DO NOT MODIFY THIS FILE

function initializeAdminApp(): { app: App; auth: ReturnType<typeof getAuth>; firestore: ReturnType<typeof getFirestore> } {
  const apps = getApps();
  if (apps.length > 0) {
    const app = apps[0];
    return { app, auth: getAuth(app), firestore: getFirestore(app) };
  }
  
  let cred: credential.Credential;
  try {
    // This will succeed in any Google Cloud environment (including App Hosting, Cloud Run, Cloud Functions, and Workstations)
    // where Application Default Credentials are available.
    cred = credential.applicationDefault();
  } catch (error) {
    // If ADC fails, it means we are likely in a local development environment
    // that hasn't been configured with gcloud auth application-default login.
    // In this case, we fall back to the service account key file.
    console.log("Application Default Credentials not found, falling back to firebase-credentials.json");
    cred = credential.cert('firebase-credentials.json');
  }

  const app = initializeApp({
    credential: cred,
    databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
    projectId: process.env.GCLOUD_PROJECT,
    storageBucket: `${process.env.GCLOUD_PROJECT}.appspot.com`,
  });

  return { app, auth: getAuth(app), firestore: getFirestore(app) };
}

export { initializeAdminApp };
