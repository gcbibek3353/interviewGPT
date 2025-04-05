"use client"; // This is not the server action because we are using client side SDK of firebase

import { collection, query, where, orderBy, limit, getDocs, getDoc, doc, setDoc, addDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { generateObject } from "ai";
import { google } from "@/lib/google-ai.config";
import { feedbackSchema } from "@/constants";

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
    // console.log('user id calling latest interviews is ' , userId);
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
        // console.log(interview);
        return interview.data() as Interview | null;
    } catch (error) {
        console.error("Error fetching the interview:", error);
        return null;
    }
}

export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, transcript } = params;

    try {
        const formattedTranscript = transcript.map((sentence: { role: string, content: string }) => (
            `- ${sentence.role} : ${sentence.content} \n`
        )).join('');

        const googleModel = google('gemini-2.0-flash-001', {
            structuredOutputs: false,
        })
        console.log(formattedTranscript);
        const { object } = await generateObject({
            model: googleModel,
            schema: feedbackSchema,
            prompt: `
            You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
            Transcript:
            ${formattedTranscript}
    
            Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
            - **Communication Skills**: Clarity, articulation, structured responses.
            - **Technical Knowledge**: Understanding of key concepts for the role.
            - **Problem-Solving**: Ability to analyze problems and propose solutions.
            - **Cultural & Role Fit**: Alignment with company values and job role.
            - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
            `,
            system:
                "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
        });

        console.log(object);
        console.log(interviewId, userId);
        const tempuserId = 'MmiFJpaCSBhlxox0zFJOjsxmdPf1';

        const feedbackRef = collection(db, "feedback");
        const feedback = await addDoc(feedbackRef, {
            interviewId,
            userId: tempuserId,
            totalScore: object.totalScore,
            categoryScores: object.categoryScores,
            strengths: object.strengths,
            areasForImprovement: object.areasForImprovement,
            finalAssessment: object.finalAssessment,
            createdAt: new Date().toISOString()
        });

        return {
            success: true,
            feedbackId: feedback.id
            // feedbackId : 'static Id for now'
        }

    } catch (error) {
        console.error('Error saving feedback');
        console.log(error);

        return {
            success: false,
            feedbackId: ""
        }
    }

}

export async function getFeedbackByInterviewAndUserId(params: GetFeedbackByInterviewAndUserIdParams) {
    try {
        const { interviewId, userId } = params;

        // Validate required parameters
        if (!interviewId) {
            throw new Error('interviewId is required');
        }

        // Temporarily Hardcoded
        // if (!userId) {
        //     throw new Error('userId is required');
        // }

        const feedbackRef = collection(db, 'feedback');

        const q = query(feedbackRef, where('interviewId', '==', interviewId), where('userId', '==', "MmiFJpaCSBhlxox0zFJOjsxmdPf1"));
        // const q = query(feedbackRef, where('interviewId', '==', interviewId), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const feedback = querySnapshot.docs[0];
            console.log(feedback);
            return {
                id: feedback.id,
                ...feedback.data()
            } as Feedback;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching database`, error);
        return null;
    }
}
