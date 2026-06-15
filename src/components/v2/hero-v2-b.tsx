"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import ChatInterface from "@/components/chat-interface";

/* ═══════════════════════════════════════════════════════════════
   Hero V2-B — same layout, different character entrance:
   3-D perspective flip-in  →  ripple rings  →  pendulum sway
   ═══════════════════════════════════════════════════════════════ */
type HeroV2BProps = {
  embedInScrollSequence?: boolean;
  embedContentOpacity?: MotionValue<number>;
};

export default function HeroV2B({
  embedInScrollSequence,
  embedContentOpacity,
}: HeroV2BProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [characterEntered, setCharacterEntered] = useState(false);

  /* parallax / fade — identical to hero-v2 */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.5 });
  const embed = !!embedInScrollSequence;
  const bgY         = useTransform(smooth, [0, 1], embed ? ["0%",  "0%"]  : ["0%",  "22%"]);
  const contentY    = useTransform(smooth, [0, 1], embed ? ["0px", "0px"] : ["0px", "55px"]);
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

          {/* ── Right column: character asset — OPTION B ── */}
          {/* Outer: scroll opacity + scale, border + clip */}
          <motion.div
            className="hidden lg:block relative lg:ml-[15%] w-full h-full min-h-[min(88vh,780px)] overflow-visible pointer-events-none origin-top"
            style={{ opacity: gifOpacity, scale: gifScale }}
            aria-hidden
          >
            {/* Perspective shell — enables the 3-D rotateY */}
            <div
              className="absolute inset-0 rounded-lg border-2 border-white/40 overflow-hidden"
              style={{ perspective: "900px", perspectiveOrigin: "50% 45%" }}
            >
              {/* ── Entrance: 3-D flip-in from the left edge ── */}
              <motion.div
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
                initial={{ opacity: 0, scale: 0.82, rotateY: -24, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1,    rotateY: 0,   filter: "blur(0px)"  }}
                transition={{
                  rotateY: { type: "spring", stiffness: 58, damping: 14, mass: 1.25, delay: 0.45 },
                  scale:   { type: "spring", stiffness: 65, damping: 13, mass: 1.05, delay: 0.45 },
                  opacity: { duration: 0.55, ease: "easeOut", delay: 0.45 },
                  filter:  { duration: 0.8,  ease: "easeOut", delay: 0.45 },
                }}
                onAnimationComplete={() => setCharacterEntered(true)}
              >
                {/* ── Idle: pendulum sway pivoting at the character's feet ── */}
                <motion.div
                  className="absolute inset-0"
                  style={{ transformOrigin: "50% 100%" }}
                  animate={
                    characterEntered
                      ? { rotateZ: [0, 0.55, 0, -0.55, 0] }
                      : { rotateZ: 0 }
                  }
                  transition={
                    characterEntered
                      ? { duration: 7.5, repeat: Infinity, ease: "easeInOut" }
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

                {/* Entry blaze — full-card diagonal light wash that clears fast */}
                <motion.div
                  className="pointer-events-none absolute inset-0"
                  initial={{ opacity: 0.82 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.85, delay: 0.58, ease: [0.3, 0, 0.65, 1] }}
                  style={{
                    background:
                      "linear-gradient(130deg, rgba(200,225,255,0.52) 0%, rgba(255,255,255,0.32) 45%, rgba(170,210,255,0.44) 100%)",
                  }}
                />
              </motion.div>
            </div>

            {/* ── Ripple rings — expand outward from card center, overflow-visible ── */}
            {/* Ring 1 — tightest, fastest */}
            <motion.div
              className="pointer-events-none absolute rounded-lg"
              initial={{ top: "28%", left: "28%", right: "28%", bottom: "28%", opacity: 0.85 }}
              animate={{ top: "-10%", left: "-10%", right: "-10%", bottom: "-10%", opacity: 0 }}
              transition={{ duration: 1.05, delay: 0.62, ease: [0.18, 0, 0.48, 1] }}
              style={{ border: "1.5px solid rgba(140,200,255,0.7)" }}
            />
            {/* Ring 2 */}
            <motion.div
              className="pointer-events-none absolute rounded-lg"
              initial={{ top: "22%", left: "22%", right: "22%", bottom: "22%", opacity: 0.6 }}
              animate={{ top: "-18%", left: "-18%", right: "-18%", bottom: "-18%", opacity: 0 }}
              transition={{ duration: 1.25, delay: 0.76, ease: [0.18, 0, 0.48, 1] }}
              style={{ border: "1px solid rgba(120,180,255,0.45)" }}
            />
            {/* Ring 3 — widest, slowest */}
            <motion.div
              className="pointer-events-none absolute rounded-lg"
              initial={{ top: "16%", left: "16%", right: "16%", bottom: "16%", opacity: 0.38 }}
              animate={{ top: "-26%", left: "-26%", right: "-26%", bottom: "-26%", opacity: 0 }}
              transition={{ duration: 1.5, delay: 0.9, ease: [0.18, 0, 0.48, 1] }}
              style={{ border: "1px solid rgba(100,160,255,0.28)" }}
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
