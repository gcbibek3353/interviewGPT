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
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Interview Header */}
                <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700 shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                            {interview?.role} Interview
                            <span className="ml-3 px-3 py-1 text-sm font-medium rounded-full bg-blue-900/50 text-blue-300">
                                {interview?.type}
                            </span>
                        </h2>
                        {feedback && (
                            <Link
                                href={`/dashboard/interview/${id}/feedback`}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-blue-300 bg-blue-900/30 border border-blue-800 hover:bg-blue-900/50 transition-colors whitespace-nowrap"
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
                                className="px-3 py-1 text-sm rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
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
                <div className="mt-6 text-center text-gray-500 text-sm">
                    <p>Interview ID: <span className="font-mono text-gray-400">{id}</span></p>
                </div>
            </div>
        </div>
    )
}

export default Interview