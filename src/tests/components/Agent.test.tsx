// import { render, fireEvent, screen } from '@testing-library/react'
// import Agent from '@/components/Agent'
// import { describe, it } from 'node:test'

import Agent from "@/components/Agent";
import { vapi } from "@/lib/vapi.sdk";
import { render } from "@testing-library/react";

// describe('Agent Component', () => {
//     it('should render in generate mode', () => {
//       const props = {
//         userName: 'Test User',
//         type: "generate",
//         userId: 'test-id'
//       }
//       render(<Agent {...props} />)
//       expect(screen.getByText(/Interview Generation/i)).toBeInTheDocument()
//     })
  
//     it('should render in interview mode', () => {
//       const props = {
//         userName: 'Test User',
//         type: 'interview',
//         interviewId: 'test-interview',
//         questions: ['Question 1', 'Question 2']
//       }
//       render(<Agent {...props} />)
//       expect(screen.getByText(/Interview Session/i)).toBeInTheDocument()
//     })
  
//     // Test voice interaction states
//     it('should handle call status changes', () => {
//       // Add tests for different call states
//     })
//   })


// describe("testing test integration",() => {
//     it('should return true',() => {
//         expect(2).toBe(2);
//     })
// })



// -------------------- Copilot generation begins here -----------------
describe('Agent Component - Call Status', () => {
    it('should update call status to ACTIVE on call-start event', () => {
        const props = {
            userName: 'Test User',
            userId: 'test-id',
            type: 'interview',
            interviewId: 'test-interview',
            questions: ['Question 1', 'Question 2']
        };

        render(<Agent {...props} />);

        // Simulate call-start event
        vapi.emit('call-start');
        expect(screen.getByText(/End Interview/i)).toBeInTheDocument();
    });

    it('should update call status to FINISHED on call-end event', () => {
        const props = {
            userName: 'Test User',
            userId: 'test-id',
            type: 'interview',
            interviewId: 'test-interview',
            questions: ['Question 1', 'Question 2']
        };

        render(<Agent {...props} />);

        // Simulate call-end event
        vapi.emit('call-end');
        expect(screen.getByText(/Start Interview/i)).toBeInTheDocument();
    });
});

describe('Agent Component - Message Handling', () => {
    it('should add a new message on receiving a final transcript', () => {
        const props = {
            userName: 'Test User',
            userId: 'test-id',
            type: 'interview',
            interviewId: 'test-interview',
            questions: ['Question 1', 'Question 2']
        };

        render(<Agent {...props} />);

        // Simulate message event
        const message = {
            type: 'transcript',
            transcriptType: 'final',
            role: 'user',
            transcript: 'This is a test message'
        };
        vapi.emit('message', message);

        expect(screen.getByText(/This is a test message/i)).toBeInTheDocument();
    });
});

describe('Agent Component - Speech Events', () => {
    it('should set isSpeaking to true on speech-start event', () => {
        const props = {
            userName: 'Test User',
            userId: 'test-id',
            type: 'interview',
            interviewId: 'test-interview',
            questions: ['Question 1', 'Question 2']
        };

        render(<Agent {...props} />);

        // Simulate speech-start event
        vapi.emit('speech-start');
        expect(screen.getByText(/Interviewer/i)).toHaveClass('animate-pulse');
    });

    it('should set isSpeaking to false on speech-end event', () => {
        const props = {
            userName: 'Test User',
            userId: 'test-id',
            type: 'interview',
            interviewId: 'test-interview',
            questions: ['Question 1', 'Question 2']
        };

        render(<Agent {...props} />);

        // Simulate speech-end event
        vapi.emit('speech-end');
        expect(screen.getByText(/Interviewer/i)).not.toHaveClass('animate-pulse');
    });
});