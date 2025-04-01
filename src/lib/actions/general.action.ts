"use client"; // This is not the server action because we are using client side SDK of firebase

import { collection, query, where, orderBy, limit, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/client";

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

export async function getLatestInterviews(params: GetLatestInterviewsParams) {
    const { userId, interviewLimit = 10 } = params;

    try {
        const interviewsRef = collection(db, "interviews");

        const interviewsQuery = query(
            interviewsRef,
            where("userId", "!=", userId),
            orderBy("createdAt", "desc"),
            limit(interviewLimit),
        )

        const interviewsSnapshot = await getDocs(interviewsQuery);
        // console.log(interviewsSnapshot);

        return interviewsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Interview[];

    } catch (error) {
        console.error("Error fetching interviews:", error);
        return null;
    }
}

export async function getInterviewById(interviewId: string): Promise<Interview | null> {
    try {
        const interviewRef = doc(db, 'interviews', interviewId);
        const interview = await getDoc(interviewRef);
        console.log(interview);
        return interview.data() as Interview | null;
    } catch (error) {
        console.error("Error fetching the interview:", error);
        return null;
    }
}