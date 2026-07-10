import { createGroq } from '@ai-sdk/groq';

export const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Model used as a fallback when the Gemini API key has expired or fails.
export const GROQ_FALLBACK_MODEL = 'llama-3.3-70b-versatile';
