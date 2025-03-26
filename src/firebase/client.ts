import { initializeApp,getApp,getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_USER_API_KEY,
  authDomain:process.env.NEXT_PUBLIC_FIREBASE_USER_AUTH_DOMAIN ,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_USER_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_USER_STORAGE_BUCKET,
  messagingSenderId:process.env.NEXT_PUBLIC_FIREBASE_USER_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_USER_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);