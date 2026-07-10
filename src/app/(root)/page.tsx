import Link from "next/link";
import {
  ArrowRight,
  Mic,
  Play,
  Sparkles,
  Gauge,
  MessageSquareText,
  Check,
} from "lucide-react";

// A short, real interview exchange used as the hero's proof-of-product.
const exchange = [
  { who: "InterviewGPT", text: "Walk me through how you'd design a rate limiter for a public API." },
  { who: "You", text: "I'd start with a token-bucket per client key, stored in Redis so it holds up across instances…", live: true },
];

const steps = [
  {
    title: "Tell it the role",
    body: "Say the role and stack you're targeting. The assistant builds a question set around it — no forms to fill.",
  },
  {
    title: "Talk it through",
    body: "Answer out loud in a real back-and-forth, the same rhythm and pressure as the actual call.",
  },
  {
    title: "Get scored",
    body: "A breakdown for every answer: what landed, what to sharpen, and a confidence score you can track.",
  },
];

const features = [
  {
    icon: Mic,
    title: "A voice that listens back",
    body: "Natural, adaptive conversation that follows up on your answers instead of reading from a script.",
  },
  {
    icon: MessageSquareText,
    title: "Questions built for your role",
    body: "Tailored to your industry, level, and the exact stack in the job description — not generic trivia.",
  },
  {
    icon: Gauge,
    title: "Feedback per answer",
    body: "Specific notes on structure, depth, and clarity, so every practice run tells you where to go next.",
  },
];

