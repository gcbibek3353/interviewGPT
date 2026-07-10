"use server";

import { db } from "@/firebase/admin";
import { generateObject } from "ai";
import { google } from "@/lib/google-ai.config";
import { groq, GROQ_FALLBACK_MODEL } from "@/lib/groq-ai.config";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, transcript } = params;

    try {
        const formattedTranscript = transcript.map((sentence: { role: string, content: string }) => (
            `- ${sentence.role} : ${sentence.content} \n`
        )).join('');

        const prompt = `
            You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
            Transcript:
            ${formattedTranscript}

            Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
            - **Communication Skills**: Clarity, articulation, structured responses.
            - **Technical Knowledge**: Understanding of key concepts for the role.
            - **Problem-Solving**: Ability to analyze problems and propose solutions.
            - **Cultural & Role Fit**: Alignment with company values and job role.
            - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
            `;
        const system =
            "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories";

        let object;
        try {
            const googleModel = google('gemini-2.0-flash-001', {
                structuredOutputs: false,
            });
            console.log('calling the gemini ');

            ({ object } = await generateObject({
                model: googleModel,
                schema: feedbackSchema,
                prompt,
                system,
            }));
            console.log('gemini responded');
        } catch (geminiError) {
            // Gemini key expired / unavailable — fall back to Groq.
            console.warn('Gemini failed, falling back to Groq:', geminiError);

            ({ object } = await generateObject({
                model: groq(GROQ_FALLBACK_MODEL),
                schema: feedbackSchema,
                prompt,
                system,
            }));
            console.log('grok responded');

        }
        console.log(object);

        const feedback = await db.collection("feedback").add({
            interviewId,
            userId,
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
        };

    } catch (error) {
        console.error('Error saving feedback');
        console.log(error);

        return {
            success: false,
            feedbackId: ""
        };
    }
}
