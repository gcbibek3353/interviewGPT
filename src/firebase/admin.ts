import { cert, initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const init_firebase_admin = () => {
    const apps = getApps();
    if (!apps.length) {
        initializeApp({
            credential: cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID,
                clientEmail: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_EMAIL,
                privateKey: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            })
        })
    }
    return {
        auth: getAuth(),
        db : getFirestore()
    }
}

export const {auth , db} = init_firebase_admin();