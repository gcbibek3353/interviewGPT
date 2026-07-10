import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service · InterviewGPT",
  description: "The terms that govern your use of InterviewGPT.",
};

const sections = [
  {
    h: "1. Agreement to these terms",
    p: [
      "By creating an account or using InterviewGPT (the \"Service\"), you agree to these Terms of Service. If you do not agree, please do not use the Service.",
      "We may update these terms from time to time. When we make material changes, we'll update the date above and, where appropriate, notify you. Continuing to use the Service after changes take effect means you accept the revised terms.",
    ],
  },
  {
    h: "2. Your account",
    p: [
      "You're responsible for the activity that happens under your account and for keeping your login credentials secure. You must be at least 16 years old to use the Service.",
      "Please give accurate information when you sign up, and let us know promptly if you believe your account has been used without your permission.",
    ],
  },
  {
    h: "3. Acceptable use",
    p: [
      "InterviewGPT is for personal interview practice. You agree not to misuse the Service — including attempting to disrupt it, reverse-engineer it, resell access, or use it to generate unlawful, harmful, or abusive content.",
      "We may suspend or terminate accounts that violate these terms or put the Service or other users at risk.",
    ],
  },
  {
    h: "4. AI-generated content",
    p: [
      "The Service uses AI to generate questions and feedback. This output can be inaccurate or incomplete and is provided for practice only. It is not professional, legal, or career advice, and no outcome — including any job offer — is guaranteed.",
      "You are responsible for how you use the questions, feedback, and scores the Service produces.",
    ],
  },
  {
    h: "5. Your content",
    p: [
      "You keep ownership of the answers and transcripts you create. You grant us a limited license to process them solely to operate and improve the Service, as described in our Privacy Policy.",
    ],
  },
  {
    h: "6. Payment and cancellation",
    p: [
      "Paid plans are billed in advance on a recurring basis until cancelled. You can cancel anytime; your plan remains active through the end of the current billing period, and we don't provide prorated refunds except where required by law.",
    ],
  },
  {
    h: "7. Disclaimers and liability",
    p: [
      "The Service is provided \"as is\" without warranties of any kind. To the fullest extent permitted by law, InterviewGPT is not liable for indirect, incidental, or consequential damages arising from your use of the Service.",
    ],
  },
  {
    h: "8. Contact",
    p: [
      "Questions about these terms? Reach us at hello@interviewgpt.app and we'll be happy to help.",
    ],
  },
];

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-20 pb-12">
      <p className="text-sm font-medium tracking-wider text-[#cac5fe]">LEGAL</p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl">
        Terms of Service
      </h1>
      <p className="mt-4 text-sm text-[#7d7a99]">Last updated: July 10, 2026</p>

      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <div key={s.h}>
            <h2 className="text-lg font-semibold text-[#ece9ff]">{s.h}</h2>
            <div className="mt-3 space-y-3">
              {s.p.map((para, i) => (
                <p key={i} className="text-sm leading-relaxed text-[#a9a6c4]">
                  {para}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
