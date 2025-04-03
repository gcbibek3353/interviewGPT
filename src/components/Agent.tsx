'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/general.action';

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

    const handleGenerateFeedBack = async (messages: SavedMessage[]) => {
        console.log('Control reached here');
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
        if (callStatus === CallStatus.FINISHED) {
            if (type === "generate") router.push('/dashboard');
            else handleGenerateFeedBack(messages);
        }
    }, [messages, callStatus, type, userId])

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        if (type === 'generate') {
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
        <div className="bg-gray-900 text-gray-100 min-h-screen p-6 flex flex-col items-center justify-between">
            {/* Cards Container */}
            <div className="w-full max-w-4xl flex justify-between gap-8 mb-8">
                {/* AI Interviewer Card */}
                <div className="bg-gray-800 rounded-xl p-6 flex-1 flex flex-col items-center border border-blue-500/30">
                    <div className="relative mb-4">
                        <Image
                            src="/ai-avatar.png"
                            alt="agent"
                            width={100}
                            height={100}
                            className="rounded-full border-2 border-blue-500"
                        />
                        {isSpeaking && (
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-gray-800 animate-pulse"></span>
                        )}
                    </div>
                    <h3 className="text-xl font-semibold text-blue-400">{type === "generate" ? "AI Interview Generator" : "AI Interviewer"}</h3>
                </div>

                {/* Candidate Card */}
                <div className="bg-gray-800 rounded-xl p-6 flex-1 flex flex-col items-center border border-purple-500/30">
                    <div className="mb-4">
                        <Image
                            src="/user-avatar.png"
                            alt="user"
                            width={100}
                            height={100}
                            className="rounded-full border-2 border-purple-500"
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-purple-400">{userName}</h3>
                </div>
            </div>

            {/* Last Message */}
            {messages.length > 0 && (
                <div className="w-full max-w-2xl mb-8 text-center">
                    <p className="bg-gray-800/50 text-gray-300 text-lg p-4 rounded-lg border border-gray-700 animate-fade-in">
                        {latestMessage}
                    </p>
                </div>
            )}

            {/* Call Button */}
            <div className="w-full flex justify-center">
                {callStatus !== CallStatus.ACTIVE ? (
                    <button
                        onClick={handleCall}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-8 rounded-full flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-blue-500/20">
                        <span className="w-2 h-2 bg-blue-300 rounded-full animate-ping"></span>
                        <span>
                            {isCallInactiveOrFinished
                                ? 'Start Call'
                                : 'Connecting...'}
                        </span>
                    </button>
                ) : (
                    <button
                        onClick={handleDisconnect}
                        className="bg-red-600 hover:bg-red-500 text-white font-medium py-3 px-8 rounded-full transition-all duration-200 shadow-lg hover:shadow-red-500/20">
                        End Call
                    </button>
                )}
            </div>
        </div>
    )
}

export default Agent