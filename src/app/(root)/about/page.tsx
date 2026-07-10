import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Heart, Sparkles, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About · InterviewGPT",
  description: "Why we built a practice interview that talks back — and what we believe about preparation.",
};

const stats = [
  { value: "40k+", label: "Practice interviews run" },
  { value: "120+", label: "Roles supported" },
  { value: "24/7", label: "Always available" },
];

const values = [
  {
    icon: Sparkles,
    title: "Practice beats luck",
    body: "Interviews reward reps, not raw talent. We make the reps cheap, private, and available the night before.",
  },
  {
    icon: Heart,
    title: "Honest feedback, kindly given",
    body: "You can't fix what nobody names. We tell you what missed — clearly — and exactly how to make it land next time.",
  },
  {
    icon: Shield,
    title: "Your practice is yours",
    body: "Rehearsals should feel safe. Your transcripts stay private, and we never share your sessions with anyone.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-14 text-center">
        <p className="text-sm font-medium tracking-wider text-[#cac5fe]">ABOUT</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          The interview shouldn&apos;t be the first time you say it out loud.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-[#a9a6c4]">
          We built InterviewGPT because knowing the answer and being able to say it under pressure are two different skills — and only one of them shows up on the day.
        </p>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="space-y-5 text-[#c9c6de] leading-relaxed">
          <p>
            Most people prepare for interviews by reading. They skim question lists, nod along, and feel ready — until the room goes quiet and it&apos;s their turn to talk. The gap between recognizing an answer and delivering one is where good candidates lose offers.
          </p>
          <p>
            So we made something closer to the real thing: a voice assistant that asks, listens, follows up when you&apos;re vague, and then tells you how the answer actually landed. No scheduling a mock with a friend, no waiting for feedback. Just reps, on demand, until walking in feels routine.
          </p>
          <p>
            Whether you&apos;re a new grad facing your first loop or a senior engineer switching stacks, the goal is the same — make the real interview feel like one you&apos;ve already had.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:grid-cols-3 sm:p-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[#cac5fe]">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-[#a9a6c4]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-10 text-center font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
          What we believe.
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
              <span className="flex-center h-11 w-11 rounded-xl bg-[#cac5fe]/10 text-[#cac5fe]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#a9a6c4]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
          Come practice with us.
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
