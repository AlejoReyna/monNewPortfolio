"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/lang-context";
import Link from "next/link";

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const isEs = language === 'es';
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
              <div className="flex items-center font-mono text-base font-bold tracking-tight">
                <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200">&lt;</span>
                <span className="mx-1 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-white group-hover:to-gray-100 transition-all duration-200">
                  Alexis Reyna
                </span>
                <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200">/&gt;</span>
              </div>
              {/* Optional: Cursor blink effect */}
              <div className="ml-1 inline-block h-4 w-0.5 bg-cyan-400 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-200"></div>
            </Link>
          </div>

          {/* Center: Nav links (desktop) */}
          <nav className="relative z-10 hidden items-center gap-1 sm:flex font-mono font-extralight">
            {[
              { href: "/", label: isEs ? "Inicio" : "Home" },
              { href: "#services", label: isEs ? "Servicios" : "Services" },
              { href: "#projects", label: isEs ? "Proyectos" : "Projects" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-sm text-gray-300 transition-colors hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 font-mono font-extralight"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: Language Selector + CTA + Mobile toggle */}
          <div className="relative z-10 flex items-center gap-2">
            {/* Language Selector */}
            <div className="hidden sm:flex items-center rounded-full border border-white/10 bg-black/20 px-1 py-0.5">
              <button
                onClick={toggleLanguage}
                className={`px-2 py-0.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-inner shadow-cyan-400/10'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                EN
              </button>
              <div className="w-px h-3 bg-white/20 mx-0.5" />
              <button
                onClick={toggleLanguage}
                className={`px-2 py-0.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  language === 'es'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-inner shadow-cyan-400/10'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                ES
              </button>
            </div>
            <a
              href="#contact"
              className="relative hidden sm:inline-flex items-center gap-2 rounded-full gradient-border bg-gradient-to-r from-slate-800/80 via-blue-900/60 to-violet-900/70 px-4 py-1.5 text-sm font-mono font-bold tracking-tight text-white shadow-inner shadow-cyan-400/10 transition-all hover:from-slate-700/90 hover:via-blue-800/70 hover:to-violet-800/80 hover:shadow-cyan-400/20 hover:scale-[1.02]"
            >
              <span>{isEs ? 'Hablemos' : 'Let’s talk'}</span>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* <button
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
            </button> */}
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
            {/* Language Selector for Mobile */}
            <div className="flex items-center justify-center rounded-full border border-white/10 bg-black/20 px-1 py-0.5 mb-2">
              <button
                onClick={toggleLanguage}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300'
                    : 'text-gray-400'
                }`}
              >
                EN
              </button>
              <div className="w-px h-3 bg-white/20 mx-1" />
              <button
                onClick={toggleLanguage}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                  language === 'es'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300'
                    : 'text-gray-400'
                }`}
              >
                ES
              </button>
            </div>
            <div className="h-px bg-white/10 mb-2" />
            {[
              { href: "/", label: isEs ? "Inicio" : "Home" },
              { href: "#services", label: isEs ? "Servicios" : "Services" },
              { href: "#projects", label: isEs ? "Proyectos" : "Projects" },
              { href: "#contact", label: isEs ? "Contacto" : "Contact" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm text-gray-200 transition-colors hover:bg-white/5 font-mono font-extralight"
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


