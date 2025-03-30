import { cert, initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const init_firebase_admin = () => {
    const apps = getApps();
    const app = apps.length ? apps[0] : initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        })
    });
 
    return {
        auth: getAuth(app),
        db : getFirestore(app)
    }
}

export const {auth , db} = init_firebase_admin();