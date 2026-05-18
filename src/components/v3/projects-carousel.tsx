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
        borderColor: isActive ? "var(--v3-gold)" : "var(--v3-line)",
        transition: "opacity 0.35s ease, border-color 0.3s ease",
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
   SECTION HEADER
   ═══════════════════════════════════════════ */
function CarouselSectionHeader({
  isEs,
  transparentBackdrop,
}: {
  isEs: boolean;
  transparentBackdrop?: boolean;
}) {
  return (
    <div
      className="v3-section-header"
      style={
        transparentBackdrop ? { background: "transparent", borderBottomColor: "var(--v3-line)" } : undefined
      }
    >
      <span className="v3-sh-tag v3-mono">
        {isEs ? "[ SECCIÓN 04 / PROYECTOS ]" : "[ SECTION 04 / PROJECTS ]"}
      </span>
      <span className="v3-sh-title v3-display">ARCHIVO</span>
      <span className="v3-sh-num v3-serif" style={{ fontStyle: "italic" }}>
        {isEs ? "scroll horizontal · arrastra" : "scroll horizontal · drag"}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
type ProjectsCarouselProps = {
  /** Hero scroll sequence: keep solid v3 panels off so the hero night-sky reads through. */
  transparentBackdrop?: boolean;
};

export default function ProjectsCarousel({ transparentBackdrop }: ProjectsCarouselProps = {}) {
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

  /* Progress as 0–1 */
  const progress = TOTAL > 1 ? activeIndex / (TOTAL - 1) : 0;

  return (
    <section
      style={{
        background: transparentBackdrop ? "transparent" : "var(--v3-bg)",
        position: "relative",
      }}
      aria-label={isEs ? "Proyectos" : "Projects"}
    >
      <CarouselSectionHeader isEs={isEs} transparentBackdrop={transparentBackdrop} />

      {/* ── Embla viewport ── */}
      <div
        ref={emblaRef}
        style={{
          overflow: "hidden",
          padding: "clamp(2rem, 4vh, 3.5rem) 0",
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

      {/* ── Controls bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(1rem, 3vw, 2rem)",
          padding: "1.25rem clamp(1.5rem, 6vw, 5rem) 2.5rem",
          borderTop: "1px solid var(--v3-line)",
          flexWrap: "wrap",
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
            color: "var(--v3-gold)",
            letterSpacing: "0.08em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {pad(activeIndex + 1)}&thinsp;/&thinsp;{pad(TOTAL)}
        </span>
      </div>
    </section>
  );
}
