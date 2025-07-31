import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
<<<<<<< Updated upstream
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

=======
 
};


let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;


>>>>>>> Stashed changes
// This check prevents the app from crashing if Firebase credentials are not set.
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  db = getFirestore(app);
  auth = getAuth(app);
} else {
  console.warn(
    "Firebase configuration is missing or incomplete. Firebase-dependent features will be disabled. Please create a .env.local file in your project's root directory and add your Firebase project's configuration keys. For example: \n\nNEXT_PUBLIC_FIREBASE_API_KEY=your_api_key\nNEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id\n\nYou can find these values in your Firebase project settings."
  );
}
<<<<<<< Updated upstream

export { app, db, auth };
=======
export { app, db, auth };
>>>>>>> Stashed changes
