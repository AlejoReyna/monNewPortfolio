"use client";

import { useCallback, useRef, useState, type TouchEvent, type WheelEvent } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import HeroV2 from "@/components/v2/hero-v2";
import ProjectsCarousel from "@/components/v3/projects-carousel";
import "@/components/v3/v3.css";

/* ═══════════════════════════════════════════════════════════════════════════
   HeroCarouselSequence — Hero-to-projects curtain reveal
   ═══════════════════════════════════════════════════════════════════════════ */

const PHASE = {
  /** 0% - 25%: Pure Hero. ChatInterface is fully interactive. */
  heroOnlyUntil: 0.25,
  /** 25% - 65%: The carousel wipes up over the hero. */
  revealCompleteBy: 0.65,
  /** 65% - 90%: Stable carousel. User can interact with Embla. */
  holdStableUntil: 0.90,
} as const;

const WHEEL_THRESHOLD = 16;
const SWIPE_THRESHOLD = 36;

function RevealEdge({ revealProgress }: { revealProgress: MotionValue<number> }) {
  const opacity = useTransform(
    revealProgress,
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
  const revealProgress = useMotionValue(0);
  const isAnimatingRef = useRef(false);
  const isRevealedRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const [carouselPointerEvents, setCarouselPointerEvents] = useState<"none" | "auto">("none");

  useMotionValueEvent(revealProgress, "change", (latest) => {
    const next = latest >= 0.98 ? "auto" : "none";
    setCarouselPointerEvents((prev) => (prev === next ? prev : next));
  });

  const animateReveal = useCallback(
    (next: 0 | 1) => {
      if (isAnimatingRef.current || Number(isRevealedRef.current) === next) return;

      isAnimatingRef.current = true;
      setCarouselPointerEvents("none");

      animate(revealProgress, next, {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          isRevealedRef.current = next === 1;
          isAnimatingRef.current = false;
          setCarouselPointerEvents(next === 1 ? "auto" : "none");
        },
      });
    },
    [revealProgress]
  );

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

      if (event.deltaY > 0) {
        animateReveal(1);
      } else {
        animateReveal(0);
      }
    },
    [animateReveal]
  );

  const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const startY = touchStartYRef.current;
      touchStartYRef.current = null;
      if (startY === null) return;

      const endY = event.changedTouches[0]?.clientY;
      if (endY === undefined) return;

      const deltaY = startY - endY;
      if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;

      if (deltaY > 0) {
        animateReveal(1);
      } else {
        animateReveal(0);
      }
    },
    [animateReveal]
  );

  const heroForegroundOpacity = useTransform(
    revealProgress,
    [PHASE.heroOnlyUntil, PHASE.heroOnlyUntil + (PHASE.revealCompleteBy - PHASE.heroOnlyUntil) * 0.85],
    [1, 0]
  );

  const carouselClip = useTransform(
    revealProgress,
    [PHASE.heroOnlyUntil, PHASE.revealCompleteBy],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]
  );

  const carouselBackdropOpacity = useTransform(
    revealProgress,
    [PHASE.heroOnlyUntil, PHASE.revealCompleteBy],
    [0, 1]
  );

  const hintOpacity = useTransform(
    revealProgress,
    [0, PHASE.heroOnlyUntil - 0.04],
    [1, 0]
  );

  return (
    <div
      ref={containerRef}
      id="work"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ height: "100svh", position: "relative", zIndex: 1, touchAction: "pan-x" }}
      className="bg-[var(--gic-night-sky)]"
    >
      <div
        style={{
          position: "relative",
          top: 0,
          height: "100svh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
          }}
        >
          <HeroV2 embedInScrollSequence embedContentOpacity={heroForegroundOpacity} />
        </div>

        <motion.div
          className="v3-root"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            clipPath: carouselClip,
            pointerEvents: carouselPointerEvents,
            willChange: "clip-path",
            background: "transparent",
          }}
        >
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--v3-bg, #08080a)",
              opacity: carouselBackdropOpacity,
              pointerEvents: "none",
            }}
          />
          <div className="relative z-[1] flex flex-col justify-center h-full w-full overflow-hidden">
            <ProjectsCarousel transparentBackdrop />
          </div>
        </motion.div>

        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            translateX: "-50%",
            zIndex: 30,
            opacity: hintOpacity,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            className="v3-mono"
            style={{
              fontSize: "0.46rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 1,
              height: 32,
              background: "linear-gradient(to bottom, rgba(200,168,74,0.55), rgba(200,168,74,0))",
            }}
          />
        </motion.div>

        <RevealEdge revealProgress={revealProgress} />
      </div>
    </div>
  );
}
