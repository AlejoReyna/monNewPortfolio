"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigation } from "@/contexts/navigation-context";
import { useLanguage } from "@/components/lang-context";

export default function NavbarV2() {
  const pathname  = usePathname();
  const { navigateToSection, currentSection } = useNavigation();
  const { language } = useLanguage();
  const isEs = language === "es";

  const [scrolled, setScrolled] = useState(false);
  const [hidden,   setHidden]   = useState(false);
  const navInk = "#ffffff";
  const navTag = "rgba(255,255,255,0.42)";

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 80 ? y > lastY : false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id: "home" | "about" | "services" | "projects" | "contact") => {
    navigateToSection(id);
  };

  const contactPillStyle: React.CSSProperties = {
    fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
    fontSize: "0.8rem",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#ffffff",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: 999,
    cursor: "pointer",
    padding: "10px 18px",
    transition: "border-color 0.2s, background 0.2s",
  };

  const navButtonStyle: React.CSSProperties = {
    fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
    fontSize: "0.76rem",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#ffffff",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 0",
  };

  return (
    <>
      <header
        className="nav-v2-shell"
        style={{
          position: "fixed",
          top: "0.5rem", left: 0, right: 0,
          zIndex: 50,
          transform: hidden ? "translateY(-110%)" : "translateY(0)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          background: "transparent",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          borderBottom: "1px solid transparent",
        }}
      >
        {/* ── Desktop ── */}
        <nav style={{
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(24px, 5vw, 64px)",
          height: 56,
        }}
          className="nav-desktop"
        >
          {/* Brand */}
          <Link
            href="/"
            onClick={() => handleNav("home")}
            style={{
              fontFamily: "var(--font-bebas, sans-serif)",
              fontSize: "1.25rem",
              letterSpacing: "0.08em",
              color: navInk,
              textDecoration: "none",
              lineHeight: 1,
            }}
          >
            <span style={{ color: navTag }}>&lt;</span>
            {" "}Alexis Reyna{" "}
            <span style={{ color: navTag }}>&gt;</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <button
              onClick={() => handleNav("projects")}
              style={navButtonStyle}
            >
              {isEs ? "Proyectos" : "Projects"}
            </button>
            <button
              onClick={() => handleNav("about")}
              style={navButtonStyle}
            >
              {isEs ? "Sobre mí" : "About me"}
            </button>
          </div>

          {/* CTA */}
          <button
            onClick={() => handleNav("contact")}
            className="nav-contact-pill"
            style={contactPillStyle}
          >
            {isEs ? "Hablemos →" : "Get in touch →"}
          </button>
        </nav>

        {/* ── Mobile bar ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: 52,
        }}
          className="nav-mobile"
        >
          <Link
            href="/"
            onClick={() => handleNav("home")}
            style={{
              fontFamily: "var(--font-bebas, sans-serif)",
              fontSize: "1.15rem",
              letterSpacing: "0.08em",
              color: navInk,
              textDecoration: "none",
              lineHeight: 1,
            }}
          >
            <span style={{ color: navTag }}>&lt;</span>
            {" "}Alexis Reyna{" "}
            <span style={{ color: navTag }}>&gt;</span>
          </Link>

          <button
            onClick={() => handleNav("contact")}
            className="nav-contact-pill"
            style={contactPillStyle}
          >
            {isEs ? "Hablemos →" : "Get in touch →"}
          </button>
        </div>
      </header>

      <style>{`
        .nav-v2-shell,
        .nav-v2-shell * {
          font-family: 'Comic Sans MS', 'Comic Sans', cursive !important;
        }

        .nav-contact-pill {
          animation: nav-contact-float 2.8s ease-in-out infinite;
        }

        .nav-contact-pill:hover {
          background: rgba(255,255,255,0.12) !important;
          border-color: rgba(255,255,255,0.38) !important;
        }

        @keyframes nav-contact-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @media (min-width: 640px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile  { display: none  !important; }
        }
      `}</style>
    </>
  );
}
