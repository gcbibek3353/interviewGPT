'use client'
import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewById } from '@/lib/actions/general.action';
import { redirect, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Interview = () => {
    const [interview, setInterview] = useState<Interview | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const params = useParams();
    const id = params.id;

    const getUser = async () => {
        const user = await getCurrentUser();
        setUser(user);
    }

    const fetchInterview = async () => {
        const res = await getInterviewById(id);
        setInterview(res)
    }

    useEffect(() => {
        fetchInterview();
        getUser();
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