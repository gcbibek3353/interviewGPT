'use server';

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import {auth} from "@/firebase/admin";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;
    // console.log(uid, name, email);
    
    try {
        const userRef = doc(db, "users", uid);
        const userRecord = await getDoc(userRef);
        // console.log(userRecord);

        if (userRecord.exists()) {
            return {
                success: false,
                message: "User already exists. Sign In"
            };
        }

        await setDoc(userRef, { name, email });

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


export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    try {

        const decodedToken = await auth.verifyIdToken(idToken);
        
        // Check if email matches the token
        if (decodedToken.email !== email) {
            return {
                success: false,
                message: "Email mismatch"
            };
        }
        console.log(`control here`);
        

        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) return {
            success: false,
            message: "user doesn't exist , create account instead"
        }        
        // console.log(`id token is ${idToken}`);
        
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
        sameSite: "lax"
    })
}

export async function getCurrentUser() : Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const uid = decodedClaims.uid;
        // Get user document from Firestore
        const userRef = doc(db, "users", uid);
        const userRecord = await getDoc(userRef);

        if (!userRecord.exists()) return null;

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
    // console.log(user);
    return !!user;
}