'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/feedback.action';
import { Mic } from 'lucide-react';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED'
}
interface SavedMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
    const router = useRouter();
    const [isSpeaking, setIsSpeaking] = React.useState(false);
    const [callStatus, setCallStatus] = React.useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = React.useState<SavedMessage[]>([]);
    // Ensures we only handle the end-of-call action (create interview /
    // generate feedback) once, even if the effect re-runs.
    const hasHandledEndRef = React.useRef(false);

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage = {
                    role: message.role,
                    content: message.transcript
                }
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }

        }

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => console.log(`Error: ${error}`);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError);
        }
    }, [])

    const handleGenerateInterview = async (messages: SavedMessage[]) => {
        try {
            if (messages.length === 0) {
                // Nothing was said — don't create an empty interview.
                router.push('/dashboard');
                return;
            }

            const res = await fetch('/api/vapi/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transcript: messages,
                    userid: userId,
                }),
            });
            const data = await res.json();
            if (!data.success) console.log('Failed to generate interview', data);
        } catch (error) {
            console.log('Error generating interview', error);
        }
        router.push('/dashboard');
    }

    const handleGenerateFeedBack = async (messages: SavedMessage[]) => {
        console.log('Control reached here 101');
        const { success, feedbackId } = await createFeedback({
            interviewId: interviewId!,
            userId: userId!,
            transcript: messages
        })
        console.log(success, feedbackId);
        if (success && feedbackId) router.push(`/dashboard/interview/${interviewId}/feedback`)
        else {
            console.log("error while generating feedback");
            router.push('/dashboard')
        }
    }

    useEffect(() => {
        if (callStatus === CallStatus.FINISHED && !hasHandledEndRef.current) {
            hasHandledEndRef.current = true;
            if (type === "generate") handleGenerateInterview(messages);
            else handleGenerateFeedBack(messages);
        }
    }, [messages, callStatus, type, userId])

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        if (type === 'generate') {
            // starting vapi call with workflow_id
            await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
                variableValues: {
                    username: userName,
                    userid: userId
                }
            });
        } else {
            let formattedQuestions = '';
            if (questions) {
                formattedQuestions = questions.map(question => `- ${question}`).join('\n')
            }
            // starting vapi call with assistant config ...
            // Learn more at : https://docs.vapi.ai/sdk/web
            await vapi.start(interviewer, {
                variableValues: {
                    questions: formattedQuestions
                }
            })
        }
    }

    const handleDisconnect = async () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    }

    const latestMessage = messages[messages.length - 1]?.content;
    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;
    return (
        <div className="bg-gray-900 text-gray-100 p-4 md:p-8">
            {/* Main Container */}
            <div className="max-w-5xl mx-auto bg-gray-800/40 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-sm overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 px-6 py-4">
                    <h2 className="text-xl md:text-2xl font-bold text-purple-400 flex items-center gap-2">
                        <div className="h-3 w-3 bg-purple-500 rounded-full animate-pulse"></div>
                        {type === "generate" ? "AI Interview Generator" : "AI Interview Session"}
                    </h2>
                </div>

                {/* Content Area */}
                <div className="p-4 md:p-8">
                    {/* User Cards */}
                    <div className="flex flex-col md:flex-row gap-6 mb-10">
                        {/* AI Interviewer Card */}
                        <div className="flex-1 bg-gray-800 rounded-xl p-6 border border-purple-500/30 relative group overflow-hidden transition-all duration-300 hover:border-purple-400/50">
                            {/* Background Pattern */}
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all duration-500"></div>

                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="mx-auto w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                                        <Mic className="w-8 h-8 text-purple-500" />
                                    </div>
                                    {isSpeaking && (
                                        <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
                                            <span className="w-4 h-4 bg-purple-500 rounded-full border-2 border-gray-800"></span>
                                            <span className="w-4 h-4 bg-purple-500/50 rounded-full absolute animate-ping"></span>
                                        </div>
                                    )}
                                </div>

                                <div className="relative z-10">
                                    <span className="px-3 py-1 text-xs bg-purple-900/60 text-purple-200 rounded-full mb-2 inline-block">Interviewer</span>
                                    <h3 className="text-lg md:text-xl font-bold text-white">{type === "generate" ? "AI Interview Generator" : "InterviewGPT"}</h3>
                                    <p className="text-sm text-gray-400">Powered by advanced AI</p>
                                </div>
                            </div>
                        </div>

                        {/* Candidate Card */}
                        <div className="flex-1 bg-gray-800 rounded-xl p-6 border border-gray-700 relative group overflow-hidden transition-all duration-300 hover:border-gray-600">
                            {/* Background Pattern */}
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gray-700/50 rounded-full blur-2xl"></div>

                            <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16 flex items-center justify-center">
                                    <Image
                                        src="/user-avatar.png"
                                        alt="user"
                                        width={80}
                                        height={80}
                                        className="rounded-full border-2 shadow-lg"
                                    />
                                </div>

                                <div className="relative z-10">
                                    <span className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full mb-2 inline-block">Candidate</span>
                                    <h3 className="text-lg md:text-xl font-bold text-white">{userName}</h3>
                                    <p className="text-sm text-gray-400">Interview participant</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    {messages.length > 0 && (
                        <div className="mb-10">
                            <h3 className="text-sm uppercase text-gray-500 font-medium mb-3 flex items-center gap-2">
                                <div className="h-1 w-5 bg-purple-500 rounded-full"></div>
                                Current Conversation
                            </h3>

                            <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 shadow-inner">
                                <p className="text-gray-300 text-lg">
                                    {latestMessage}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Controls Section */}
                    <div className="flex flex-col items-center justify-center mt-6">
                        <h3 className="text-sm uppercase text-gray-500 font-medium mb-4 flex items-center gap-2">
                            <div className="h-1 w-5 bg-purple-500 rounded-full"></div>
                            Call Controls
                        </h3>

                        {callStatus !== CallStatus.ACTIVE ? (
                            <button
                                onClick={handleCall}
                                className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-4 px-10 rounded-full flex items-center gap-3 transition-all duration-300 shadow-lg shadow-purple-900/20 hover:shadow-purple-600/30">
                                <div className="relative flex items-center justify-center h-4 w-4">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75 animate-ping"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-300"></span>
                                </div>
                                <span className="text-lg">
                                    {isCallInactiveOrFinished
                                        ? 'Start Interview'
                                        : 'Connecting...'}
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={handleDisconnect}
                                className="bg-red-600 hover:bg-red-500 text-white font-medium py-4 px-10 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg shadow-red-900/20 hover:shadow-red-600/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <span className="text-lg">End Interview</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Agent