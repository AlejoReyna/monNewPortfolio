"use client";

import { useCallback, useEffect, useRef, useState, type TouchEvent, type WheelEvent } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import HeroV2 from "@/components/v2/hero-v2";
// import ProjectsCarousel from "@/components/v3/projects-carousel";
import ThisCafeteriaGateway from "@/components/this-cafeteria-gateway";
import WeddingServiceGateway from "@/components/wedding-service-gateway";
import PlebesProjectGateway from "@/components/plebes-project-gateway";
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
const PANEL_TRANSITION = {
  duration: 0.34,
  ease: [0.22, 1, 0.36, 1] as const,
};
type SequencePanel = 0 | 1 | 2 | 3; // | 4 — carousel hidden; minecraft + uanl panels removed

export default function HeroCarouselSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cafeteriaProgress = useMotionValue(0);
  const minecraftProgress = useMotionValue(0);
  const plebesProgress = useMotionValue(0);
  const revealProgress = useMotionValue(0);
  const isAnimatingRef = useRef(false);
  const isRevealedRef = useRef(false);
  const activePanelRef = useRef<SequencePanel>(0);
  const [activePanel, setActivePanelState] = useState<SequencePanel>(0);
  const touchStartYRef = useRef<number | null>(null);
  const [carouselPointerEvents, setCarouselPointerEvents] = useState<"none" | "auto">("none");
  const [carouselIntroActive, setCarouselIntroActive] = useState(false);
  const [cafeteriaPointerEvents, setCafeteriaPointerEvents] = useState<"none" | "auto">("none");
  const [minecraftPointerEvents, setMinecraftPointerEvents] = useState<"none" | "auto">("none");
  const [plebesPointerEvents, setPlebesPointerEvents] = useState<"none" | "auto">("none");

  const setNavFontMode = useCallback((mode: "default" | "cafeteria" | "wedding") => {
    document.body.classList.toggle("is-cafeteria-panel-active", mode === "cafeteria");
    document.body.classList.toggle("is-wedding-panel-active", mode === "wedding");
  }, []);

  useEffect(() => {
    document.body.classList.remove("is-cafeteria-panel-active");
    document.body.classList.remove("is-wedding-panel-active");
    document.body.classList.remove("is-nav-font-transitioning");

    return () => {
      document.body.classList.remove("is-cafeteria-panel-active");
      document.body.classList.remove("is-wedding-panel-active");
      document.body.classList.remove("is-nav-font-transitioning");
    };
  }, []);

  const setActivePanel = useCallback((panel: SequencePanel) => {
    activePanelRef.current = panel;
    setActivePanelState(panel);
  }, []);

  useMotionValueEvent(cafeteriaProgress, "change", (latest) => {
    const next = latest >= 0.98 ? "auto" : "none";
    setCafeteriaPointerEvents((prev) => (prev === next ? prev : next));
  });

  useMotionValueEvent(minecraftProgress, "change", (latest) => {
    const next = latest >= 0.98 ? "auto" : "none";
    setMinecraftPointerEvents((prev) => (prev === next ? prev : next));
  });

  useMotionValueEvent(plebesProgress, "change", (latest) => {
    const next = latest >= 0.98 ? "auto" : "none";
    setPlebesPointerEvents((prev) => (prev === next ? prev : next));
  });

  useMotionValueEvent(revealProgress, "change", (latest) => {
    const next = latest >= 0.98 ? "auto" : "none";
    setCarouselPointerEvents((prev) => (prev === next ? prev : next));
    setCarouselIntroActive((prev) => {
      const shouldShow = latest >= PHASE.cardsEnterAt;
      return prev === shouldShow ? prev : shouldShow;
    });
  });

  const animateToPanel = useCallback(
    (nextPanel: SequencePanel) => {
      if (isAnimatingRef.current || activePanelRef.current === nextPanel) return;

      const currentPanel = activePanelRef.current;
      isAnimatingRef.current = true;
      setNavFontMode(nextPanel === 1 ? "cafeteria" : nextPanel === 2 ? "wedding" : "default");
      setActivePanel(nextPanel);
      isRevealedRef.current = false;
      revealProgress.set(0);

      const finishPanelTransition = () => {
        isAnimatingRef.current = false;
      };

      if (nextPanel === 0) {
        minecraftProgress.set(0);
        plebesProgress.set(0);
        setCafeteriaPointerEvents("none");
        setMinecraftPointerEvents("none");
        setPlebesPointerEvents("none");
        setCarouselPointerEvents("none");
        setCarouselIntroActive(false);
        animate(cafeteriaProgress, 0, {
          ...PANEL_TRANSITION,
          onComplete: finishPanelTransition,
        });
        return;
      }

      if (nextPanel === 1) {
        const motionValue = currentPanel === 2 ? minecraftProgress : cafeteriaProgress;
        if (currentPanel === 2) {
          cafeteriaProgress.set(1);
        } else {
          minecraftProgress.set(0);
        }
        plebesProgress.set(0);
        setCafeteriaPointerEvents("none");
        setMinecraftPointerEvents("none");
        setPlebesPointerEvents("none");
        setCarouselPointerEvents("none");
        setCarouselIntroActive(false);
        animate(motionValue, currentPanel === 2 ? 0 : 1, {
          ...PANEL_TRANSITION,
          onComplete: () => {
            setCafeteriaPointerEvents("auto");
            finishPanelTransition();
          },
        });
        return;
      }

      if (nextPanel === 2) {
        const motionValue = currentPanel === 3 ? plebesProgress : minecraftProgress;
        cafeteriaProgress.set(1);
        if (currentPanel === 3) {
          minecraftProgress.set(1);
        } else {
          plebesProgress.set(0);
        }
        setCafeteriaPointerEvents("none");
        setMinecraftPointerEvents("none");
        setPlebesPointerEvents("none");
        setCarouselPointerEvents("none");
        setCarouselIntroActive(false);
        animate(motionValue, currentPanel === 3 ? 0 : 1, {
          ...PANEL_TRANSITION,
          onComplete: () => {
            setMinecraftPointerEvents("auto");
            finishPanelTransition();
          },
        });
        return;
      }

      if (nextPanel === 3) {
        cafeteriaProgress.set(1);
        minecraftProgress.set(1);
        setCafeteriaPointerEvents("none");
        setMinecraftPointerEvents("none");
        setPlebesPointerEvents("none");
        setCarouselPointerEvents("none");
        setCarouselIntroActive(false);
        animate(plebesProgress, 1, {
          ...PANEL_TRANSITION,
          onComplete: () => {
            setPlebesPointerEvents("auto");
            finishPanelTransition();
          },
        });
        return;
      }

      // Panel 4 (projects carousel) hidden — restore block + import to re-enable
    },
    [
      cafeteriaProgress,
      minecraftProgress,
      plebesProgress,
      revealProgress,
      setActivePanel,
      setNavFontMode,
    ]
  );

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;
      const interactiveTarget = (event.target as HTMLElement | null)?.closest(
        "input, textarea, select, button, a"
      );
      if (interactiveTarget) return;

      if (event.deltaY > 0) {
        animateToPanel(Math.min(activePanelRef.current + 1, 3) as SequencePanel);
      } else {
        animateToPanel(Math.max(activePanelRef.current - 1, 0) as SequencePanel);
      }
    },
    [animateToPanel]
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
        animateToPanel(Math.min(activePanelRef.current + 1, 3) as SequencePanel);
      } else {
        animateToPanel(Math.max(activePanelRef.current - 1, 0) as SequencePanel);
      }
    },
    [animateToPanel]
  );

  const heroForegroundOpacity = useTransform(
    cafeteriaProgress,
    [0.12, 0.72],
    [1, 0]
  );
  const heroScale = useTransform(cafeteriaProgress, [0, 1], [1, 0.985]);
  const cafeteriaY = useTransform(cafeteriaProgress, [0, 1], ["100%", "0%"]);
  const minecraftY = useTransform(minecraftProgress, [0, 1], ["100%", "0%"]);
  const plebesY = useTransform(plebesProgress, [0, 1], ["100%", "0%"]);
  const carouselY = useTransform(revealProgress, [0, 1], ["7%", "0%"]);

  const carouselClip = useTransform(
    revealProgress,
    [PHASE.heroOnlyUntil, PHASE.revealCompleteBy],
    ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]
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
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            y: cafeteriaY,
            pointerEvents: cafeteriaPointerEvents,
            willChange: "transform",
          }}
        >
          <ThisCafeteriaGateway isActive={activePanel === 1} />
        </motion.div>

        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            y: minecraftY,
            pointerEvents: minecraftPointerEvents,
            willChange: "transform",
          }}
        >
          <WeddingServiceGateway isActive={activePanel === 2} />
        </motion.div>

        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 6,
            y: plebesY,
            pointerEvents: plebesPointerEvents,
            willChange: "transform",
          }}
        >
          <PlebesProjectGateway isActive={activePanel === 3} />
        </motion.div>

        {/* Projects carousel hidden — uncomment import + block to restore
        <motion.div
          className="v3-root"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 9,
            clipPath: carouselClip,
            pointerEvents: carouselPointerEvents,
            y: carouselY,
            willChange: "clip-path",
            background: "transparent",
          }}
        >
          <div className="relative z-[1] flex flex-col justify-center h-full w-full overflow-hidden">
            <ProjectsCarousel introActive={carouselIntroActive} />
          </div>
        </motion.div>
        */}
      </div>
    </div>
  );
}
