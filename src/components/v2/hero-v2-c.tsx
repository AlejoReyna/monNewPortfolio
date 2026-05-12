"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import ChatInterface from "@/components/chat-interface";

/* ═══════════════════════════════════════════════════════════════
   Hero V2-C — border-draw reveal:
   SVG rect strokes in clockwise  →  character fades inside  →
   diagonal shine sweep  →  gentle float
   ═══════════════════════════════════════════════════════════════ */
type HeroV2CProps = {
  embedInScrollSequence?: boolean;
  embedContentOpacity?: MotionValue<number>;
};

export default function HeroV2C({
  embedInScrollSequence,
  embedContentOpacity,
}: HeroV2CProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [characterEntered, setCharacterEntered] = useState(false);

  /* parallax / fade — identical to hero-v2 */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.5 });
  const embed = !!embedInScrollSequence;
  const bgY      = useTransform(smooth, [0, 1], embed ? ["0%",  "0%"]  : ["0%",  "22%"]);
  const contentY = useTransform(smooth, [0, 1], embed ? ["0px", "0px"] : ["0px", "55px"]);
  const baseContentOpacity = useTransform(smooth, [0, 0.65], embed ? [1, 1] : [1, 0]);
  const baseGifOpacity     = useTransform(smooth, [0, 0.55], embed ? [1, 1] : [1, 0]);

  const contentOpacity =
    embed && embedContentOpacity
      ? useTransform(
          [baseContentOpacity, embedContentOpacity],
          ([a, b]) => (Number(a) || 1) * (Number(b) || 1)
        )
      : baseContentOpacity;
  const gifOpacity =
    embed && embedContentOpacity
      ? useTransform(
          [baseGifOpacity, embedContentOpacity],
          ([a, b]) => (Number(a) || 1) * (Number(b) || 1)
        )
      : baseGifOpacity;
  const gifScale  = useTransform(smooth, [0, 1], embed ? [1, 1] : [1, 0.93]);
  const arrowOpacity = useTransform(
    scrollYProgress,
    embed ? [0, 1] : [0, 0.08],
    embed ? [0, 0] : [1, 0]
  );

  /* Draw-reveal timing */
  const DRAW_DELAY    = 0.35;
  const DRAW_DURATION = 1.6;

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{ backgroundColor: "var(--gic-night-sky)" }}
    >
      {/* ── Background image + parallax ── */}
      <motion.div className="absolute inset-0 z-0 scale-110" style={{ y: bgY }}>
        <Image
          src="/shadersmine.png"
          alt="Architectural night backdrop"
          fill
          priority
          className="object-cover"
          style={{ opacity: 0.28, mixBlendMode: "luminosity" }}
        />
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
        className="relative z-10 w-full px-6 md:px-10 lg:px-16 pt-24 pb-36 flex flex-col"
        style={{
          y: contentY,
          opacity: contentOpacity,
          maxWidth: "var(--gic-max-width)",
          margin: "0 auto",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,min(540px,46vw))] gap-10 lg:gap-12 items-start lg:items-stretch w-full lg:min-h-[min(88vh,780px)]">

          {/* ── Left column ── */}
          <div className="w-full h-full min-h-[min(70vh,520px)] lg:min-h-[min(88vh,780px)] flex flex-col items-stretch justify-start">
            <ChatInterface
              variant="panel"
              className="lg:!w-[140%] lg:-ml-[10%] lg:translate-y-[30%] max-w-none h-[57.5%] min-h-0 shrink-0"
            />
          </div>

          {/* ── Right column: character asset — OPTION C (draw reveal) ── */}
          <motion.div
            className="hidden lg:block relative lg:ml-[15%] w-full h-full min-h-[min(88vh,780px)] pointer-events-none origin-top"
            style={{ opacity: gifOpacity, scale: gifScale }}
            aria-hidden
          >
            {/*
              Clip-path sweeps top→bottom: inset(0 0 100% 0) → inset(0 0 0% 0).
              The character is revealed as if being painted onto the screen
              by a downward stroke. The scan line div tracks the live edge.
            */}
            <motion.div
              className="absolute inset-0"
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              transition={{
                duration: DRAW_DURATION,
                delay: DRAW_DELAY,
                ease: [0.4, 0, 0.15, 1],
              }}
              onAnimationComplete={() => setCharacterEntered(true)}
            >
              {/* Idle float — starts once drawing is complete */}
              <motion.div
                className="absolute inset-0"
                animate={characterEntered ? { y: [0, -14, 0] } : { y: 0 }}
                transition={
                  characterEntered
                    ? { duration: 4.4, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
                    : {}
                }
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
            </motion.div>

            {/* Scan line — rides the bottom edge of the clip reveal */}
            <motion.div
              className="pointer-events-none absolute inset-x-0"
              style={{ height: "3px" }}
              initial={{ top: "0%", opacity: 0 }}
              animate={{
                top:     ["0%", "100%", "100%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: DRAW_DURATION,
                delay: DRAW_DELAY,
                ease: [0.4, 0, 0.15, 1],
                times: [0, 0.92, 1],
              }}
            >
              {/* Sharp bright core */}
              <div
                className="absolute inset-x-0"
                style={{
                  top: "-1px",
                  height: "2px",
                  background: "rgba(220, 240, 255, 0.95)",
                }}
              />
              {/* Soft glow halo above the line */}
              <div
                className="absolute inset-x-0"
                style={{
                  bottom: "1px",
                  height: "18px",
                  background:
                    "linear-gradient(to top, rgba(160,210,255,0.35), transparent)",
                  filter: "blur(3px)",
                }}
              />
            </motion.div>
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: "rgba(255,255,255,0.25)" }}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className="-mt-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: "rgba(255,255,255,0.12)" }}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>

      {/* ── Bottom fade ── */}
      {embedContentOpacity ? (
        <motion.div
          className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-10"
          style={{
            opacity: embedContentOpacity,
            background: "linear-gradient(to bottom, transparent, var(--gic-night-sky))",
          }}
        />
      ) : (
        <div
          className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-10"
          style={{ background: "linear-gradient(to bottom, transparent, var(--gic-night-sky))" }}
        />
      )}
    </section>
  );
}
