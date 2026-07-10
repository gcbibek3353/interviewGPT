'use client'
import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getFeedbackByInterviewAndUserId, getInterviewById } from '@/lib/actions/general.action';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Interview = () => {
    const [interview, setInterview] = useState<Interview | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const params = useParams();
    const id = params.id as string;

    const getUser = async () => {
        const user = await getCurrentUser();
        setUser(user);
        return user;
    }

    const fetchInterview = async () => {
        const res = await getInterviewById(id);
        setInterview(res);
        return res;
    }

    const fetchFeedback = async (userId: string) => {
        const res = await getFeedbackByInterviewAndUserId({ interviewId: id, userId });
        setFeedback(res);
    }

    useEffect(() => {
        const initialize = async () => {
            const curUser = await getUser();
            await fetchInterview();
            if (curUser?.id) await fetchFeedback(curUser.id);
        }
        initialize();
    }, [])

    return (
        <div className="min-h-screen bg-[#08070d] p-6">
            <div className="max-w-4xl mx-auto">
                {/* Interview Header */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold tracking-tight text-[#ece9ff]">
                            {interview?.role} Interview
                            <span className="ml-3 rounded-full bg-[#cac5fe]/10 px-3 py-1 text-sm font-medium text-[#cac5fe]">
                                {interview?.type}
                            </span>
                        </h2>
                        {feedback && (
                            <Link
                                href={`/dashboard/interview/${id}/feedback`}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[#ece9ff] transition hover:border-white/20 hover:bg-white/10 whitespace-nowrap"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                View Previous Feedback
                            </Link>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {interview?.techstack.map((stack, index) => (
                            <span
                                key={index}
                                className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-[#c9c6de] hover:bg-white/10 transition-colors"
                            >
                                {stack}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Agent Component Container */}
                <Agent
                    userName={user?.name as string}
                    userId={user?.id}
                    type="interview"
                    interviewId={id}
                    questions={interview?.questions}
                />


                {/* Footer Note */}
                <div className="mt-6 text-center text-[#7d7a99] text-sm">
                    <p>Interview ID: <span className="font-mono text-[#a9a6c4]">{id}</span></p>
                </div>
            </div>
        </div>
    )
}

export default Interview