import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · InterviewGPT",
  description: "How InterviewGPT collects, uses, and protects your data.",
};

const sections = [
  {
    h: "1. Overview",
    p: [
      "This policy explains what we collect when you use InterviewGPT, why we collect it, and the choices you have. We aim to collect only what we need to run the Service well.",
    ],
  },
  {
    h: "2. Information we collect",
    p: [
      "Account information: your name and email when you sign up, including via Google sign-in.",
      "Practice data: the interview configurations you set, your spoken or typed answers, transcripts, and the feedback and scores generated for you.",
      "Usage data: basic technical information such as device, browser, and interaction events that help us keep the Service reliable.",
    ],
  },
  {
    h: "3. How we use your information",
    p: [
      "We use your data to run practice interviews, generate feedback, save your history, secure your account, and improve the Service. We do not sell your personal information.",
    ],
  },
  {
    h: "4. AI processing",
    p: [
      "To generate questions and feedback, your answers and prompts are processed by trusted AI providers acting on our behalf. We share only what's needed for that processing and require these providers to protect your data.",
    ],
  },
  {
    h: "5. Data retention",
    p: [
      "We keep your practice history for as long as your account is active so you can track your progress. You can delete individual sessions, or delete your account to remove your associated data, subject to limited legal retention requirements.",
    ],
  },
  {
    h: "6. Your rights and choices",
    p: [
      "Depending on where you live, you may have the right to access, correct, export, or delete your personal data. To make a request, contact us using the details below and we'll respond within a reasonable timeframe.",
    ],
  },
  {
    h: "7. Security",
    p: [
      "We use industry-standard safeguards to protect your data in transit and at rest. No system is perfectly secure, but we work to keep your information safe and to notify you if something goes wrong.",
    ],
  },
  {
    h: "8. Contact",
    p: [
      "Questions about your privacy? Email us at privacy@interviewgpt.app and we'll be glad to help.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-20 pb-12">
      <p className="text-sm font-medium tracking-wider text-[#cac5fe]">LEGAL</p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl">
        Privacy Policy
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
