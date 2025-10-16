
import { initializeApp, getApps, App, cert, credential } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function initializeAdminApp(): { app: App; auth: ReturnType<typeof getAuth>; firestore: ReturnType<typeof getFirestore> } {
  const apps = getApps();
  if (apps.length > 0) {
    const app = apps[0];
    return { app, auth: getAuth(app), firestore: getFirestore(app) };
  }

  // Ulepszona logika: Jeśli zmienne emulatora są ustawione, ZAWSZE używaj emulatorów.
  // Działa to zarówno lokalnie, jak i w specjalnych środowiskach CI/CD.
  if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    console.log("Emulator environment detected. Connecting to Firebase emulators.");
    const app = initializeApp({
      projectId: process.env.GCLOUD_PROJECT || 'demo-dieta-nero',
    });
    return { app, auth: getAuth(app), firestore: getFirestore(app) };
  }

  // Logika produkcyjna: Używaj domyślnych poświadczeń Google Cloud.
  // To działa automatycznie w App Hosting, Cloud Run, itp.
  // Usunęliśmy zawodną próbę odczytu pliku JSON.
  try {
    const cred = credential.applicationDefault();
    const app = initializeApp({
      credential: cred,
      projectId: process.env.GCLOUD_PROJECT,
    });
    return { app, auth: getAuth(app), firestore: getFirestore(app) };
  } catch (error) {
    console.error("Firebase Admin SDK initialization failed in production-like environment.", error);
    throw new Error("Could not initialize Firebase Admin SDK. Application Default Credentials not found.");
  }
}

export { initializeAdminApp };
