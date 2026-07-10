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
        <div className="text-[#ece9ff] p-4 md:p-8">
            {/* Main Container */}
            <div className="max-w-5xl mx-auto rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
                {/* Header Section */}
                <div className="border-b border-white/10 px-6 py-4">
                    <h2 className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-semibold tracking-tight text-[#cac5fe] flex items-center gap-2">
                        <div className="h-3 w-3 bg-[#cac5fe] rounded-full animate-pulse"></div>
                        {type === "generate" ? "AI Interview Generator" : "AI Interview Session"}
                    </h2>
                </div>

                {/* Content Area */}
                <div className="p-4 md:p-8">
                    {/* User Cards */}
                    <div className="flex flex-col md:flex-row gap-6 mb-10">
                        {/* AI Interviewer Card */}
                        <div className="flex-1 rounded-2xl border border-[#cac5fe]/20 bg-white/[0.02] p-6 relative group overflow-hidden transition-all duration-300 hover:border-[#cac5fe]/40">
                            {/* Background Pattern */}
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#7c6dff]/10 rounded-full blur-2xl group-hover:bg-[#7c6dff]/20 transition-all duration-500"></div>

                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="mx-auto w-16 h-16 rounded-2xl bg-[#cac5fe]/10 flex items-center justify-center mb-4">
                                        <Mic className="w-8 h-8 text-[#cac5fe]" />
                                    </div>
                                    {isSpeaking && (
                                        <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
                                            <span className="w-4 h-4 bg-[#cac5fe] rounded-full border-2 border-[#08070d]"></span>
                                            <span className="w-4 h-4 bg-[#cac5fe]/50 rounded-full absolute animate-ping"></span>
                                        </div>
                                    )}
                                </div>

                                <div className="relative z-10">
                                    <span className="rounded-full bg-[#cac5fe]/10 px-3 py-1 text-xs font-medium text-[#cac5fe] mb-2 inline-block">Interviewer</span>
                                    <h3 className="text-lg md:text-xl font-semibold text-[#ece9ff]">{type === "generate" ? "AI Interview Generator" : "InterviewGPT"}</h3>
                                    <p className="text-sm text-[#a9a6c4]">Powered by advanced AI</p>
                                </div>
                            </div>
                        </div>

                        {/* Candidate Card */}
                        <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-6 relative group overflow-hidden transition-all duration-300 hover:border-white/20">
                            {/* Background Pattern */}
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

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
                                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-[#c9c6de] mb-2 inline-block">Candidate</span>
                                    <h3 className="text-lg md:text-xl font-semibold text-[#ece9ff]">{userName}</h3>
                                    <p className="text-sm text-[#a9a6c4]">Interview participant</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    {messages.length > 0 && (
                        <div className="mb-10">
                            <h3 className="text-sm uppercase tracking-wider text-[#7d7a99] font-medium mb-3 flex items-center gap-2">
                                <div className="h-1 w-5 bg-[#cac5fe] rounded-full"></div>
                                Current Conversation
                            </h3>

                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                                <p className="text-[#c9c6de] text-lg">
                                    {latestMessage}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Controls Section */}
                    <div className="flex flex-col items-center justify-center mt-6">
                        <h3 className="text-sm uppercase tracking-wider text-[#7d7a99] font-medium mb-4 flex items-center gap-2">
                            <div className="h-1 w-5 bg-[#cac5fe] rounded-full"></div>
                            Call Controls
                        </h3>

                        {callStatus !== CallStatus.ACTIVE ? (
                            <button
                                onClick={handleCall}
                                className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#cac5fe] to-[#7c6dff] py-4 px-10 font-semibold text-[#08070d] shadow-[0_8px_30px_-8px_rgba(124,109,255,0.7)] transition hover:brightness-110">
                                <div className="relative flex items-center justify-center h-4 w-4">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#cac5fe] opacity-75 animate-ping"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ece9ff]"></span>
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
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f75353] py-4 px-10 font-semibold text-white shadow-[0_8px_30px_-8px_rgba(247,83,83,0.6)] transition hover:brightness-110">
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