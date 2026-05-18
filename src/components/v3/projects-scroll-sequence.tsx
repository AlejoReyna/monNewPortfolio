"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { PROJECTS } from "@/components/v3/data/projects";
import "@/components/v3/v3.css";

/* ─── tiny helpers ─────────────────────────── */
function MediaCell({ project }: { project: (typeof PROJECTS)[number] }) {
  if (!project.media) return null;

  if (project.mediaType === "video") {
    return (
      <video
        autoPlay muted loop playsInline preload="metadata"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      >
        <source src={project.media} type="video/mp4" />
      </video>
    );
  }

  return (
    <Image
      src={project.media}
      alt={project.title}
      fill
      sizes="(min-width: 768px) 60vw, 90vw"
      className="object-cover"
      unoptimized={project.media.startsWith("http")}
    />
  );
}

/* ─── Main component ───────────────────────── */
export default function ProjectsScrollSequence() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: false,
  });

  const [selected, setSelected] = useState(0);
  const total = PROJECTS.length;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section
      id="work"
      style={{
        background: "transparent",
        padding: "0",
        overflow: "hidden",
      }}
    >
      {/* ── Section header ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "clamp(32px, 6vw, 56px) clamp(24px, 6vw, 80px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        gap: "1rem",
        flexWrap: "wrap",
      }}>
        <div>
          <p style={{
            fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(200,168,74,0.82)",
            margin: "0 0 10px",
          }}>
            section 03 / work
          </p>
          <h2 style={{
            fontFamily: "var(--font-bebas, sans-serif)",
            fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.01em",
            color: "#f8f5ea",
            margin: 0,
          }}>
            My Projects
          </h2>
        </div>

        {/* counter + arrows */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{
            fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            color: "rgba(248,245,234,0.35)",
            textTransform: "uppercase",
          }}>
            {String(selected + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>

          <div style={{ display: "flex", gap: "8px" }}>
            {[{ fn: prev, label: "←" }, { fn: next, label: "→" }].map(({ fn, label }) => (
              <button
                key={label}
                onClick={fn}
                className="v3-carousel-arrow"
                aria-label={label === "←" ? "Previous" : "Next"}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Embla viewport ── */}
      <div
        ref={emblaRef}
        style={{ overflow: "hidden", padding: "clamp(24px, 4vw, 48px) 0" }}
      >
        <div style={{ display: "flex", gap: "clamp(12px, 2vw, 24px)", paddingInline: "clamp(24px, 6vw, 80px)" }}>
          {PROJECTS.map((project, i) => (
            <div
              key={project.id}
              style={{
                flex: "0 0 clamp(300px, 80vw, 620px)",
                minWidth: 0,
              }}
            >
              {/* Card */}
              <div
                className="v3-carousel-card"
                style={{
                  height: "clamp(520px, 72vh, 720px)",
                  opacity: i === selected ? 1 : 0.45,
                  transform: i === selected ? "scale(1)" : "scale(0.97)",
                  transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                {/* ghost numeral */}
                <span className="v3-carousel-ghost" aria-hidden>{project.ghost}</span>

                {/* eyebrow */}
                <span className="v3-carousel-eyebrow">{project.badge}</span>

                {/* media */}
                {project.media && (
                  <div className="v3-carousel-media">
                    <div className="v3-carousel-media-inner" style={{ position: "relative", width: "100%", height: "100%" }}>
                      <MediaCell project={project} />
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, #08080a 0%, transparent 55%)",
                      }} />
                    </div>
                  </div>
                )}

                {/* badge */}
                <span className="v3-carousel-badge">{project.id}</span>

                {/* title */}
                <h3 className="v3-carousel-title">{project.title}</h3>

                {/* tagline */}
                <p className="v3-carousel-tagline">{project.tagline.en}</p>

                {/* description */}
                <p className="v3-carousel-desc">{project.description.en}</p>

                {/* tags */}
                <div className="v3-carousel-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="v3-carousel-tag">{tag}</span>
                  ))}
                </div>

                {/* links */}
                <div className="v3-carousel-links">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="v3-carousel-link"
                    >
                      {link.label.en}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Dot navigation ── */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "8px",
        paddingBottom: "clamp(32px, 5vw, 56px)",
      }}>
        {PROJECTS.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to project ${i + 1}`}
            style={{
              width: i === selected ? "24px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: i === selected ? "rgba(200,168,74,0.9)" : "rgba(255,255,255,0.15)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.35s cubic-bezier(0.22,1,0.36,1), background 0.3s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
