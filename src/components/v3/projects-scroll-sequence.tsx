"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { PROJECTS } from "@/components/v3/data/projects";
import "@/components/v3/v3.css";

const SCROLL_RUNWAY_VH = 430;

const PHASE = {
  introStart: 0.08,
  fanEnd: 0.46,
  holdUntil: 0.82,
} as const;

const SIDE_W = 215;
const SIDE_H = 420;
const CENTER_W = 275;
const CENTER_H = 490;

const CENTER_IDX = 3;
const LEFT_P = PROJECTS[CENTER_IDX - 1];
const CENTER_P = PROJECTS[CENTER_IDX];
const RIGHT_P = PROJECTS[CENTER_IDX + 1];

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
      }}
    >
      {project.media && (
        <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>
          {project.mediaType === "video" ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              <source src={project.media} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={project.media}
              alt={project.title}
              fill
              sizes="400px"
              style={{ objectFit: "cover" }}
              unoptimized={project.media.startsWith("http")}
            />
          )}

          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: "linear-gradient(to top, #0f0f12 0%, transparent 60%)",
            }}
          />

          <span
            aria-hidden
            style={{
              position: "absolute",
              bottom: -10,
              right: 8,
              fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)",
              fontSize: featured ? "5rem" : "3.6rem",
              lineHeight: 1,
              color: "rgba(200,168,74,0.07)",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {project.ghost}
          </span>
        </div>
      )}

      <div style={{ padding: featured ? "12px 15px 15px" : "9px 11px 11px", flexShrink: 0 }}>
        <span
          style={{
            display: "block",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--v3-gold,#c8a84a)",
            marginBottom: 3,
            fontFamily: "var(--font-space-mono,ui-monospace,monospace)",
          }}
        >
          {project.badge}
        </span>
        <h3
          style={{
            fontSize: featured ? "1.05rem" : "0.82rem",
            fontWeight: 700,
            color: "#edeae0",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            margin: 0,
            fontFamily: "var(--font-bebas,'Bebas Neue',sans-serif)",
          }}
        >
          {project.title}
        </h3>
        {featured && (
          <div style={{ display: "flex", gap: 4, marginTop: 7, flexWrap: "wrap" }}>
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 8.5,
                  color: "rgba(237,234,224,0.40)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 4,
                  padding: "2px 6px",
                  fontFamily: "var(--font-space-mono,ui-monospace,monospace)",
                  letterSpacing: "0.04em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectsScrollRow({ active }: { active: boolean }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(CENTER_IDX);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const cards = row.querySelectorAll<HTMLElement>("[data-card]");
    const card = cards[CENTER_IDX];
    if (card) {
      row.scrollLeft = card.offsetLeft - (row.offsetWidth - card.offsetWidth) / 2;
    }
  }, []);

  const handleScroll = () => {
    const row = rowRef.current;
    if (!row) return;
    const mid = row.scrollLeft + row.offsetWidth / 2;
    const cards = Array.from(row.querySelectorAll<HTMLElement>("[data-card]"));
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - mid);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIdx(closest);
  };

  return (
    <>
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
          paddingLeft: `calc(50% - ${CENTER_W / 2}px)`,
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

export default function ProjectsScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rowActive, setRowActive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 52, damping: 18, mass: 0.55 });

  const syncRow = (v: number) => {
    const on = v >= PHASE.fanEnd + 0.1;
    setRowActive((previous) => (previous === on ? previous : on));
  };

  useLayoutEffect(() => syncRow(scrollYProgress.get()), [scrollYProgress]);
  useMotionValueEvent(scrollYProgress, "change", syncRow);


  const labelY = useTransform(smooth, [PHASE.introStart, PHASE.fanEnd - 0.05], ["28px", "0px"]);
  const labelOpacity = useTransform(smooth, [PHASE.introStart, PHASE.fanEnd - 0.12], [0, 1]);

  const centerScale = useTransform(smooth, [PHASE.introStart, PHASE.fanEnd], [1.42, 1]);
  const centerOpacity = useTransform(smooth, [PHASE.introStart, PHASE.introStart + 0.16], [0, 1]);
  const leftX = useTransform(smooth, [PHASE.introStart + 0.02, PHASE.fanEnd], ["-115%", "0%"]);
  const leftOpacity = useTransform(smooth, [PHASE.introStart + 0.02, PHASE.introStart + 0.2], [0, 1]);
  const rightX = useTransform(smooth, [PHASE.introStart + 0.02, PHASE.fanEnd], ["115%", "0%"]);
  const rightOpacity = useTransform(smooth, [PHASE.introStart + 0.02, PHASE.introStart + 0.2], [0, 1]);

  const fanOpacity = useTransform(smooth, [PHASE.fanEnd + 0.04, PHASE.fanEnd + 0.1], [1, 0]);
  const rowOpacity = useTransform(smooth, [PHASE.fanEnd + 0.06, PHASE.fanEnd + 0.14], [0, 1]);
  const hintOpacity = useTransform(smooth, [0.02, 0.18], [1, 0]);

  return (
    <section
      id="work"
      ref={containerRef}
      style={{ height: `${SCROLL_RUNWAY_VH}vh`, position: "relative", background: "transparent" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden" }}>

        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            top: "9%",
            left: "50%",
            translateX: "-50%",
            zIndex: 20,
            pointerEvents: "none",
            y: labelY,
            opacity: labelOpacity,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          <h2
            className="v3-display"
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 4.8rem)",
              color: "var(--v3-text,#edeae0)",
              lineHeight: 1,
              margin: 0,
            }}
          >
            My projects
          </h2>
        </motion.div>

        <motion.div style={{ opacity: fanOpacity }}>
          <motion.div
            style={{
              position: "absolute",
              left: `calc(50% - ${CENTER_W / 2}px - ${SIDE_W}px - 12px)`,
              bottom: "12%",
              zIndex: 18,
              x: leftX,
              opacity: leftOpacity,
              pointerEvents: "none",
              willChange: "transform, opacity",
            }}
          >
            <PreviewCard project={LEFT_P} width={SIDE_W} height={SIDE_H} />
          </motion.div>

          <motion.div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "10%",
              translateX: "-50%",
              zIndex: 20,
              scale: centerScale,
              opacity: centerOpacity,
              transformOrigin: "center bottom",
              pointerEvents: "none",
              willChange: "transform, opacity",
            }}
          >
            <PreviewCard project={CENTER_P} width={CENTER_W} height={CENTER_H} featured />
          </motion.div>

          <motion.div
            style={{
              position: "absolute",
              left: `calc(50% + ${CENTER_W / 2}px + 12px)`,
              bottom: "12%",
              zIndex: 18,
              x: rightX,
              opacity: rightOpacity,
              pointerEvents: "none",
              willChange: "transform, opacity",
            }}
          >
            <PreviewCard project={RIGHT_P} width={SIDE_W} height={SIDE_H} />
          </motion.div>
        </motion.div>

        <motion.div style={{ opacity: rowOpacity, zIndex: 20 }}>
          <ProjectsScrollRow active={rowActive} />
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
              color: "rgba(255,255,255,0.2)",
            }}
          >
            scroll projects
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 1,
              height: 32,
              background: "linear-gradient(to bottom, rgba(200,168,74,0.45), rgba(200,168,74,0))",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
