"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigation } from "@/contexts/navigation-context";
import { useLanguage } from "@/components/lang-context";

export default function NavbarV2() {
  const pathname = usePathname();
  const { navigateToSection, currentSection } = useNavigation();
  const { language, toggleWithFade } = useLanguage();
  const isEs = language === "es";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home" as const, label: isEs ? "Inicio" : "Home" },
    { id: "services" as const, label: isEs ? "Servicios" : "Services" },
    { id: "projects" as const, label: isEs ? "Proyectos" : "Work" },
    { id: "contact" as const, label: isEs ? "Contacto" : "Contact" },
  ];
  const navBeforeContact = navItems.filter((item) => item.id !== "contact" && item.id !== "home");
  const contactNav = navItems.find((item) => item.id === "contact")!;

  const handleNav = (id: "home" | "services" | "projects" | "contact") => {
    navigateToSection(id);
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      {/* ── Desktop pill nav ── */}
      <nav
        className="pointer-events-auto hidden sm:flex items-center justify-between px-4 py-2 w-full transition-all duration-300 relative"
        style={{
          background: "transparent",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          borderRadius: "0px",
          boxShadow: "none",
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center px-4 py-1.5 transition-colors duration-150"
          style={{
            fontFamily: "var(--gic-font-sans)",
            fontSize: "18px",
            fontWeight: 600,
            letterSpacing: "-0.012em",
            color: "var(--gic-canvas-white)",
          }}
        >
          Alexis Reyna
        </Link>

        {/* Centered nav items */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
          {navBeforeContact.map((item) => {
            const isActive = pathname === "/" && currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="relative px-4 py-1.5 transition-all duration-150"
                style={{
                  fontFamily: "var(--gic-font-sans)",
                  fontSize: "18px",
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: "-0.010em",
                  color: isActive
                    ? "var(--gic-canvas-white)"
                    : "rgba(255,255,255,0.82)",
                  backgroundColor: isActive
                    ? "rgba(255, 255, 255, 0.14)"
                    : "transparent",
                  borderRadius: "var(--gic-radius-nav)",
                  boxShadow: isActive
                    ? "rgba(0, 0, 0, 0.06) 0px 1px 2px 0px"
                    : "none",
                }}
              >
                {item.label}
              </button>
            );
          })}
          <Link
            href="/historia"
            className="relative px-4 py-1.5 transition-all duration-150"
            style={{
              fontFamily: "var(--gic-font-sans)",
              fontSize: "18px",
              fontWeight: pathname === "/historia" ? 500 : 400,
              letterSpacing: "-0.010em",
              color:
                pathname === "/historia"
                  ? "var(--gic-canvas-white)"
                  : "rgba(255,255,255,0.82)",
              backgroundColor:
                pathname === "/historia"
                  ? "rgba(255, 255, 255, 0.14)"
                  : "transparent",
              borderRadius: "var(--gic-radius-nav)",
              boxShadow:
                pathname === "/historia"
                  ? "rgba(0, 0, 0, 0.06) 0px 1px 2px 0px"
                  : "none",
            }}
          >
            {isEs ? "Historia" : "Story"}
          </Link>
          {(() => {
            const item = contactNav;
            const isActive = pathname === "/" && currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="relative px-4 py-1.5 transition-all duration-150"
                style={{
                  fontFamily: "var(--gic-font-sans)",
                  fontSize: "18px",
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: "-0.010em",
                  color: isActive
                    ? "var(--gic-canvas-white)"
                    : "rgba(255,255,255,0.82)",
                  backgroundColor: isActive
                    ? "rgba(255, 255, 255, 0.14)"
                    : "transparent",
                  borderRadius: "var(--gic-radius-nav)",
                  boxShadow: isActive
                    ? "rgba(0, 0, 0, 0.06) 0px 1px 2px 0px"
                    : "none",
                }}
              >
                {item.label}
              </button>
            );
          })()}
          <button
            onClick={() => toggleWithFade()}
            className="px-3 py-1.5 transition-colors duration-150"
            style={{
              fontFamily: "var(--gic-font-sans)",
              fontSize: "16px",
              fontWeight: 400,
              letterSpacing: "-0.013px",
              color: "rgba(255,255,255,0.82)",
            }}
            title={isEs ? "Switch to English" : "Cambiar a Español"}
          >
            {isEs ? "EN" : "ES"}
          </button>
        </div>

        {/* CTA */}
        <button
          onClick={() => handleNav("contact")}
          className="transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
          style={{
            background: "var(--gic-night-sky)",
            color: "var(--gic-canvas-white)",
            borderRadius: "var(--gic-radius-nav-items-small)",
            border: "1px solid var(--gic-rich-black)",
            fontFamily: "var(--gic-font-sans)",
            fontSize: "var(--gic-text-button-label)",
            fontWeight: 500,
            letterSpacing: "var(--gic-tracking-button-label)",
            padding: "7px 16px 8px 12px",
            lineHeight: 1,
          }}
        >
          {isEs ? "Hablemos" : "Get in touch"}
        </button>
      </nav>

      {/* ── Mobile compact bar ── */}
      <div
        className="pointer-events-auto flex sm:hidden items-center justify-between w-full px-4 py-2.5"
        style={{
          background: "transparent",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          borderRadius: "0px",
          boxShadow: "none",
        }}
      >
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          style={{
            fontFamily: "var(--gic-font-sans)",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "-0.012em",
            color: "var(--gic-dark-charcoal)",
          }}
        >
          Alexis Reyna
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNav("contact")}
            style={{
              background: "var(--gic-night-sky)",
              color: "var(--gic-canvas-white)",
              borderRadius: "var(--gic-radius-nav-items-small)",
              border: "1px solid var(--gic-rich-black)",
              fontFamily: "var(--gic-font-sans)",
              fontSize: "13px",
              fontWeight: 500,
              padding: "5px 12px",
            }}
          >
            {isEs ? "Contactar" : "Contact"}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            aria-label="Menu"
          >
            <span
              className="block h-px w-5 transition-all duration-200"
              style={{
                backgroundColor: "var(--gic-dark-charcoal)",
                transform: menuOpen ? "rotate(45deg) translateY(3.5px)" : "none",
              }}
            />
            <span
              className="block h-px w-5 transition-all duration-200"
              style={{
                backgroundColor: "var(--gic-dark-charcoal)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-px w-5 transition-all duration-200"
              style={{
                backgroundColor: "var(--gic-dark-charcoal)",
                transform: menuOpen ? "rotate(-45deg) translateY(-3.5px)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="pointer-events-auto absolute top-[68px] inset-x-4 sm:hidden overflow-hidden"
          style={{
            background: "rgba(249, 250, 247, 0.97)",
            backdropFilter: "blur(16px)",
            borderRadius: "16px",
            boxShadow: "rgba(0, 0, 0, 0.15) 0px 8px 24px 0px, rgb(222, 226, 222) 0px 0px 0px 1px",
          }}
        >
          {navBeforeContact.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="w-full text-left px-5 py-4 border-b transition-colors duration-100 hover:bg-white/60"
              style={{
                borderColor: "var(--gic-cool-gray)",
                fontFamily: "var(--gic-font-sans)",
                fontSize: "16px",
                fontWeight:
                  pathname === "/" && currentSection === item.id ? 500 : 400,
                color:
                  pathname === "/" && currentSection === item.id
                    ? "var(--gic-dark-charcoal)"
                    : "var(--gic-slate-gray)",
                letterSpacing: "-0.012em",
              }}
            >
              {item.label}
            </button>
          ))}
          <Link
            href="/historia"
            onClick={() => setMenuOpen(false)}
            className="block w-full text-left px-5 py-4 border-b transition-colors duration-100 hover:bg-white/60"
            style={{
              borderColor: "var(--gic-cool-gray)",
              fontFamily: "var(--gic-font-sans)",
              fontSize: "16px",
              fontWeight: pathname === "/historia" ? 500 : 400,
              color:
                pathname === "/historia"
                  ? "var(--gic-dark-charcoal)"
                  : "var(--gic-slate-gray)",
              letterSpacing: "-0.012em",
            }}
          >
            {isEs ? "Historia" : "Story"}
          </Link>
          <button
            onClick={() => handleNav("contact")}
            className="w-full text-left px-5 py-4 border-b last:border-b-0 transition-colors duration-100 hover:bg-white/60"
            style={{
              borderColor: "var(--gic-cool-gray)",
              fontFamily: "var(--gic-font-sans)",
              fontSize: "16px",
              fontWeight:
                pathname === "/" && currentSection === contactNav.id ? 500 : 400,
              color:
                pathname === "/" && currentSection === contactNav.id
                  ? "var(--gic-dark-charcoal)"
                  : "var(--gic-slate-gray)",
              letterSpacing: "-0.012em",
            }}
          >
            {contactNav.label}
          </button>
          <button
            onClick={() => toggleWithFade()}
            className="w-full text-left px-5 py-4 transition-colors duration-100 hover:bg-white/60"
            style={{
              fontFamily: "var(--gic-font-sans)",
              fontSize: "13px",
              fontWeight: 400,
              color: "var(--gic-medium-gray)",
              letterSpacing: "-0.013px",
            }}
          >
            {isEs ? "Switch to English" : "Cambiar a Español"}
          </button>
        </div>
      )}
    </header>
  );
}
