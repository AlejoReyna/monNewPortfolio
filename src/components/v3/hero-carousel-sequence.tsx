"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";
import HeroV2 from "@/components/v2/hero-v2";
import ProjectsCarousel from "@/components/v3/projects-carousel";
import "@/components/v3/v3.css";

/** * Increased runway to 600vh. 
 * This gives more "breathing room" so transitions don't feel rushed and 
 * the "stable" state feels intentional before the next section scrolls in.
 */
const SCROLL_RUNWAY_VH = 600;

const PHASE = {
  /** 0% - 25%: Pure Hero. ChatInterface is fully interactive. */
  heroOnlyUntil: 0.25,
  /** 25% - 65%: The Wipe. Carousel moves from bottom to top. */
  revealCompleteBy: 0.65,
  /** 65% - 0.90%: Stable Carousel. User can interact with Embla. */
  holdStableUntil: 0.90,
  /** 0.90% - 1.0%: Exit. The sticky container prepares to un-stick. */
} as const;

function ScrollHint({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
          fontSize: "0.55rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "rgba(237, 234, 224, 0.45)",
        }}
      >
        proyectos
      </span>
      <motion.svg
        width="20"
        height="12"
        viewBox="0 0 20 12"
        fill="none"
        animate={{ y: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      >
        <path
          d="M1 1L10 10L19 1"
          stroke="rgba(200,168,74,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
}

function RevealEdge({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(
    scrollYProgress,
    [
      PHASE.heroOnlyUntil - 0.05,
      PHASE.heroOnlyUntil + 0.05,
      PHASE.revealCompleteBy - 0.05,
      PHASE.revealCompleteBy,
    ],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      aria-hidden
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "1px",
        background: "var(--v3-gold, #c8a84a)",
        zIndex: 10,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

export default function HeroCarouselSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [carouselPointerEvents, setCarouselPointerEvents] = useState<"none" | "auto">("none");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Toggle pointer events slightly after the wipe starts to allow terminal interaction
  // even if the user has scrolled just a tiny bit.
  const syncCarouselPointerEvents = (v: number) => {
    const next = v >= PHASE.heroOnlyUntil + 0.05 ? "auto" : "none";
    setCarouselPointerEvents((prev) => (prev === next ? prev : next));
  };

  useLayoutEffect(() => {
    syncCarouselPointerEvents(scrollYProgress.get());
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", syncCarouselPointerEvents);

  /* ── Transforms ── */
  
  // Hero stays static until the carousel begins to overlap, then subtly scales down
  const heroScale = useTransform(
    scrollYProgress,
    [PHASE.heroOnlyUntil, PHASE.revealCompleteBy],
    [1, 0.97]
  );

  // The "Curtain" effect
  const carouselClip = useTransform(
    scrollYProgress,
    [PHASE.heroOnlyUntil, PHASE.revealCompleteBy],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]
  );

  const hintOpacity = useTransform(
    scrollYProgress,
    [0, PHASE.heroOnlyUntil * 0.5],
    [1, 0]
  );

  return (
    <div 
      ref={containerRef} 
      style={{ height: `${SCROLL_RUNWAY_VH}vh`, position: "relative" }}
      className="bg-black" // Ensures no light leaks from behind during the sticky phase
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          overflow: "hidden",
        }}
      >
        {/* Layer 1: Hero — Underlying content */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            scale: heroScale,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          <HeroV2 embedInScrollSequence />
        </motion.div>

        {/* Layer 2: Carousel — The Overlaying Curtain */}
        <motion.div
          className="v3-root"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            clipPath: carouselClip,
            pointerEvents: carouselPointerEvents,
            willChange: "clip-path",
            // CRITICAL: Solid background prevents Services section from showing 
            // through the carousel during the sticky handoff.
            backgroundColor: "var(--v3-bg, #09090b)", 
          }}
        >
          <div className="flex flex-col justify-center h-full w-full overflow-hidden">
            <ProjectsCarousel />
          </div>
        </motion.div>

        <RevealEdge scrollYProgress={scrollYProgress} />

        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        >
          <ScrollHint opacity={hintOpacity} />
        </div>
      </div>
    </div>
  );
}