const testimonials = [
  {
    quote:
      "Two weeks of practice and I walked into my SWE loop calm. The per-answer feedback was the part that actually moved the needle.",
    name: "Alex Chen",
    role: "Software Engineer",
  },
  {
    quote:
      "It adapts to what I say and pushes on the weak spots. Closest thing to a coach that's awake at 1am the night before.",
    name: "Sarah Johnson",
    role: "Product Manager",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero with ambient atmosphere */}
      <div className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="ambient-glow absolute -top-40 -left-32 h-[38rem] w-[38rem] rounded-full bg-[#7c6dff]/20 blur-[120px]" />
          <div className="ambient-glow absolute -top-24 right-0 h-[32rem] w-[32rem] rounded-full bg-[#cac5fe]/10 blur-[120px] [animation-delay:3s]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(124,109,255,0.12),transparent_60%)]" />
        </div>

        <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pt-10 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
          <div>
            <div className="animate-rise inline-flex items-center gap-2 rounded-full border border-[#cac5fe]/20 bg-[#cac5fe]/5 px-3.5 py-1.5 text-xs font-medium tracking-wide text-[#cac5fe]">
              <Sparkles className="h-3.5 w-3.5" />
              AI voice interviews
            </div>

            <h1
              className="animate-rise mt-6 font-[family-name:var(--font-display)] text-[2.75rem] font-semibold leading-[1.04] tracking-tight sm:text-6xl [animation-delay:60ms]"
            >
              Rehearse the interview
              <br />
              before it&apos;s{" "}
              <span className="bg-gradient-to-r from-[#cac5fe] via-[#b8b0ff] to-[#7c6dff] bg-clip-text text-transparent">
                real.
              </span>
            </h1>

            <p className="animate-rise mt-6 max-w-md text-lg leading-relaxed text-[#a9a6c4] [animation-delay:120ms]">
              InterviewGPT runs a live voice interview tuned to your role, then scores
              every answer and shows you exactly what to sharpen.
            </p>

            <div className="animate-rise mt-9 flex flex-wrap items-center gap-3 [animation-delay:180ms]">
              <Link
                href="/sign-in"
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[#cac5fe] to-[#7c6dff] px-6 py-3.5 font-semibold text-[#08070d] shadow-[0_8px_30px_-8px_rgba(124,109,255,0.7)] transition hover:brightness-110"
              >
                Start practicing free
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>

            <p className="animate-rise mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#7d7a99] [animation-delay:240ms]">
              {["No card required", "Runs in your browser", "Voice or text"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#49de50]" />
                  {t}
                </span>
              ))}
            </p>
          </div>

          {/* Live interview panel — the signature element */}
          <div className="animate-rise [animation-delay:200ms]">
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 shadow-2xl backdrop-blur-sm">
              {/* Panel header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#49de50]/70" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#49de50]" />
                  </span>
                  <span className="text-sm font-medium">Live · Full-stack Engineer</span>
                </div>
                <span className="text-xs text-[#7d7a99]">04:12</span>
              </div>

              {/* Waveform */}
              <div className="flex h-16 items-center justify-center gap-1 py-4">
                {[0.5, 0.8, 0.35, 1, 0.6, 0.9, 0.45, 0.75, 0.3, 0.85, 0.55, 0.95, 0.4, 0.7, 0.5].map(
                  (h, i) => (
                    <span
                      key={i}
                      className="wave-bar w-1 rounded-full bg-gradient-to-t from-[#7c6dff] to-[#cac5fe]"
                      style={{ height: `${h * 100}%`, animationDelay: `${i * 90}ms` }}
                    />
                  )
                )}
              </div>

              {/* Transcript */}
              <div className="space-y-3">
                {exchange.map((m, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.who === "You"
                        ? "ml-6 bg-[#cac5fe]/10 text-[#ece9ff]"
                        : "mr-6 bg-white/[0.04] text-[#c9c6de]"
                      }`}
                  >
                    <p className="mb-1 text-[0.7rem] font-medium uppercase tracking-wider text-[#7d7a99]">
                      {m.who}
                    </p>
                    <p>
                      {m.text}
                      {m.live && <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-[#cac5fe]" />}
                    </p>
                  </div>
                ))}
              </div>

              {/* Score chip */}
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#49de50]/20 bg-[#49de50]/[0.06] px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-[#c9c6de]">
                  <Gauge className="h-4 w-4 text-[#49de50]" />
                  Answer strength
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-[#49de50] to-[#cac5fe]" />
                  </div>
                  <span className="text-sm font-semibold text-[#49de50]">82</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* How it works — a real 3-step sequence */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-14 max-w-xl">
          <p className="text-sm font-medium tracking-wider text-[#cac5fe]">HOW IT WORKS</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
            From cold to interview-ready in three passes.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition hover:border-[#cac5fe]/30 hover:bg-white/[0.04]"
            >
              <span className="font-[family-name:var(--font-display)] text-4xl font-semibold text-white/10 transition group-hover:text-[#cac5fe]/40">
                0{i + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#a9a6c4]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-14 max-w-xl">
          <p className="text-sm font-medium tracking-wider text-[#cac5fe]">WHAT YOU GET</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
            Not a quiz. A conversation that pushes back.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-7"
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

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-14 max-w-xl">
          <p className="text-sm font-medium tracking-wider text-[#cac5fe]">FROM PEOPLE WHO GOT THE OFFER</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
            Practice, then walk in calm.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-8"
            >
              <blockquote className="text-lg leading-relaxed text-[#d7d4ec]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex-center h-10 w-10 rounded-full bg-gradient-to-br from-[#cac5fe] to-[#7c6dff] text-sm font-semibold text-[#08070d]">
                  {t.name[0]}
                </span>
                <div className="text-sm">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-[#7d7a99]">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-[#cac5fe]/20 bg-gradient-to-br from-[#171532] to-[#0d0b1a] px-8 py-16 text-center">
          <div aria-hidden className="ambient-glow absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[#7c6dff]/25 blur-[100px]" />
          <h2 className="relative font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
            Your next interview is coming.
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-[#a9a6c4]">
            Run a full practice interview in the next five minutes — for free.
          </p>
          <Link
            href="/sign-in"
            className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#cac5fe] to-[#7c6dff] px-7 py-3.5 font-semibold text-[#08070d] shadow-[0_8px_30px_-8px_rgba(124,109,255,0.7)] transition hover:brightness-110"
          >
            Start practicing free
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
