import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { google } from "@ai-sdk/google";
import { groq, GROQ_FALLBACK_MODEL } from "@/lib/groq-ai.config";
import { generateObject, generateText } from "ai";
import { z } from "zod";

export async function GET() {
    return Response.json({
        success: true,
        message: "Health ok"
    }, {
        status: 200
    })
}

// Structured interview configuration extracted from the voice conversation.
const interviewSchema = z.object({
    role: z.string().describe("The job role the candidate is interviewing for"),
    level: z.string().describe("The experience level, e.g. Junior, Mid, Senior"),
    techstack: z.array(z.string()).describe("Technologies relevant to the role"),
    type: z.string().describe("The interview focus: Technical, Behavioural, or Mixed"),
    amount: z.number().int().min(1).max(20).describe("Number of questions to generate"),
    questions: z.array(z.string()).describe("The generated interview questions"),
});

type Transcript = { role: string; content: string }[];

export async function POST(request: Request) {
    const body = await request.json();
    const { transcript, userid } = body as { transcript?: Transcript; userid?: string };

    try {
        if (!userid) {
            return Response.json(
                { success: false, message: "userid is required" },
                { status: 400 }
            );
        }

        let interviewData: z.infer<typeof interviewSchema>;

        if (transcript && transcript.length > 0) {
            // New flow: extract the interview config AND generate the questions
            // from what the candidate said during the voice call.
            const formattedTranscript = transcript
                .map((line) => `- ${line.role}: ${line.content}`)
                .join("\n");

            const prompt = `You are setting up a mock job interview based on a voice conversation between an assistant and a candidate. From the transcript, determine the interview configuration and generate the questions.

            Transcript:
            ${formattedTranscript}

            Instructions:
            - Infer the job role, experience level, tech stack, and interview focus (Technical, Behavioural, or Mixed) from the conversation.
            - Determine how many questions the candidate asked for. If unclear, default to 5.
            - Generate that many interview questions tailored to the role, level, tech stack and focus.
            - The questions will be read aloud by a voice assistant, so do NOT use "/", "*", or other special characters that might break it.`;

            interviewData = await generateInterviewObject(prompt);
        } else {
            // Legacy flow: the Vapi workflow (or another caller) posted the
            // structured fields directly. Generate only the questions.
            const { type, role, level, techstack, amount } = body;

            const prompt = `Prepare questions for a job interview.
            The job role is ${role}.
            The job experience level is ${level}.
            The tech stack used in the job is: ${techstack}.
            The focus between behavioural and technical questions should lean towards: ${type}.
            The amount of questions required is: ${amount}.
            Please return only the questions, without any additional text.
            The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
            Return the questions formatted like this:
            ["Question 1", "Question 2", "Question 3"]

            Thank you! <3
        `;

            const questions = await generateQuestionsText(prompt);
            interviewData = {
                role,
                level,
                type,
                techstack: typeof techstack === "string" ? techstack.split(",") : techstack,
                amount: Number(amount) || questions.length,
                questions,
            };
        }

        const interview = {
            role: interviewData.role,
            type: interviewData.type,
            level: interviewData.level,
            techstack: interviewData.techstack,
            questions: interviewData.questions,
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString()
        }
        await db.collection("interviews").add(interview);

        return Response.json({
            success: true,
            message: "Interview generated successfully",
        }, {
            status: 200
        }
        )

    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            message: "Internal server error",
            error: error
        }, {
            status: 500
        });
    }
}

// Generate a structured interview object, falling back to Groq if Gemini fails.
async function generateInterviewObject(prompt: string) {
    try {
        const { object } = await generateObject({
            model: google("gemini-2.0-flash-001", { structuredOutputs: false }),
            schema: interviewSchema,
            prompt,
        });
        return object;
    } catch (geminiError) {
        console.warn("Gemini failed, falling back to Groq:", geminiError);
        const { object } = await generateObject({
            model: groq(GROQ_FALLBACK_MODEL),
            schema: interviewSchema,
            prompt,
        });
        return object;
    }
}

// Generate questions as a JSON array string, falling back to Groq if Gemini fails.
async function generateQuestionsText(prompt: string): Promise<string[]> {
    let text: string;
    try {
        ({ text } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt,
        }));
    } catch (geminiError) {
        console.warn("Gemini failed, falling back to Groq:", geminiError);
        ({ text } = await generateText({
            model: groq(GROQ_FALLBACK_MODEL),
            prompt,
        }));
    }
    return JSON.parse(text);
}
