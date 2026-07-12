'use server';

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;
    // console.log(uid, name, email);

    try {
        const userRef = db.collection("users").doc(uid);
        const userRecord = await userRef.get();
        // console.log(userRecord);

        if (userRecord.exists) {
            return {
                success: false,
                message: "User already exists. Sign In"
            };
        }

        await userRef.set({ name, email });

        return {
            success: true,
            message: "Account created successfully"
        };

    } catch (error: any) {
        console.error(`Error creating a user`, error);

        if (error?.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "This email is already in use"
            };
        }

        return {
            success: false,
            message: "Failed to create account"
        };
    }
}

export async function signInWithOAuth(params: {
    uid: string;
    name: string;
    email: string;
    idToken: string;
}) {
    const { uid, name, email, idToken } = params;
    try {
        const userRef = db.collection("users").doc(uid);
        const userRecord = await userRef.get();

        // Create the Firestore profile the first time an OAuth user signs in.
        if (!userRecord.exists) {
            await userRef.set({ name, email });
        }

        await setSessionCookie(idToken);

        return {
            success: true,
            message: "Signed in successfully"
        };
    } catch (error) {
        console.error("OAuth sign in error", error);
        return {
            success: false,
            message: "Failed to sign in with Google"
        };
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    try {
        const decodedToken = await auth.verifyIdToken(idToken);

        // Check if email matches the token
        if (decodedToken.email !== email) {
            console.log(`email mismatch`);
            return {
                success: false,
                message: "Email mismatch"
            };
        }

        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) return {
            success: false,
            message: "user doesn't exist , create account instead"
        }

        // Ensure a Firestore profile exists. Some accounts exist in Firebase
        // Auth but never got a `users/{uid}` doc (created directly, or a signUp
        // that failed after the Auth user was made). Without this doc,
        // getCurrentUser() returns null and the user can never stay logged in.
        const userDocRef = db.collection("users").doc(userRecord.uid);
        const userDoc = await userDocRef.get();
        if (!userDoc.exists) {
            await userDocRef.set({
                name: userRecord.displayName ?? email.split("@")[0],
                email,
            });
        }

        await setSessionCookie(idToken);

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Failed to sign in to account"
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: '/',
       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
       domain: process.env.COOKIE_DOMAIN
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const uid = decodedClaims.uid;
        // Get user document from Firestore
        const userRef = db.collection("users").doc(uid);
        const userRecord = await userRef.get();

        if (!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}

export async function signOut() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}