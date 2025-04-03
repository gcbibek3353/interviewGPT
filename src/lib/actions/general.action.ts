"use client"; // This is not the server action because we are using client side SDK of firebase

import { collection, query, where, orderBy, limit, getDocs, getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
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

        console.log(process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY);

        const { object: { totalScore, categoryScores, strengths, areasForImprovement, finalAssessment } } = await generateObject({
            model: google('gemini-2.0-flash-001', {
                structuredOutputs: false,
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY, // TODO : find out why generateObject() is not automatically picking GOOGLE_GENERATIVE_AI_API_KEY env variable from .env file and remove this NEXT_PUBLIC_... ENV variable
            }),
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
        console.log(finalAssessment, areasForImprovement);


        const feedback = await setDoc(doc(db, "feedback"), {
            interviewId,
            userId,
            totalScore,
            categoryScores,
            strengths,
            areasForImprovement,
            finalAssessment,
            createdAt: new Date().toISOString()
        })

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
