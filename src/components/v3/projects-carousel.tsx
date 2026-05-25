"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/lang-context";
import { PROJECTS, type V3Project } from "./data/projects";
import "@/components/v3/v3.css";

/* ─── helpers ───────────────────────────── */
function pad(n: number): string {
  return String(n).padStart(2, "0");
}

const TOTAL = PROJECTS.length;

/* ═══════════════════════════════════════════
   CARD
   ═══════════════════════════════════════════ */
interface CardProps {
  project: V3Project;
  idx: number;
  isActive: boolean;
  videoRef: (el: HTMLVideoElement | null) => void;
  isEs: boolean;
}

function ProjectCard({ project, idx, isActive, videoRef, isEs }: CardProps) {
  return (
    <article
      className="v3-carousel-card"
      aria-label={project.title}
      style={{
        opacity: isActive ? 1 : 0.52,
        borderColor: isActive ? "rgba(248,245,234,0.72)" : "rgba(248,245,234,0.24)",
      }}
    >
      {/* Ghost roman numeral — positioned absolute, bottom-right */}
      <span className="v3-carousel-ghost" aria-hidden="true">
        {project.ghost}
      </span>

      {/* ① Eyebrow */}
      <span className="v3-carousel-eyebrow">
        {`ARCHIVO / ${pad(idx + 1)}`}
      </span>

      {/* ② Media */}
      {project.media && (
        <div className="v3-carousel-media">
          {project.mediaType === "video" ? (
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="metadata"
              className="v3-carousel-media-inner"
              style={{
                filter: isActive ? "none" : "grayscale(0.6)",
                transition: "filter 0.35s ease",
              }}
            >
              <source src={project.media} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={project.media}
              alt={project.title}
              fill
              sizes="(max-width: 720px) 90vw, 620px"
              className="v3-carousel-media-inner"
              style={{
                filter: isActive ? "none" : "grayscale(0.6)",
                transition: "filter 0.35s ease",
              }}
              unoptimized={project.media.startsWith("http")}
            />
          )}
          {/* Bottom gradient overlay */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(8,8,10,0.22) 0%, transparent 55%)",
              pointerEvents: "none",
            }}
          />
        </div>
      )}

      {/* ③ Badge */}
      <span className="v3-carousel-badge">{project.badge}</span>

      {/* ④ Title */}
      <h3 className="v3-carousel-title">{project.title}</h3>

      {/* ⑤ Tagline */}
      <p className="v3-carousel-tagline">
        {isEs ? project.tagline.es : project.tagline.en}
      </p>

      {/* ⑥ Description */}
      <p className="v3-carousel-desc">
        {isEs ? project.description.es : project.description.en}
      </p>

      {/* ⑦ Stack tags */}
      <div className="v3-carousel-tags" aria-label="Stack">
        {project.tags.map((tag) => (
          <span key={tag} className="v3-carousel-tag">
            {tag}
          </span>
        ))}
      </div>

      {/* ⑧ Links */}
      <div className="v3-carousel-links">
        {project.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="v3-carousel-link"
          >
            {isEs ? link.label.es : link.label.en}
            {" ↗"}
          </a>
        ))}
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
type ProjectsCarouselProps = {
  /** Hero scroll sequence: keep solid v3 panels off so the hero night-sky reads through. */
  transparentBackdrop?: boolean;
  /** Hero sequence intro: cards appear sequentially after the curtain opens. */
  introActive?: boolean;
};

