
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

  // Check if we're in a development environment
  if (process.env.NODE_ENV === 'development') {
    // Connect to emulators in development
    console.log("Development environment detected. Connecting to Firebase emulators.");
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
    process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
    
    const app = initializeApp({
      projectId: process.env.GCLOUD_PROJECT || 'demo-dieta-nero', // Use a demo project ID for emulators
    });
    return { app, auth: getAuth(app), firestore: getFirestore(app) };
  }

  // Production environment logic (unchanged)
  let cred: credential.Credential;
  try {
    // This will succeed in any Google Cloud environment (including App Hosting, Cloud Run, Cloud Functions, and Workstations)
    // where Application Default Credentials are available.
    cred = credential.applicationDefault();
  } catch (error) {
    // This block will now only be a concern for non-Google Cloud production-like environments,
    // which is a very rare edge case. For local dev, the emulator block above handles it.
    console.error("Application Default Credentials not found in a non-dev environment. Falling back to firebase-credentials.json attempt.", error);
    try {
        cred = cert('firebase-credentials.json');
    } catch (certError) {
        console.error("Failed to parse service account json file: firebase-credentials.json not found or invalid.", certError);
        throw new Error("Firebase Admin SDK initialization failed. Could not find Application Default Credentials or a valid firebase-credentials.json file.");
    }
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
