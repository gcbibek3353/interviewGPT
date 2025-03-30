"use client"; // Note: Changed from "use server" to "use client"

import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/firebase/client"; // Your client-side Firebase config

export async function getInterviewsByUserId(
    userId: string
): Promise<Interview[] | null> {
    try {
        if (!userId) {
            return null;
        }
        
        const interviewsRef = collection(db, "interviews");
        const interviewsQuery = query(
            interviewsRef,
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        
        const interviewsSnapshot = await getDocs(interviewsQuery);
        
        return interviewsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Interview[];
    } catch (error) {
        console.error("Error fetching interviews:", error);
        return null;
    }
}