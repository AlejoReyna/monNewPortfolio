"use client";

import { useCallback, useRef, useState, type TouchEvent, type WheelEvent } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import HeroV2 from "@/components/v2/hero-v2";
import ProjectsCarousel from "@/components/v3/projects-carousel";
import "@/components/v3/v3.css";

/* ═══════════════════════════════════════════════════════════════════════════
   HeroCarouselSequence — Hero-to-projects curtain reveal
   ═══════════════════════════════════════════════════════════════════════════ */

const PHASE = {
  heroOnlyUntil: 0.08,
  revealCompleteBy: 0.82,
  cardsEnterAt: 0.58,
} as const;

const WHEEL_THRESHOLD = 16;
const SWIPE_THRESHOLD = 36;

export default function HeroCarouselSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealProgress = useMotionValue(0);
  const isAnimatingRef = useRef(false);
  const isRevealedRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const [carouselPointerEvents, setCarouselPointerEvents] = useState<"none" | "auto">("none");
  const [carouselIntroActive, setCarouselIntroActive] = useState(false);

  useMotionValueEvent(revealProgress, "change", (latest) => {
    const next = latest >= 0.98 ? "auto" : "none";
    setCarouselPointerEvents((prev) => (prev === next ? prev : next));
    setCarouselIntroActive((prev) => {
      const shouldShow = latest >= PHASE.cardsEnterAt;
      return prev === shouldShow ? prev : shouldShow;
    });
  });

  const animateReveal = useCallback(
    (next: 0 | 1) => {
      if (isAnimatingRef.current || Number(isRevealedRef.current) === next) return;

      isAnimatingRef.current = true;
      setCarouselPointerEvents("none");
      if (next === 0) setCarouselIntroActive(false);

      animate(revealProgress, next, {
        duration: 1.35,
        ease: [0.16, 1, 0.3, 1],
        onComplete: () => {
          isRevealedRef.current = next === 1;
          isAnimatingRef.current = false;
          setCarouselPointerEvents(next === 1 ? "auto" : "none");
          setCarouselIntroActive(next === 1);
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
    [0.12, 0.72],
    [1, 0]
  );
  const heroScale = useTransform(revealProgress, [0, 1], [1, 0.985]);
  const carouselY = useTransform(revealProgress, [0, 1], ["7%", "0%"]);

  const carouselClip = useTransform(
    revealProgress,
    [PHASE.heroOnlyUntil, PHASE.revealCompleteBy],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]
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
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            scale: heroScale,
          }}
        >
          <HeroV2
            embedInScrollSequence
            embedContentOpacity={heroForegroundOpacity}
            disableBgVignette
          />
        </motion.div>

        <motion.div
          className="v3-root"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            clipPath: carouselClip,
            pointerEvents: carouselPointerEvents,
            y: carouselY,
            willChange: "clip-path",
            background: "transparent",
          }}
        >
          <div className="relative z-[1] flex flex-col justify-center h-full w-full overflow-hidden">
            <ProjectsCarousel transparentBackdrop introActive={carouselIntroActive} />
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
            style={{
              fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
              fontSize: "1rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            scroll
          </span>
          <svg
            width="36" height="52"
            viewBox="0 0 36 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", opacity: 0.8 }}
          >
            {/* curved path: starts top-left, arcs right then down */}
            <path
              d="M 8 4 C 8 28, 28 28, 28 48"
              stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none"
            />
            {/* arrowhead pointing down */}
            <polyline
              points="22,43 28,48 34,43"
              stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