export default function ProjectsCarousel({ transparentBackdrop, introActive = true }: ProjectsCarouselProps = {}) {
  const { language } = useLanguage();
  const isEs = language === "es";

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
    containScroll: "trimSnaps",
    dragFree: false,
    slidesToScroll: 1,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const edgeScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stable array of refs — one per project slot
  const videoRefs = useRef<(HTMLVideoElement | null)[]>(
    Array.from({ length: TOTAL }, () => null)
  );

  /* ── Embla select callback ── */
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.selectedScrollSnap();
    setActiveIndex(idx);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(); // seed initial state
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  /* ── Video play/pause management (active ± 1 play, rest pause) ── */
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (Math.abs(i - activeIndex) <= 1) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [activeIndex]);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!emblaApi) return;
      if (e.key === "ArrowLeft") emblaApi.scrollPrev();
      if (e.key === "ArrowRight") emblaApi.scrollNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const stopEdgeScroll = useCallback(() => {
    if (!edgeScrollTimerRef.current) return;
    window.clearInterval(edgeScrollTimerRef.current);
    edgeScrollTimerRef.current = null;
  }, []);

  const startEdgeScroll = useCallback(
    (direction: "prev" | "next") => {
      if (!emblaApi) return;

      const canMove = direction === "prev" ? emblaApi.canScrollPrev() : emblaApi.canScrollNext();
      if (!canMove) return;

      stopEdgeScroll();

      const scroll = () => {
        const canStillMove = direction === "prev" ? emblaApi.canScrollPrev() : emblaApi.canScrollNext();
        if (!canStillMove) {
          stopEdgeScroll();
          return;
        }

        if (direction === "prev") {
          emblaApi.scrollPrev();
        } else {
          emblaApi.scrollNext();
        }
      };

      scroll();
      edgeScrollTimerRef.current = setInterval(scroll, 950);
    },
    [emblaApi, stopEdgeScroll]
  );

  useEffect(() => stopEdgeScroll, [stopEdgeScroll]);

  /* Progress as 0–1 */
  const progress = TOTAL > 1 ? activeIndex / (TOTAL - 1) : 0;

  return (
    <section
      className={transparentBackdrop ? "v3-carousel-sequence-frame" : undefined}
      style={{
        background: transparentBackdrop ? "transparent" : "var(--v3-bg)",
        position: "relative",
        minHeight: "100svh",
      }}
      aria-label={isEs ? "Proyectos" : "Projects"}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "10svh",
          left: 0,
          right: 0,
          height: 1,
          background: "var(--v3-line)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "10svh",
          height: 1,
          background: "var(--v3-line)",
          pointerEvents: "none",
        }}
      />

      {/* ── Embla viewport ── */}
      <div
        ref={emblaRef}
        style={{
          overflow: "hidden",
          padding: transparentBackdrop
            ? "calc(10svh + clamp(0.75rem, 2vh, 1.25rem)) 0 clamp(0.75rem, 2vh, 1.25rem)"
            : "clamp(1rem, 2.6vh, 2rem) 0 clamp(1rem, 2.6vh, 2rem)",
        }}
      >
        <div
          role="list"
          style={{
            display: "flex",
            gap: "clamp(1rem, 2vw, 1.5rem)",
            paddingLeft: "clamp(1.5rem, 8vw, 5rem)",
            paddingRight: "clamp(1.5rem, 8vw, 5rem)",
          }}
        >
          {PROJECTS.map((project, i) => (
            <div
              key={project.id}
              className="v3-carousel-slide"
              role="listitem"
              aria-label={`${project.title}, ${pad(i + 1)} de ${pad(TOTAL)}`}
              style={{
                opacity: introActive ? 1 : 0,
                transform: introActive ? "translate3d(0,0,0) scale(1)" : "translate3d(0,42px,0) scale(0.96)",
                transitionProperty: "opacity, transform",
                transitionDuration: "900ms",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: introActive ? `${140 + i * 110}ms` : "0ms",
                willChange: "opacity, transform",
              }}
            >
              <ProjectCard
                project={project}
                idx={i}
                isActive={i === activeIndex}
                videoRef={(el) => {
                  videoRefs.current[i] = el;
                }}
                isEs={isEs}
              />
            </div>
          ))}
        </div>
      </div>

      {transparentBackdrop && (
        <>
          <div
            aria-hidden
            onMouseEnter={() => startEdgeScroll("prev")}
            onMouseLeave={stopEdgeScroll}
            style={{
              position: "absolute",
              top: "10svh",
              bottom: "10svh",
              left: 0,
              width: "clamp(72px, 11vw, 160px)",
              zIndex: 5,
              cursor: canScrollPrev ? "w-resize" : "default",
              pointerEvents: introActive && canScrollPrev ? "auto" : "none",
              background: "linear-gradient(to right, rgba(8,8,10,0.28), rgba(8,8,10,0))",
            }}
          />
          <div
            aria-hidden
            onMouseEnter={() => startEdgeScroll("next")}
            onMouseLeave={stopEdgeScroll}
            style={{
              position: "absolute",
              top: "10svh",
              bottom: "10svh",
              right: 0,
              width: "clamp(72px, 11vw, 160px)",
              zIndex: 5,
              cursor: canScrollNext ? "e-resize" : "default",
              pointerEvents: introActive && canScrollNext ? "auto" : "none",
              background: "linear-gradient(to left, rgba(8,8,10,0.28), rgba(8,8,10,0))",
            }}
          />
        </>
      )}

      {/* ── Controls bar ── */}
      <motion.div
        initial={false}
        animate={{
          opacity: introActive ? 1 : 0,
          y: introActive ? 0 : 16,
        }}
        transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1], delay: introActive ? 0.42 : 0 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(1rem, 3vw, 2rem)",
          padding: transparentBackdrop
            ? "0 clamp(1.5rem, 6vw, 5rem)"
            : "1.25rem clamp(1.5rem, 6vw, 5rem) 2.5rem",
          borderTop: transparentBackdrop ? "none" : "1px solid var(--v3-line)",
          flexWrap: "wrap",
          position: transparentBackdrop ? "absolute" : "relative",
          left: transparentBackdrop ? 0 : undefined,
          right: transparentBackdrop ? 0 : undefined,
          bottom: transparentBackdrop ? "calc(5svh - 1.2rem)" : undefined,
        }}
      >
        {/* Arrow buttons */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label={isEs ? "Proyecto anterior" : "Previous project"}
            className="v3-carousel-arrow"
            style={{ opacity: canScrollPrev ? 1 : 0.25, cursor: canScrollPrev ? "pointer" : "not-allowed" }}
          >
            ←
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label={isEs ? "Proyecto siguiente" : "Next project"}
            className="v3-carousel-arrow"
            style={{ opacity: canScrollNext ? 1 : 0.25, cursor: canScrollNext ? "pointer" : "not-allowed" }}
          >
            →
          </button>
        </div>

        {/* Progress bar (thin line, not dots) */}
        <div
          className="v3-carousel-progress-wrap"
          aria-hidden="true"
          role="presentation"
        >
          <motion.div
            className="v3-carousel-progress-fill"
            animate={{ scaleX: progress }}
            initial={{ scaleX: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ transformOrigin: "left center" }}
          />
        </div>

        {/* Counter — Bebas Neue */}
        <span
          className="v3-display"
          aria-live="polite"
          aria-atomic="true"
          style={{
            fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
            color: "rgba(248,245,234,0.88)",
            letterSpacing: "0.08em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {pad(activeIndex + 1)}&thinsp;/&thinsp;{pad(TOTAL)}
        </span>
      </motion.div>
    </section>
  );
}
