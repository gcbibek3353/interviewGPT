import { cert, initializeApp, getApps, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Normalize the private key coming from the environment. Hosting providers
// commonly store it with literal "\n" sequences instead of real newlines, and
// sometimes wrap the whole value in surrounding quotes. Either of those makes
// the PEM invalid and triggers `DECODER routines::unsupported` at parse time.
const getPrivateKey = () => {
    let key = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    if (!key) return undefined;
    // Strip surrounding single/double quotes if the value was quoted.
    if (
        (key.startsWith('"') && key.endsWith('"')) ||
        (key.startsWith("'") && key.endsWith("'"))
    ) {
        key = key.slice(1, -1);
    }
    // Convert literal "\n" into actual newlines.
    return key.replace(/\\n/g, "\n");
};

let cached: { auth: Auth; db: Firestore } | null = null;

const init_firebase_admin = () => {
    if (cached) return cached;

    const apps = getApps();
    const app: App = apps.length
        ? apps[0]
        : initializeApp({
              credential: cert({
                  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
                  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
                  privateKey: getPrivateKey(),
              }),
          });

    cached = {
        auth: getAuth(app),
        db: getFirestore(app),
    };
    return cached;
};

// Lazily initialize on first property access so the Firebase Admin SDK (and the
// private-key parsing) never runs during `next build` / page-data collection —
// only when a request actually touches `auth` or `db`.
export const auth = new Proxy({} as Auth, {
    get: (_target, prop) => {
        const value = init_firebase_admin().auth[prop as keyof Auth];
        return typeof value === "function" ? value.bind(init_firebase_admin().auth) : value;
    },
});

export const db = new Proxy({} as Firestore, {
    get: (_target, prop) => {
        const value = init_firebase_admin().db[prop as keyof Firestore];
        return typeof value === "function" ? value.bind(init_firebase_admin().db) : value;
    },
});
