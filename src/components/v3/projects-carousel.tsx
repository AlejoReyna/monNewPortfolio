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
const EDGE_SCROLL_SPEED = 1.25;

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
        borderColor: isActive ? "rgba(248,245,234,0.72)" : "rgba(248,245,234,0.24)",
        transform: isActive ? "scale(1.035)" : "scale(1)",
      }}
    >
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
  const edgeScrollActiveRef = useRef(false);
  const defaultScrollBodyRef = useRef<
    ReturnType<NonNullable<typeof emblaApi>["internalEngine"]>["scrollBody"] | null
  >(null);

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
    if (!emblaApi || !edgeScrollActiveRef.current) return;

    const engine = emblaApi.internalEngine();
    if (defaultScrollBodyRef.current) {
      engine.scrollBody = defaultScrollBodyRef.current;
    }

    edgeScrollActiveRef.current = false;
    onSelect();
  }, [emblaApi, onSelect]);

  const startEdgeScroll = useCallback(
    (direction: "prev" | "next") => {
      if (!emblaApi) return;

      const canMove = direction === "prev" ? emblaApi.canScrollPrev() : emblaApi.canScrollNext();
      if (!canMove) return;

      stopEdgeScroll();

      const engine = emblaApi.internalEngine();
      const {
        location,
        previousLocation,
        offsetLocation,
        target,
        scrollTarget,
        index,
        indexPrevious,
        limit: { reachedMin, reachedMax, constrain },
      } = engine;
      const directionSign = direction === "next" ? -1 : 1;
      const noop = () => edgeScrollBody;

      let bodyVelocity = 0;
      let scrollDirection = 0;
      let rawLocation = location.get();
      let rawLocationPrevious = rawLocation;
      let hasSettled = false;

      const edgeScrollBody = {
        direction: () => scrollDirection,
        duration: () => -1,
        velocity: () => bodyVelocity,
        settled: () => hasSettled,
        seek: () => {
          previousLocation.set(location);

          bodyVelocity = directionSign * EDGE_SCROLL_SPEED;
          rawLocation += bodyVelocity;
          location.add(bodyVelocity);
          target.set(location);

          const directionDiff = rawLocation - rawLocationPrevious;
          scrollDirection = Math.sign(directionDiff);
          rawLocationPrevious = rawLocation;

          const currentIndex = scrollTarget.byDistance(0, false).index;
          if (index.get() !== currentIndex) {
            indexPrevious.set(index.get());
            index.set(currentIndex);
            emblaApi.emit("select");
          }

          const reachedEnd =
            direction === "next"
              ? reachedMin(offsetLocation.get())
              : reachedMax(offsetLocation.get());

          if (reachedEnd) {
            hasSettled = true;
            const constrainedLocation = constrain(location.get());
            location.set(constrainedLocation);
            target.set(location);
            stopEdgeScroll();
          }

          return edgeScrollBody;
        },
        useBaseFriction: noop,
        useBaseDuration: noop,
        useFriction: noop,
        useDuration: noop,
      };

      if (!edgeScrollActiveRef.current) {
        defaultScrollBodyRef.current = engine.scrollBody;
        edgeScrollActiveRef.current = true;
        engine.scrollBody = edgeScrollBody;
        engine.animation.start();
      }
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
        marginTop: "5rem",
      }}
      aria-label={isEs ? "Proyectos" : "Projects"}
    >
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
                transform: introActive ? "translate3d(0,0,0) scale(1)" : "translate3d(0,42px,0) scale(0.96)",
                transitionProperty: "transform",
                transitionDuration: "900ms",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: introActive ? `${140 + i * 110}ms` : "0ms",
                willChange: "transform",
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

      <motion.button
        initial={false}
        animate={{}}
        transition={{ duration: 0.3 }}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label={isEs ? "Proyecto anterior" : "Previous project"}
        className="v3-carousel-arrow v3-carousel-arrow--prev"
        style={{
          pointerEvents: introActive ? "auto" : "none",
          cursor: canScrollPrev ? "pointer" : "not-allowed",
        }}
      >
        ←
      </motion.button>
      <motion.button
        initial={false}
        animate={{}}
        transition={{ duration: 0.3 }}
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label={isEs ? "Proyecto siguiente" : "Next project"}
        className="v3-carousel-arrow v3-carousel-arrow--next"
        style={{
          pointerEvents: introActive ? "auto" : "none",
          cursor: canScrollNext ? "pointer" : "not-allowed",
        }}
      >
        →
      </motion.button>

      {/* ── Controls bar ── */}
      <motion.div
        initial={false}
        animate={{
          y: introActive ? 0 : 16,
        }}
        transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1], delay: introActive ? 0.42 : 0 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
      </motion.div>
    </section>
  );
}
