"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigation } from "@/contexts/navigation-context";
import { useLanguage } from "@/components/lang-context";

/* ─── tech pill ─── */
function TechPill({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--gic-font-sans)",
        fontSize: "var(--gic-text-caption)",
        letterSpacing: "var(--gic-tracking-caption)",
        color: "rgba(255,255,255,0.45)",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: "var(--gic-radius-buttons)",
        padding: "3px 10px",
        lineHeight: "var(--gic-leading-caption)",
      }}
    >
      {label}
    </span>
  );
}

/* ═══════════════════════════════════
   Hero V2 — Night Sky / GIC style
   ═══════════════════════════════════ */
export default function HeroV2() {
  const heroRef = useRef<HTMLElement>(null);
  const { navigateToSection } = useNavigation();
  const { language } = useLanguage();
  const isEs = language === "es";

  /* parallax / fade */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.5 });
  const bgY = useTransform(smooth, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(smooth, [0, 1], ["0px", "55px"]);
  const contentOpacity = useTransform(smooth, [0, 0.65], [1, 0]);
  const gifOpacity = useTransform(smooth, [0, 0.55], [1, 0]);
  const gifScale = useTransform(smooth, [0, 1], [1, 0.93]);
  const arrowOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  /* entrance variants */
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  const tech = ["React", "Vue", "Next.js", "TypeScript", "Node.js", "Ruby", "AWS", "Figma"];

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{ backgroundColor: "var(--gic-night-sky)" }}
    >
      {/* ── Background image + parallax ── */}
      <motion.div
        className="absolute inset-0 z-0 scale-110"
        style={{ y: bgY }}
      >
        <Image
          src="/shadersmine.png"
          alt="Architectural night backdrop"
          fill
          priority
          className="object-cover"
          style={{ opacity: 0.28, mixBlendMode: "luminosity" }}
        />
        {/* Multi-layer vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(31,31,41,0.55) 0%, rgba(31,31,41,0.3) 40%, rgba(31,31,41,0.85) 100%)",
          }}
        />
      </motion.div>

      {/* ── Subtle grid pattern ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage:
            "radial-gradient(ellipse 70% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* ── Main content ── */}
      <motion.div
        className="relative z-10 w-full px-6 md:px-10 lg:px-16 pt-24 pb-28 flex flex-col"
        style={{
          y: contentY,
          opacity: contentOpacity,
          maxWidth: "var(--gic-max-width)",
          margin: "0 auto",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,min(540px,46vw))] gap-10 lg:gap-12 items-start lg:items-stretch w-full lg:min-h-[min(88vh,780px)]">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-8 lg:self-center">

            {/* Availability badge */}
            <motion.div {...fadeUp(0.1)}>
              <span
                className="inline-flex items-center gap-2"
                style={{
                  background: "rgba(222, 226, 222, 0.1)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "var(--gic-radius-cards-large)",
                  padding: "6px 14px",
                  fontFamily: "var(--gic-font-sans)",
                  fontSize: "var(--gic-text-caption)",
                  letterSpacing: "var(--gic-tracking-caption)",
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: "var(--gic-leading-caption)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#4ade80" }}
                />
                {isEs ? "Disponible para proyectos freelance" : "Available for freelance projects"}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 {...fadeUp(0.2)}>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--gic-font-serif)",
                  fontSize: "clamp(38px, 5.5vw, var(--gic-text-display))",
                  fontWeight: 400,
                  lineHeight: "var(--gic-leading-display)",
                  letterSpacing: "var(--gic-tracking-display)",
                  color: "var(--gic-canvas-white)",
                }}
              >
                {isEs ? "Diseñando sistemas," : "Designing systems,"}
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--gic-font-serif)",
                  fontSize: "clamp(38px, 5.5vw, var(--gic-text-display))",
                  fontWeight: 400,
                  lineHeight: "var(--gic-leading-display)",
                  letterSpacing: "var(--gic-tracking-display)",
                  color: "rgba(255,255,255,0.55)",
                  fontStyle: "italic",
                }}
              >
                {isEs ? "construyendo experiencias." : "building experiences."}
              </span>
            </motion.h1>

            {/* Sub-copy */}
            <motion.p {...fadeUp(0.32)}>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--gic-font-sans)",
                  fontSize: "var(--gic-text-subheading)",
                  lineHeight: "var(--gic-leading-subheading)",
                  letterSpacing: "var(--gic-tracking-subheading)",
                  color: "rgba(255,255,255,0.55)",
                  maxWidth: "480px",
                }}
              >
                {isEs
                  ? "Full Stack Developer en Inverater. Especializado en UX/UI y sistemas de diseño. Basado en Monterrey, México."
                  : "Full Stack Developer at Inverater. Specialized in UX/UI and design systems. Based in Monterrey, México."}
              </span>
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.44)} className="flex flex-wrap items-center gap-3">
              {/* Primary: white fill */}
              <button
                onClick={() => navigateToSection("projects")}
                className="transition-all duration-150 hover:opacity-90 active:scale-[0.97]"
                style={{
                  background: "var(--gic-canvas-white)",
                  color: "var(--gic-dark-charcoal)",
                  borderRadius: "var(--gic-radius-buttons)",
                  border: "none",
                  fontFamily: "var(--gic-font-sans)",
                  fontSize: "var(--gic-text-button-label)",
                  fontWeight: 500,
                  letterSpacing: "var(--gic-tracking-button-label)",
                  lineHeight: "var(--gic-leading-button-label)",
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                {isEs ? "Ver trabajo" : "View work"}
              </button>

              {/* Secondary: Outlined Action Button */}
              <button
                onClick={() => navigateToSection("contact")}
                className="transition-all duration-150 hover:border-[#41a1cf]/80 active:scale-[0.97]"
                style={{
                  background: "transparent",
                  color: "rgba(255,255,255,0.75)",
                  borderRadius: "var(--gic-radius-buttons)",
                  border: "1px solid var(--gic-action-azure)",
                  fontFamily: "var(--gic-font-sans)",
                  fontSize: "var(--gic-text-button-label)",
                  fontWeight: 400,
                  letterSpacing: "var(--gic-tracking-button-label)",
                  lineHeight: "var(--gic-leading-button-label)",
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                {isEs ? "Contactar" : "Get in touch"}
              </button>
            </motion.div>

            {/* Tech stack pills */}
            <motion.div {...fadeUp(0.56)} className="flex flex-wrap gap-2 pt-2">
              {tech.map((t) => (
                <TechPill key={t} label={t} />
              ))}
            </motion.div>
          </div>

          {/* ── Right column: GIF full height ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
            className="hidden lg:block relative w-full h-full min-h-[min(88vh,780px)] overflow-hidden pointer-events-none origin-top"
            style={{ opacity: gifOpacity, scale: gifScale }}
            aria-hidden
          >
            <Image
              src="/16.gif"
              alt=""
              fill
              priority
              unoptimized
              sizes="(min-width: 1024px) min(540px, 46vw), 0px"
              className="object-cover object-[right_top] scale-[1.2] origin-top-right translate-x-[clamp(12px,5vw,88px)]"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
        style={{ opacity: arrowOpacity }}
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className="-mt-2"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: "rgba(255,255,255,0.12)" }}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* ── Bottom fade to white ── */}
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--gic-night-sky))",
        }}
      />
    </section>
  );
}
