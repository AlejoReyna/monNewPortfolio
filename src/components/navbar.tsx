"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? window.scrollY / total : 0;
      setProgress(Math.min(Math.max(p, 0), 1));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      {/* Top scroll progress bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400"
          style={{ width: `${progress * 100}%`, transition: "width 120ms linear" }}
        />
      </div>
      {/* Glass/gradient background matching hero */}
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-colors duration-300`}
      >
        <div
          className={
            `relative mt-5 sm:mt-6 lg:mt-8 flex items-center justify-between rounded-full border ` +
            `backdrop-blur-md px-4 py-2 sm:px-5 sm:py-2.5 ` +
            `transition-all duration-300 ` +
            (isScrolled
              ? `bg-black/50 border-white/15 shadow-2xl shadow-black/20`
              : `bg-black/30 border-white/10`)
          }
          style={{
            boxShadow: isScrolled ? "0 10px 40px rgba(0,0,0,0.35)" : undefined,
          }}
        >
          {/* Accent glow ring */}
          <div className="pointer-events-none absolute -inset-px rounded-full opacity-30 blur-md"
               style={{
                 background: "radial-gradient(1200px 80px at 50% -40px, rgba(148,163,184,0.25), transparent 60%)",
               }}
          />

          {/* Left: Brand */}
          <div className="relative z-10 flex min-w-0 items-center gap-2">
            <Link href="#top" className="group inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 group-hover:from-white group-hover:to-gray-400 transition-colors"></span>
              <span className="text-sm font-semibold tracking-wide text-white/90 group-hover:text-white shimmer-text">No logo yet</span>
            </Link>
          </div>

          {/* Center: Nav links (desktop) */}
          <nav className="relative z-10 hidden items-center gap-1 sm:flex">
            {[
              { href: "/", label: "Home" },
              { href: "#services", label: "Services" },
              { href: "#projects", label: "Projects" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-sm text-gray-300 transition-colors hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: CTA + Mobile toggle */}
          <div className="relative z-10 flex items-center gap-2">
            <a
              href="#contact"
              className="relative hidden sm:inline-flex items-center gap-2 rounded-full gradient-border bg-gradient-to-r from-slate-800/80 via-blue-900/60 to-violet-900/70 px-4 py-1.5 text-sm font-medium text-white shadow-inner shadow-cyan-400/10 transition-all hover:from-slate-700/90 hover:via-blue-800/70 hover:to-violet-800/80 hover:shadow-cyan-400/20 hover:scale-[1.02]"
            >
              <span>Let’s talk</span>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>

            <button
              aria-label="Toggle menu"
              onClick={() => setIsOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/30 p-2 text-gray-200 shadow-sm transition hover:bg-black/40 sm:hidden"
            >
              <svg
                className={`h-5 w-5 transition-transform ${isOpen ? "rotate-90" : "rotate-0"}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        <div
          className={
            `sm:hidden overflow-hidden transition-[max-height,opacity] duration-300 ` +
            (isOpen ? `max-h-64 opacity-100` : `max-h-0 opacity-0`)
          }
        >
          <div className="mx-2 mt-2 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-2">
            {[
              { href: "/", label: "Home" },
              { href: "#services", label: "Services" },
              { href: "#projects", label: "Projects" },
              { href: "#contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm text-gray-200 transition-colors hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle gradient separator line */}
      <div className="pointer-events-none absolute inset-x-0 top-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </header>
  );
}


