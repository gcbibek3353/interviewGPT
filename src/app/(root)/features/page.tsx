import Link from "next/link";
import type { Metadata } from "next";
import {
  Mic,
  MessageSquareText,
  Gauge,
  Target,
  History,
  Repeat2,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features · InterviewGPT",
  description:
    "A live voice interview tuned to your role, with adaptive follow-ups and per-answer feedback.",
};

const features = [
  {
    icon: Mic,
    title: "A voice that listens back",
    body: "Speak your answers out loud. The assistant holds a natural conversation, complete with pacing and pressure — not a form you type into.",
  },
  {
    icon: Repeat2,
    title: "Follow-ups that dig in",
    body: "Give a shallow answer and it probes deeper, exactly like a real interviewer. You practice thinking on your feet, not reciting.",
  },
  {
    icon: MessageSquareText,
    title: "Questions built for your role",
    body: "Tuned to your industry, level, and the exact stack in the job description. Frontend, backend, PM, data — the set fits the seat.",
  },
  {
    icon: Gauge,
    title: "Feedback per answer",
    body: "After each answer, get specific notes on structure, depth, and clarity — and a confidence score so you know where you stand.",
  },
  {
    icon: Target,
    title: "Focus on weak spots",
    body: "System design, behavioural, DSA, or a topic you keep fumbling — point practice at it and drill until it's solid.",
  },
  {
    icon: History,
    title: "Track every run",
    body: "Every session is saved with its transcript and score, so you can watch your answers get sharper in the weeks before the loop.",
  },
];

const formats = [
  { label: "Technical", desc: "Coding, system design, and role-specific depth." },
  { label: "Behavioural", desc: "STAR-style stories, conflict, and leadership." },
  { label: "Mixed", desc: "The realistic blend most real loops actually run." },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Header */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-14 text-center">
        <p className="text-sm font-medium tracking-wider text-[#cac5fe]">FEATURES</p>
        <h1 className="mx-auto mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Everything you need to walk in ready.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-[#a9a6c4]">
          A practice interview that behaves like the real thing — adaptive, spoken, and honest about how you did.
        </p>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-7 transition hover:border-[#cac5fe]/25"
            >
              <span className="flex-center h-11 w-11 rounded-xl bg-[#cac5fe]/10 text-[#cac5fe]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#a9a6c4]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formats */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl">
            Practice the interview you&apos;re actually walking into.
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {formats.map((f) => (
              <div key={f.label} className="rounded-2xl border border-white/10 bg-[#08070d]/60 p-6">
                <p className="text-lg font-semibold text-[#cac5fe]">{f.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#a9a6c4]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-8 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
          Try it on your next role.
        </h2>
        <Link
          href="/sign-in"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#cac5fe] to-[#7c6dff] px-7 py-3.5 font-semibold text-[#08070d] shadow-[0_8px_30px_-8px_rgba(124,109,255,0.7)] transition hover:brightness-110"
        >
          Start practicing free
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </section>
    </>
  );
}
