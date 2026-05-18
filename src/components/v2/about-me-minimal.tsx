"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import aboutBackground from "@/app/background.webp";

export default function AboutMeMinimal() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(sectionRef, { amount: 0.28, margin: "-8% 0px -8% 0px" });
  const contentHiddenY = shouldReduceMotion ? 0 : 34;
  const photoHiddenY = shouldReduceMotion ? 0 : 28;
  const bgVisibleOpacity = 1;

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        background: "transparent",
        display: "flex",
        alignItems: "center",
      }}
    >
      <motion.div
        aria-hidden
        initial={false}
        animate={{
          opacity: isInView ? bgVisibleOpacity : 0,
          scale: isInView || shouldReduceMotion ? 1 : 1.04,
        }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: `url(${aboutBackground.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transformOrigin: "center",
        }}
      />

      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "rgba(0,0,0,0.22)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(1280px, calc(100% - 48px))",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "60% 40%",
          gap: "clamp(32px, 5vw, 80px)",
          alignItems: "center",
        }}
        className="about-layout"
      >
        {/* ── Left: text content ── */}
        <motion.div
          initial={false}
          animate={{
            opacity: isInView ? 1 : 0,
            y: isInView ? 0 : contentHiddenY,
          }}
          transition={{
            duration: shouldReduceMotion ? 0.01 : 0.75,
            delay: isInView && !shouldReduceMotion ? 0.55 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p
            style={{
              margin: "0 0 26px",
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(200,168,74,0.82)",
            }}
          >
            About Alexis
          </p>

          <h2
            style={{
              maxWidth: 680,
              margin: 0,
              fontFamily: "var(--font-bebas, var(--gic-font-sans))",
              fontSize: "clamp(3.2rem, 7vw, 7rem)",
              lineHeight: 0.9,
              letterSpacing: "0",
              color: "#f8f5ea",
              textTransform: "uppercase",
              textShadow: "0 2px 18px rgba(0,0,0,0.24)",
            }}
          >
            I design quiet systems that feel fast, clear and alive.
          </h2>

          <div
            style={{
              marginTop: "clamp(28px, 5vw, 60px)",
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(180px, 300px)",
              gap: "clamp(24px, 5vw, 64px)",
              alignItems: "end",
            }}
            className="about-minimal-grid"
          >
            <p
              style={{
                maxWidth: 520,
                margin: 0,
                fontFamily: "var(--gic-font-sans)",
                fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
                lineHeight: 1.75,
                color: "rgba(248,245,234,0.78)",
                textShadow: "0 1px 10px rgba(0,0,0,0.28)",
              }}
            >
              I build web products, experiments and automation with a bias for
              interfaces that explain themselves. My work moves between frontend
              polish, Web3 prototypes, tiny scripts and playful portfolio systems.
            </p>

            <div
              style={{
                display: "grid",
                gap: 12,
                fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(248,245,234,0.8)",
              }}
            >
              {["Next.js / React", "TypeScript", "Web3 experiments", "Automation"].map((item, index) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    borderBottom: "1px solid rgba(255,255,255,0.16)",
                    paddingBottom: 12,
                  }}
                >
                  <span style={{ color: "rgba(200,168,74,0.72)" }}>0{index + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Right: photo / placeholder ── */}
        <motion.div
          initial={false}
          animate={{
            opacity: isInView ? 1 : 0,
            y: isInView ? 0 : photoHiddenY,
          }}
          transition={{
            duration: shouldReduceMotion ? 0.01 : 0.75,
            delay: isInView && !shouldReduceMotion ? 0.72 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "3 / 4",
            borderRadius: "4px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Drop your photo here — replace this placeholder */}
          <span
            style={{
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(200,168,74,0.42)",
            }}
          >
            your photo
          </span>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .about-layout {
            grid-template-columns: 1fr !important;
          }
          .about-minimal-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
