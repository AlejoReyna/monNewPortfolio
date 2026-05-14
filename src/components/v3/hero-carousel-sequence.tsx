"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import HeroV2 from "@/components/v2/hero-v2";
// NOTE: HeroV2 is rendered inside a motion.div that fades to opacity 0,
// making the terminal + gif disappear. A separate bg copy keeps mountains visible.
import { PROJECTS } from "@/components/v3/data/projects";
import "@/components/v3/v3.css";

/* ═══════════════════════════════════════════════════════════════════════════
   HeroCarouselSequence — Revolut-style scroll morph
   ───────────────────────────────────────────────────────────────────────────
   0 → MORPH_START      Pure hero
   MORPH_START → END    Blue-tinted overlay + 3 cards fan-in
   MORPH_END → HOLD     Fan fades → horizontal scroll row (all projects)
   ═══════════════════════════════════════════════════════════════════════════ */

const SCROLL_RUNWAY_VH = 600;

const PHASE = {
  morphStart: 0.28,
  morphEnd:   0.58,
  holdUntil:  0.90,
} as const;

/* Card sizes — bigger */
const SIDE_W   = 215;
const SIDE_H   = 420;
const CENTER_W = 275;
const CENTER_H = 490;

/* 4th asset (index 3 = PokeFolio) always centered */
const CENTER_IDX = 3;
const LEFT_P     = PROJECTS[CENTER_IDX - 1];  // MK1 Presale
const CENTER_P   = PROJECTS[CENTER_IDX];       // PokeFolio ← featured
const RIGHT_P    = PROJECTS[CENTER_IDX + 1];  // UANL Interface+

