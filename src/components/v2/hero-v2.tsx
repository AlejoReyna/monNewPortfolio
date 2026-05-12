"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import ChatInterface from "@/components/chat-interface";

/* ═══════════════════════════════════
   Hero V2 — Night Sky / GIC style
   ═══════════════════════════════════ */
type HeroV2Props = {
  /**
   * Inside `HeroCarouselSequence` the hero stays in a sticky frame; window-based
   * `useScroll` on this section mis-tracks, so inner fades/parallax hide content early.
   * Omit scroll-driven motion here — the parent sequence handles the reveal.
   */
  embedInScrollSequence?: boolean;
  /** When embedded, fades hero chrome (not the BG) during the carousel wipe. */
  embedContentOpacity?: MotionValue<number>;
};

export default function HeroV2({
  embedInScrollSequence,
  embedContentOpacity,
}: HeroV2Props) {
  const heroRef = useRef<HTMLElement>(null);

  /* parallax / fade */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.5 });
  const embed = !!embedInScrollSequence;
  const bgY = useTransform(smooth, [0, 1], embed ? ["0%", "0%"] : ["0%", "22%"]);
  const contentY = useTransform(smooth, [0, 1], embed ? ["0px", "0px"] : ["0px", "55px"]);
  const baseContentOpacity = useTransform(smooth, [0, 0.65], embed ? [1, 1] : [1, 0]);
  const baseGifOpacity = useTransform(smooth, [0, 0.55], embed ? [1, 1] : [1, 0]);

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
  const gifScale = useTransform(smooth, [0, 1], embed ? [1, 1] : [1, 0.93]);
  const arrowOpacity = useTransform(scrollYProgress, embed ? [0, 1] : [0, 0.08], embed ? [0, 0] : [1, 0]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen overflow-hidden flex"
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
        className="relative z-10 w-full h-screen px-6 md:px-10 lg:px-16 flex flex-col"
        style={{
          y: contentY,
          opacity: contentOpacity,
          maxWidth: "var(--gic-max-width)",
          margin: "0 auto",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(380px,min(640px,52vw))] gap-10 lg:gap-12 items-start lg:items-stretch w-full flex-1">

          {/* ── Left column: terminal uses 50% of column height ── */}
          <div className="w-full h-full min-h-[min(70vh,520px)] lg:min-h-[min(88vh,780px)] flex flex-col items-stretch justify-start">
            <ChatInterface
              variant="panel"
              className="lg:!w-[140%] lg:-ml-[10%] lg:translate-y-[30%] max-w-none h-[57.5%] min-h-0 shrink-0"
            />
          </div>

          {/* ── Right column: GIF full height ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
            className="hidden lg:block relative lg:ml-[15%] w-full h-full min-h-[min(88vh,700px)] pt-16 overflow-hidden pointer-events-none origin-top rounded-lg border-2 border-rose-400"
            style={{ opacity: gifOpacity, scale: gifScale }}
            aria-hidden
          >
            <Image
              src="/16.gif"
              alt=""
              fill
              priority
              unoptimized
              sizes="(min-width: 1400px) min(540px, 46vw), 0px"
              className="object-contain object-center"
            />
          </motion.div>
        </div>
      </motion.div>


    </section>
  );
}
