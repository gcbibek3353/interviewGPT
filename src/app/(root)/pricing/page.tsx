import Link from "next/link";
import type { Metadata } from "next";
import { Check, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing · InterviewGPT",
  description: "Start free. Upgrade when you're deep in interview season.",
};

const tiers = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "Enough to run real practice interviews and feel the difference.",
    cta: "Start free",
    href: "/sign-in",
    featured: false,
    features: [
      "3 voice interviews per month",
      "Role-tailored questions",
      "Per-answer feedback & score",
      "Saved transcripts",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "per month",
    blurb: "For an active job search — practice as often as you need.",
    cta: "Go Pro",
    href: "/sign-in",
    featured: true,
    features: [
      "Unlimited voice interviews",
      "Adaptive follow-up questions",
      "Focused drills on weak spots",
      "Progress tracking over time",
      "Priority AI response speed",
    ],
  },
  {
    name: "Team",
    price: "$49",
    cadence: "per month",
    blurb: "For bootcamps and career teams prepping candidates at scale.",
    cta: "Contact us",
    href: "/about",
    featured: false,
    features: [
      "Everything in Pro",
      "Up to 10 seats",
      "Shared question templates",
      "Cohort progress dashboard",
    ],
  },
];

const faqs = [
  {
    q: "Do I need a credit card to start?",
    a: "No. The Free plan is genuinely free and needs no card — you can run a full voice interview in minutes.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Pro and Team are month-to-month. Cancel whenever and you keep access through the end of the billing period.",
  },
  {
    q: "What counts as one interview?",
    a: "A single practice session end to end — from the first question to the scored feedback — regardless of how long it runs.",
  },
  {
    q: "Which roles are supported?",
    a: "Any role you can describe: software, data, product, design, and more. Questions adapt to the level and stack you give.",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-14 text-center">
        <p className="text-sm font-medium tracking-wider text-[#cac5fe]">PRICING</p>
        <h1 className="mx-auto mt-4 max-w-2xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Practice free. Upgrade when it counts.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-[#a9a6c4]">
          Start without a card. Move up when you&apos;re deep in interview season and want unlimited runs.
        </p>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl border p-8 ${
                t.featured
                  ? "border-[#cac5fe]/40 bg-gradient-to-b from-[#171532] to-[#0d0b1a]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-gradient-to-r from-[#cac5fe] to-[#7c6dff] px-3 py-1 text-xs font-semibold text-[#08070d]">
                  Most popular
                </span>
              )}
              <h2 className="text-lg font-semibold">{t.name}</h2>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-[family-name:var(--font-display)] text-4xl font-semibold">{t.price}</span>
                <span className="text-sm text-[#7d7a99]">/ {t.cadence}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#a9a6c4]">{t.blurb}</p>

              <Link
                href={t.href}
                className={`mt-6 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
                  t.featured
                    ? "bg-gradient-to-r from-[#cac5fe] to-[#7c6dff] text-[#08070d] shadow-[0_8px_30px_-8px_rgba(124,109,255,0.7)] hover:brightness-110"
                    : "border border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10"
                }`}
              >
                {t.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <ul className="mt-8 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#c9c6de]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#49de50]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
          Questions, answered.
        </h2>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((f) => (
            <div key={f.q} className="py-6">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#a9a6c4]">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
