"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
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
  isActive: boolean;
  videoRef: (el: HTMLVideoElement | null) => void;
}

function ProjectCard({ project, isActive, videoRef }: CardProps) {
  return (
    <article
      className="v3-carousel-card"
      aria-label={project.title}
      style={{ transform: "scale(1)" }}
    >
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
    </article>
  );
}

const BUILD_NOTES: Record<string, { es: string; en: string }> = {
  "plebes-dao": {
    es: "Construí esto como una mezcla rara entre gobernanza, cultura de internet y producto cripto que tenía que sentirse vivo, no corporativo.",
    en: "I built this as a weird mix of governance, internet culture and crypto product work that had to feel alive, not corporate.",
  },
  "andrea-aldo": {
    es: "Este fue más delicado: la interfaz tenía que sentirse íntima, útil y emocional sin romper el flujo de una boda real.",
    en: "This one was delicate: the interface had to feel intimate, useful and emotional without getting in the way of a real wedding.",
  },
  "mk1-presale": {
    es: "Aquí me fui por impacto rápido: una landing que se entendiera en segundos, capturara leads y sostuviera el hype.",
    en: "Here I chased fast impact: a landing that made sense in seconds, captured leads and carried the hype.",
  },
  pokefolio: {
    es: "Lo armé como si el portfolio fuera un juego: diálogo, ritmo y pequeñas recompensas en vez de una página estática.",
    en: "I built it like the portfolio was a game: dialogue, rhythm and small rewards instead of a static page.",
  },
  "uanl-interface": {
    es: "Este fue puro rescate de UX: tomar pantallas heredadas, pelearme con frames viejos y devolverles algo usable.",
    en: "This was straight UX rescue work: taking legacy screens, fighting old frames and giving them something usable back.",
  },
  mpbot: {
    es: "Fue un sprint de hackathon: convertir DeFi en conversación, recortar lo innecesario y hacer que funcionara rápido.",
    en: "This was a hackathon sprint: turning DeFi into conversation, cutting the noise and making it work fast.",
  },
  birdlypay: {
    es: "La idea era simple y difícil: pagos on-chain que se sintieran tan naturales como compartir un enlace.",
    en: "The idea was simple and hard: on-chain payments that felt as natural as sharing a link.",
  },
};

function ProjectStickerPanel({ project, isEs }: { project: V3Project; isEs: boolean }) {
  const buildNote = BUILD_NOTES[project.id] ?? {
    es: "Construí esto iterando entre lo visual, lo técnico y lo raro hasta que empezó a sentirse propio.",
    en: "I built this by pushing between visuals, engineering and weird little details until it started feeling like its own thing.",
  };

  return (
    <aside className="v3-carousel-sticker-panel" aria-label={`${project.title} build note`}>
      <div className="v3-carousel-sticker-orbit">
        <div className="v3-carousel-build-note">
          <span className="v3-carousel-build-kicker">{isEs ? "bitacora" : "build log"}</span>
          <h3>{project.title}</h3>
          <p className="v3-carousel-build-dek">
            {isEs ? project.tagline.es : project.tagline.en}
          </p>
          <div className="v3-carousel-build-body">
            <p>{isEs ? project.description.es : project.description.en}</p>
            <p>{isEs ? buildNote.es : buildNote.en}</p>
          </div>
          <div className="v3-carousel-build-tags" aria-label="Stack">
            {project.tags.map((tag) => (
              <span key={tag}>
                <Github aria-hidden="true" size={12} strokeWidth={1.8} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
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

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = PROJECTS[activeIndex] ?? PROJECTS[0];
  const canScrollPrev = activeIndex > 0;
  const canScrollNext = activeIndex < TOTAL - 1;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.play().catch(() => {});
  }, [activeProject.id]);

  const scrollPrev = useCallback(() => {
    setActiveIndex((idx) => Math.max(0, idx - 1));
  }, []);

  const scrollNext = useCallback(() => {
    setActiveIndex((idx) => Math.min(TOTAL - 1, idx + 1));
  }, []);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [scrollNext, scrollPrev]);

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
      {/* ── Static project frame: only the content swaps. ── */}
      <div
        className="v3-carousel-static-viewport"
        style={{
          overflow: "hidden",
          padding: transparentBackdrop
            ? "calc(10svh + clamp(0.75rem, 2vh, 1.25rem)) 0 clamp(0.75rem, 2vh, 1.25rem)"
            : "clamp(1rem, 2.6vh, 2rem) 0 clamp(1rem, 2.6vh, 2rem)",
        }}
      >
        <div
          role="list"
          className="v3-carousel-static-stage"
          style={{
            paddingLeft: "clamp(1.5rem, 8vw, 5rem)",
            paddingRight: "clamp(1.5rem, 8vw, 5rem)",
          }}
        >
          <div
            className="v3-carousel-slide v3-carousel-slide--feature"
            role="listitem"
            aria-label={`${activeProject.title}, ${pad(activeIndex + 1)} de ${pad(TOTAL)}`}
            style={{
              transform: introActive ? "translate3d(0,0,0) scale(1)" : "translate3d(0,42px,0) scale(0.96)",
              transitionProperty: "transform",
              transitionDuration: "900ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: introActive ? "140ms" : "0ms",
              willChange: "transform",
            }}
          >
            <div className="v3-carousel-feature-grid">
              <ProjectCard
                project={activeProject}
                isActive
                videoRef={(el) => {
                  videoRef.current = el;
                }}
              />
              <ProjectStickerPanel project={activeProject} isEs={isEs} />
            </div>
          </div>
        </div>
      </div>

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
          bottom: transparentBackdrop ? "clamp(4rem, 7svh, 5.5rem)" : undefined,
          zIndex: transparentBackdrop ? 7 : undefined,
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
