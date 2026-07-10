import Link from "next/link";
import { Mic } from "lucide-react";

const links = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#08070d]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex-center h-9 w-9 rounded-xl bg-gradient-to-br from-[#cac5fe] to-[#7c6dff] text-[#08070d]">
            <Mic className="h-4.5 w-4.5" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-semibold tracking-tight">InterviewGPT</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-[#a9a6c4] md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-white">
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="/sign-in"
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium transition hover:border-white/20 hover:bg-white/10"
        >
          Sign in
        </Link>
      </nav>
    </header>
  );
}