/* ─── Preview card ───────────────────────────────────────────────────────── */
function PreviewCard({
  project,
  width,
  height,
  featured = false,
}: {
  project: (typeof PROJECTS)[number];
  width: number;
  height: number;
  featured?: boolean;
}) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 18,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        background: "#0f0f12",
        border: `1px solid ${featured ? "rgba(200,168,74,0.9)" : "rgba(200,168,74,0.20)"}`,
        boxShadow: featured
          ? "0 36px 72px rgba(0,0,0,0.65), 0 0 0 1px rgba(200,168,74,0.10)"
          : "0 16px 36px rgba(0,0,0,0.50)",
        flexShrink: 0,
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {project.media && (
        <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>
          {project.mediaType === "video" ? (
            <video
              autoPlay muted loop playsInline preload="metadata"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            >
              <source src={project.media} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={project.media} alt={project.title} fill sizes="400px"
              style={{ objectFit: "cover" }}
              unoptimized={project.media.startsWith("http")}
            />
          )}
          {/* Bottom fade */}
          <div aria-hidden style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(to top, #0f0f12 0%, transparent 60%)",
          }} />
          {/* Ghost numeral */}
          <span aria-hidden style={{
            position: "absolute", bottom: -10, right: 8,
            fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)",
            fontSize: featured ? "5rem" : "3.6rem", lineHeight: 1,
            color: "rgba(200,168,74,0.07)", userSelect: "none", pointerEvents: "none",
          }}>
            {project.ghost}
          </span>
        </div>
      )}

      <div style={{ padding: featured ? "12px 15px 15px" : "9px 11px 11px", flexShrink: 0 }}>
        <span style={{
          display: "block", fontSize: 9, fontWeight: 600,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "var(--v3-gold,#c8a84a)", marginBottom: 3,
          fontFamily: "var(--font-space-mono,ui-monospace,monospace)",
        }}>
          {project.badge}
        </span>
        <h3 style={{
          fontSize: featured ? "1.05rem" : "0.82rem", fontWeight: 700,
          color: "#edeae0", letterSpacing: "-0.02em", lineHeight: 1.15, margin: 0,
          fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)",
        }}>
          {project.title}
        </h3>
        {featured && (
          <div style={{ display: "flex", gap: 4, marginTop: 7, flexWrap: "wrap" }}>
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} style={{
                fontSize: 8.5, color: "rgba(237,234,224,0.40)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 4, padding: "2px 6px",
                fontFamily: "var(--font-space-mono,ui-monospace,monospace)",
                letterSpacing: "0.04em",
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Horizontal scroll row (all projects, 3 visible) ───────────────────── */
function ProjectsScrollRow({ active }: { active: boolean }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(CENTER_IDX);

  /* Set initial scroll so CENTER_P is centered */
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const cards = row.querySelectorAll<HTMLElement>("[data-card]");
    const card  = cards[CENTER_IDX];
    if (card) {
      row.scrollLeft =
        card.offsetLeft - (row.offsetWidth - card.offsetWidth) / 2;
    }
  }, []);

  const handleScroll = () => {
    const row = rowRef.current;
    if (!row) return;
    const mid   = row.scrollLeft + row.offsetWidth / 2;
    const cards = Array.from(row.querySelectorAll<HTMLElement>("[data-card]"));
    let closest = 0, minDist = Infinity;
    cards.forEach((c, i) => {
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIdx(closest);
  };

  return (
    <>
      {/* Hide scrollbar */}
      <style>{`.proj-row::-webkit-scrollbar{display:none}`}</style>

      <div
        ref={rowRef}
        onScroll={handleScroll}
        className="proj-row"
        style={{
          position: "absolute",
          bottom: "10%",
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "flex-end",
          gap: 12,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          /* Padding centers the snap card */
          paddingLeft:  `calc(50% - ${CENTER_W / 2}px)`,
          paddingRight: `calc(50% - ${CENTER_W / 2}px)`,
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          pointerEvents: active ? "auto" : "none",
          zIndex: 20,
          cursor: active ? "grab" : "default",
        }}
      >
        {PROJECTS.map((project, i) => {
          const isActive = i === activeIdx;
          return (
            <div
              key={project.id}
              data-card
              style={{
                scrollSnapAlign: "center",
                flexShrink: 0,
                transform: isActive ? "translateY(0)" : "translateY(20px)",
                transition: "transform 0.35s ease",
              }}
            >
              <PreviewCard
                project={project}
                width={CENTER_W}
                height={isActive ? CENTER_H : SIDE_H}
                featured={isActive}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function HeroCarouselSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rowActive, setRowActive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 52, damping: 18, mass: 0.55 });

  /* Activate scroll row after fan has settled */
  const syncRow = (v: number) => {
    const on = v >= PHASE.morphEnd + 0.10;
    setRowActive((p) => (p === on ? p : on));
  };
  useLayoutEffect(() => syncRow(scrollYProgress.get()), [scrollYProgress]);
  useMotionValueEvent(scrollYProgress, "change", syncRow);

  /* ── Transforms ── */

  /* Fades the ENTIRE HeroV2 wrapper (terminal + gif + content all disappear) */
  const heroOpacity = useTransform(
    smooth, [PHASE.morphStart, PHASE.morphStart + 0.22], [1, 0]
  );

  /* Separate background image fades IN to keep mountains visible after hero fades out */
  const bgImageOpacity = useTransform(
    smooth, [PHASE.morphStart + 0.04, PHASE.morphStart + 0.28], [0, 1]
  );

  /* Blue overlay rises above the bg image */
  const bgOverlayOpacity = useTransform(
    smooth, [PHASE.morphStart, PHASE.morphStart + 0.26], [0, 1]
  );

  /* Title */
  const labelY       = useTransform(smooth, [PHASE.morphStart + 0.08, PHASE.morphEnd - 0.04], ["20px", "0px"]);
  const labelOpacity = useTransform(smooth, [PHASE.morphStart + 0.08, PHASE.morphEnd - 0.06], [0, 1]);

  /* Fan card animating in */
  const centerScale   = useTransform(smooth, [PHASE.morphStart + 0.04, PHASE.morphEnd], [1.5, 1]);
  const centerOpacity = useTransform(smooth, [PHASE.morphStart + 0.04, PHASE.morphStart + 0.24], [0, 1]);
  const leftX         = useTransform(smooth, [PHASE.morphStart + 0.06, PHASE.morphEnd], ["-115%", "0%"]);
  const leftOpacity   = useTransform(smooth, [PHASE.morphStart + 0.06, PHASE.morphStart + 0.26], [0, 1]);
  const rightX        = useTransform(smooth, [PHASE.morphStart + 0.06, PHASE.morphEnd], ["115%", "0%"]);
  const rightOpacity  = useTransform(smooth, [PHASE.morphStart + 0.06, PHASE.morphStart + 0.26], [0, 1]);

  /* Fan → scroll row crossfade */
  const fanOpacity = useTransform(
    smooth, [PHASE.morphEnd + 0.04, PHASE.morphEnd + 0.10], [1, 0]
  );
  const rowOpacity = useTransform(
    smooth, [PHASE.morphEnd + 0.06, PHASE.morphEnd + 0.14], [0, 1]
  );

  /* Scroll hint */
  const hintOpacity = useTransform(smooth, [0, PHASE.morphStart - 0.06], [1, 0]);

  return (
    <div
      ref={containerRef}
      style={{ height: `${SCROLL_RUNWAY_VH}vh`, position: "relative" }}
      className="bg-[var(--gic-night-sky)]"
    >
      <div style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden" }}>

        {/* L1 — Hero (entire wrapper fades out → terminal + gif + content all disappear) */}
        <motion.div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: heroOpacity }}>
          <HeroV2 embedInScrollSequence />
        </motion.div>

        {/* L2 — Persistent background image (mountains stay visible after hero fades) */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 2,
            pointerEvents: "none", opacity: bgImageOpacity,
          }}
        >
          <Image
            src="/shadersmine.png"
            alt=""
            fill
            priority={false}
            style={{ objectFit: "cover", opacity: 0.28, mixBlendMode: "luminosity" }}
          />
          {/* Same multi-layer vignette as HeroV2 */}
          <div
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(31,31,41,0.55) 0%, rgba(31,31,41,0.3) 40%, rgba(31,31,41,0.85) 100%)",
            }}
          />
        </motion.div>

        {/* L3 — Blue-tinted overlay (night sky still visible through it) */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
            background: "rgba(5, 15, 48, 0.45)",
            opacity: bgOverlayOpacity,
          }}
        />

        {/* L4 — "My projects" title */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute", top: "9%", left: "50%",
            translateX: "-50%", zIndex: 20, pointerEvents: "none",
            y: labelY, opacity: labelOpacity,
            textAlign: "center", whiteSpace: "nowrap",
          }}
        >
          <h2 className="v3-display" style={{
            fontSize: "clamp(2.4rem, 5.5vw, 4.8rem)",
            color: "var(--v3-text,#edeae0)", lineHeight: 1, margin: 0,
          }}>
            My projects
          </h2>
        </motion.div>

        {/* L5 — Fan of 3 cards (morph phase) */}
        <motion.div style={{ opacity: fanOpacity }}>
          {/* Left */}
          <motion.div style={{
            position: "absolute",
            left: `calc(50% - ${CENTER_W / 2}px - ${SIDE_W}px - 12px)`,
            bottom: "12%", zIndex: 18,
            x: leftX, opacity: leftOpacity,
            pointerEvents: "none", willChange: "transform, opacity",
          }}>
            <PreviewCard project={LEFT_P} width={SIDE_W} height={SIDE_H} />
          </motion.div>

          {/* Center */}
          <motion.div style={{
            position: "absolute", left: "50%", bottom: "10%",
            translateX: "-50%", zIndex: 20,
            scale: centerScale, opacity: centerOpacity,
            transformOrigin: "center bottom",
            pointerEvents: "none", willChange: "transform, opacity",
          }}>
            <PreviewCard project={CENTER_P} width={CENTER_W} height={CENTER_H} featured />
          </motion.div>

          {/* Right */}
          <motion.div style={{
            position: "absolute",
            left: `calc(50% + ${CENTER_W / 2}px + 12px)`,
            bottom: "12%", zIndex: 18,
            x: rightX, opacity: rightOpacity,
            pointerEvents: "none", willChange: "transform, opacity",
          }}>
            <PreviewCard project={RIGHT_P} width={SIDE_W} height={SIDE_H} />
          </motion.div>
        </motion.div>

        {/* L6 — Horizontal scroll row (all 7 projects, settled state) */}
        <motion.div style={{ opacity: rowOpacity, zIndex: 20 }}>
          <ProjectsScrollRow active={rowActive} />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute", bottom: 28, left: "50%", translateX: "-50%",
            zIndex: 30, opacity: hintOpacity, pointerEvents: "none",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          }}
        >
          <span className="v3-mono" style={{
            fontSize: "0.46rem", letterSpacing: "0.22em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
          }}>
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 1, height: 32,
              background: "linear-gradient(to bottom, rgba(200,168,74,0.45), rgba(200,168,74,0))",
            }}
          />
        </motion.div>

      </div>
    </div>
  );
}
