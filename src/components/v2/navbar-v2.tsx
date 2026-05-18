"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigation } from "@/contexts/navigation-context";
import { useLanguage } from "@/components/lang-context";
import { motion, AnimatePresence } from "framer-motion";

export default function NavbarV2() {
  const pathname  = usePathname();
  const { navigateToSection, currentSection } = useNavigation();
  const { language, toggleWithFade } = useLanguage();
  const isEs = language === "es";

  const [scrolled, setScrolled] = useState(false);
  const [hidden,   setHidden]   = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const onAboutSection = pathname === "/" && currentSection === "about";
  const navInk = onAboutSection ? "#163342" : "#f8f5ea";
  const navMuted = onAboutSection ? "rgba(22,51,66,0.72)" : "rgba(248,245,234,0.55)";
  const navFaint = onAboutSection ? "rgba(22,51,66,0.48)" : "rgba(248,245,234,0.3)";
  const activeRule = onAboutSection ? "rgba(16,101,128,0.85)" : "rgba(200,168,74,0.85)";
  const showSolidNav = scrolled && !onAboutSection;

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

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navItems = [
    { id: "services" as const, en: "Services", es: "Servicios" },
    { id: "projects" as const, en: "Work",     es: "Proyectos" },
    { id: "contact"  as const, en: "Contact",  es: "Contacto"  },
  ];

  const handleNav = (id: "home" | "about" | "services" | "projects" | "contact") => {
    navigateToSection(id);
    setMenuOpen(false);
  };

  const isActive = (id: string) => pathname === "/" && currentSection === id;

  /* ── shared label style ── */
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
    fontSize: "0.76rem",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: navMuted,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 0",
    position: "relative",
    transition: "color 0.2s",
  };

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          transform: hidden ? "translateY(-110%)" : "translateY(0)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1), background 0.3s, border-color 0.3s",
          background: showSolidNav ? "rgba(8,8,10,0.92)" : "transparent",
          backdropFilter: showSolidNav ? "blur(12px)" : "none",
          WebkitBackdropFilter: showSolidNav ? "blur(12px)" : "none",
          borderBottom: showSolidNav ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
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
            Alexis Reyna
          </Link>

          {/* Center nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {navItems.map((item) => {
              const active = isActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  style={{
                    ...labelStyle,
                    color: active ? navInk : navMuted,
                  }}
                >
                  {isEs ? item.es : item.en}
                  {/* gold underline on active */}
                  <span style={{
                    position: "absolute",
                    bottom: 0, left: 0, right: 0,
                    height: 1,
                    background: activeRule,
                    transform: active ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
                    display: "block",
                  }} />
                </button>
              );
            })}

            <Link
              href="/historia"
              style={{
                ...labelStyle,
                color: pathname === "/historia" ? navInk : navMuted,
                textDecoration: "none",
              }}
            >
              {isEs ? "Historia" : "Story"}
              <span style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
	                height: 1, background: activeRule,
                transform: pathname === "/historia" ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
                display: "block",
              }} />
            </Link>

            {/* lang toggle */}
              <button
                onClick={() => toggleWithFade()}
                style={{
                  ...labelStyle,
	                  color: navFaint,
                  fontSize: "0.64rem",
                }}
              >
              {isEs ? "EN" : "ES"}
            </button>
          </div>

          {/* CTA */}
          <button
            onClick={() => handleNav("contact")}
            className="nav-contact-pill"
            style={{
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.8rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: onAboutSection ? "#163342" : "#ffffff",
              background: onAboutSection ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.07)",
              border: onAboutSection ? "1px solid rgba(22,51,66,0.28)" : "1px solid rgba(255,255,255,0.22)",
              borderRadius: 999,
              cursor: "pointer",
              padding: "10px 18px",
              boxShadow: "0 0 0 rgba(255,255,255,0)",
              transition: "color 0.2s, border-color 0.2s, background 0.2s, transform 0.2s",
            }}
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
            onClick={() => { handleNav("home"); setMenuOpen(false); }}
            style={{
              fontFamily: "var(--font-bebas, sans-serif)",
              fontSize: "1.15rem",
              letterSpacing: "0.08em",
              color: navInk,
              textDecoration: "none",
              lineHeight: 1,
            }}
          >
            Alexis Reyna
          </Link>

          {/* hamburger — three lines become X */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 8, display: "flex", flexDirection: "column",
              gap: 5, alignItems: "flex-end",
            }}
          >
            <span style={{
	              display: "block", height: 1, background: navInk,
              width: menuOpen ? 20 : 20,
              transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none",
              transformOrigin: "left",
              transition: "transform 0.25s ease",
            }} />
            <span style={{
	              display: "block", height: 1, background: navInk, width: 14,
              opacity: menuOpen ? 0 : 1,
              transition: "opacity 0.15s ease",
            }} />
            <span style={{
	              display: "block", height: 1, background: navInk, width: 20,
              transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none",
              transformOrigin: "left",
              transition: "transform 0.25s ease",
            }} />
          </button>
        </div>
      </header>

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed", inset: 0, zIndex: 49,
              background: "#08080a",
              display: "flex", flexDirection: "column",
              justifyContent: "center",
              padding: "80px 32px 48px",
            }}
          >
            {/* big nav items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    fontFamily: "var(--font-bebas, sans-serif)",
                    fontSize: "clamp(3.5rem, 15vw, 5.5rem)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.01em",
                    color: isActive(item.id) ? "rgba(200,168,74,0.9)" : "rgba(248,245,234,0.85)",
                    background: "none", border: "none", cursor: "pointer",
                    textAlign: "left", padding: "10px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    width: "100%",
                  }}
                >
                  {isEs ? item.es : item.en}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + navItems.length * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href="/historia"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-bebas, sans-serif)",
                    fontSize: "clamp(3.5rem, 15vw, 5.5rem)",
                    lineHeight: 0.95, letterSpacing: "-0.01em",
                    color: pathname === "/historia" ? "rgba(200,168,74,0.9)" : "rgba(248,245,234,0.85)",
                    textDecoration: "none",
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {isEs ? "Historia" : "Story"}
                </Link>
              </motion.div>
            </div>

            {/* bottom strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              style={{
                marginTop: "auto",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <button
                onClick={() => { toggleWithFade(); }}
                style={{
                  fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
                  fontSize: "0.64rem", letterSpacing: "0.22em",
                  textTransform: "uppercase", color: "rgba(248,245,234,0.28)",
                  background: "none", border: "none", cursor: "pointer",
                }}
              >
                {isEs ? "Switch to EN" : "Cambiar a ES"}
              </button>
              <button
                onClick={() => handleNav("contact")}
                className="nav-contact-pill"
                style={{
                  fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
                  fontSize: "0.8rem", letterSpacing: "0.22em",
                  textTransform: "uppercase", color: "#ffffff",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: 999,
                  cursor: "pointer",
                  padding: "10px 18px",
                  boxShadow: "0 0 0 rgba(255,255,255,0)",
                  transition: "color 0.2s, border-color 0.2s, background 0.2s, transform 0.2s",
                }}
              >
                {isEs ? "Hablemos →" : "Get in touch →"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-contact-pill {
          animation: nav-contact-thinking-text-pulse 5s ease-in-out infinite;
        }

        .nav-contact-pill:hover {
          background: rgba(255,255,255,0.12) !important;
          border-color: rgba(255,255,255,0.38) !important;
          transform: translateY(-1px);
        }

        @keyframes nav-contact-thinking-text-pulse {
          0%, 66%, 100% {
            color: #ffffff;
            text-shadow: 0 0 0 rgba(255,255,255,0), 0 0 0 rgba(87, 199, 255, 0);
          }
          76% {
            color: #ffffff;
            text-shadow: 0 0 9px rgba(255,255,255,0.72), 0 0 18px rgba(87, 199, 255, 0.46);
          }
          86% {
            color: rgba(255,255,255,0.92);
            text-shadow: 0 0 5px rgba(255,255,255,0.42), 0 0 12px rgba(87, 199, 255, 0.26);
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
