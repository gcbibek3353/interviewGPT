"use server"; // Server actions — reads run through the Admin SDK using the
// verified session cookie, so they bypass firestore.rules (which deny all
// client access). Authorization is enforced here via getCurrentUser().

import { db } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function getInterviewsByUserId(
    userId: string
): Promise<Interview[] | null> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !userId) {
            return null;
        }

        // Sort in memory (by ISO createdAt) to avoid a composite index on
        // (userId, createdAt).
        const interviewsSnapshot = await db
            .collection("interviews")
            .where("userId", "==", userId)
            .get();

        const interviews = interviewsSnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }) as Interview)
            .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

        console.log(`[getInterviewsByUserId] userId=${userId} -> ${interviews.length} interview(s)`);
        return interviews;
    } catch (error) {
        console.error("Error fetching interviews:", error);
        return null;
    }
}

export async function getLatestInterviews(params: GetLatestInterviewsParams) {
    const { userId, interviewLimit = 10 } = params;
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return null;
        }

        const interviewsSnapshot = await db
            .collection("interviews")
            .where("userId", "!=", userId)
            .orderBy("createdAt", "desc")
            .limit(interviewLimit)
            .get();

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
        const currentUser = await getCurrentUser();
        if (!currentUser || !interviewId) {
            return null;
        }

        const interview = await db.collection("interviews").doc(interviewId).get();

        if (!interview.exists) return null;

        return { id: interview.id, ...interview.data() } as Interview;
    } catch (error) {
        console.error("Error fetching the interview:", error);
        return null;
    }
}

export async function getFeedbackByInterviewAndUserId(params: GetFeedbackByInterviewAndUserIdParams) {
    try {
        const { interviewId, userId } = params;

        if (!interviewId) {
            throw new Error('interviewId is required');
        }

        if (!userId) {
            throw new Error('userId is required');
        }

        const currentUser = await getCurrentUser();
        // A user may only read their own feedback.
        if (!currentUser || currentUser.id !== userId) {
            return null;
        }

        const querySnapshot = await db
            .collection("feedback")
            .where("interviewId", "==", interviewId)
            .where("userId", "==", userId)
            .limit(1)
            .get();

        if (querySnapshot.empty) return null;

        const feedback = querySnapshot.docs[0];
        return {
            id: feedback.id,
            ...feedback.data(),
        } as Feedback;
    } catch (error) {
        console.error(`Error fetching database`, error);
        return null;
    }
}

export async function getCompletedInterviews(userId: string): Promise<Feedback[] | null> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.id !== userId) {
            return null;
        }

        // Sort in memory (by ISO createdAt) to avoid a composite index on
        // (userId, createdAt).
        const feedbacksSnapshot = await db
            .collection("feedback")
            .where("userId", "==", userId)
            .get();

        return feedbacksSnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }) as Feedback)
            .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
    } catch (error) {
        console.error("Error fetching completed feedbacks:", error);
        return null;
    }
}

// Returns the user's feedbacks, each joined with the interview it belongs to
// (so the dashboard can show the role/type alongside the score).
export async function getUserFeedbacks(
    userId: string
): Promise<FeedbackWithInterview[] | null> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.id !== userId) {
            return null;
        }

        const feedbacksSnapshot = await db
            .collection("feedback")
            .where("userId", "==", userId)
            .get();

        const feedbacks = feedbacksSnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }) as Feedback)
            .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));

        // Join each feedback with its interview (best-effort).
        const withInterviews = await Promise.all(
            feedbacks.map(async (feedback) => {
                let interview: Interview | null = null;
                try {
                    const interviewDoc = await db
                        .collection("interviews")
                        .doc(feedback.interviewId)
                        .get();
                    if (interviewDoc.exists) {
                        interview = { id: interviewDoc.id, ...interviewDoc.data() } as Interview;
                    }
                } catch (err) {
                    console.error("Error joining interview for feedback", feedback.id, err);
                }
                return { ...feedback, interview };
            })
        );

        return withInterviews;
    } catch (error) {
        console.error("Error fetching user feedbacks:", error);
        return null;
    }
}
