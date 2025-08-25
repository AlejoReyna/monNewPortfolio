"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/lang-context";
import { useNavigation } from "@/contexts/navigation-context";


export default function Navbar() {
  const { language } = useLanguage();
  const { navigateToSection, currentSection } = useNavigation();
  const isEs = language === 'es';
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[60]">
      {/* Glass/gradient background matching hero */}
      {/* Gutter igual al chat; sin padding derecho */}
      <div className="w-full site-gutter transition-colors duration-300">
        <div
          className={
            `relative w-full flex items-center justify-between border-b ` +
            `px-4 sm:px-5 h-16 sm:h-20 ` +
            `transition-all duration-300 ` +
            (isScrolled
              ? `bg-black/70 border-white/15`
              : `bg-black/50 border-white/10`)
          }
        >
          {/* Left: Brand */}
          <div className="relative z-10 flex min-w-0 items-center gap-2 h-full">
            <button 
              onClick={() => navigateToSection("home")}
              className="group inline-flex items-center gap-2 h-full"
            >
              {/* Logo Text */}
              <div className="flex flex-col items-start">
                <div className="text-lg tracking-tight text-left">
                  <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-white group-hover:to-gray-100 transition-all duration-200 font-mono font-light">
                    Alexis Reyna
                  </span>
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-tight font-mono font-light text-left">
                  Full-Stack Developer
                </div>
              </div>
            </button>
          </div>

          {/* Center: Nav links (desktop) */}
          <nav className="relative z-10 hidden items-center gap-4 sm:flex font-mono font-light h-full">
            {[
              { section: "home", label: isEs ? "Inicio" : "Home" },
              { section: "services", label: isEs ? "Servicios" : "Services" },
              { section: "projects", label: isEs ? "Proyectos" : "Projects" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigateToSection(item.section as "home" | "services" | "projects" | "contact")}
                className={`px-3 py-2 text-sm transition-colors border-b-2 font-mono font-light ${
                  currentSection === item.section
                    ? "text-white border-white/30"
                    : "text-gray-300 hover:text-white border-transparent hover:border-white/20"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right: CTA + Mobile toggle */}
          <div className="relative z-10 flex items-center gap-2 h-full">
            <button
              onClick={() => navigateToSection("contact")}
              className="relative hidden sm:inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/50 px-4 py-2 text-sm font-mono font-semibold tracking-tight text-white shadow-lg shadow-black/20 transition-all hover:bg-black/60 hover:border-white/20"
            >
              <span>{isEs ? 'Hablemos' : "Let's talk"}</span>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              aria-label="Toggle menu"
              onClick={() => setIsOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/30 p-2 text-gray-200 shadow-sm hover:bg-black/40 sm:hidden"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
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
              { section: "home", label: isEs ? "Inicio" : "Home" },
              { section: "services", label: isEs ? "Servicios" : "Services" },
              { section: "projects", label: isEs ? "Proyectos" : "Projects" },
              { section: "contact", label: isEs ? "Contacto" : "Contact" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigateToSection(item.section as "home" | "services" | "projects" | "contact");
                  setIsOpen(false);
                }}
                className={`block w-full text-left rounded-xl px-3 py-2 text-sm transition-colors font-mono font-extralight ${
                  currentSection === item.section
                    ? "text-white bg-white/10"
                    : "text-gray-200 hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle gradient separator line */}
      <div className="pointer-events-none absolute inset-x-0 top-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </header>
  );
}