import Image from 'next/image'
import React from 'react'

enum CallStatus{
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED'
}

const Agent = ({ userName }: AgentProps) => {

    const isSpeaking = true;
    const callStatus = CallStatus.INACTIVE;
    const messages = [
        'Hello, how are you?',
        'Hi,I am John Doe',
        'I am a software engineer',
        'I have 5 years of experience in React and Node.js',
    ]
    const lastMessage = messages[messages.length - 1];

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
                <h3 className="text-xl font-semibold text-blue-400">AI Interviewer</h3>
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
                    {lastMessage}
                </p>
            </div>
        )}
    
        {/* Call Button */}
        <div className="w-full flex justify-center">
            {callStatus !== CallStatus.ACTIVE ? (
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-8 rounded-full flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-blue-500/20">
                    <span className="w-2 h-2 bg-blue-300 rounded-full animate-ping"></span>
                    <span>
                        {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED 
                            ? 'Start Call' 
                            : 'Connecting...'}
                    </span>
                </button>
            ) : (
                <button className="bg-red-600 hover:bg-red-500 text-white font-medium py-3 px-8 rounded-full transition-all duration-200 shadow-lg hover:shadow-red-500/20">
                    End Call
                </button>
            )}
        </div>
    </div>
    )
}

export default Agent