import Link from "next/link";
import { Mic } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/sign-in", label: "Start practicing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-6 pt-16 pb-10">
      <div className="grid gap-10 border-t border-white/10 pt-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex-center h-8 w-8 rounded-lg bg-gradient-to-br from-[#cac5fe] to-[#7c6dff] text-[#08070d]">
              <Mic className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="font-semibold">InterviewGPT</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-[#7d7a99]">
            A live voice interview that scores every answer and shows you exactly what to sharpen.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold text-[#c9c6de]">{col.title}</p>
            <ul className="mt-4 space-y-3 text-sm text-[#7d7a99]">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-12 text-sm text-[#5a5872]">
        © {new Date().getFullYear()} InterviewGPT. All rights reserved.
      </p>
    </footer>
  );
}
