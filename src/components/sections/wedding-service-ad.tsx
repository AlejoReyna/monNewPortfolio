"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const CASES = [
  {
    id: "01",
    couple: "Andrea & Aldo",
    slug: "aldoyandrea.com",
    href: "https://aldoyandrea.com",
    video: "/wedding_preview.mp4",
    features: ["Full RSVP flow", "Google Maps integration", "Schedule timeline", "171 commits"],
    palette: ["#e8dcc8", "#c4a96f", "#8b7355"],
    description:
      "An immersive digital invitation that guided every guest from the first scroll to the ceremony seat — no paper, no confusion.",
  },
  {
    id: "02",
    couple: "Cindy & Jorge",
    slug: "cindy-s-wedding.vercel.app",
    href: "https://cindy-s-wedding.vercel.app",
    video: null,
    features: ["3D photo gallery", "Custom color system", "TypeScript 95%", "265 commits"],
    palette: ["#d4c5e2", "#9b7fb5", "#6b4f8a"],
    description:
      "A three-dimensional gallery experience that let guests relive every moment — from the engagement ring to the last dance.",
  },
];

/* ── palette ─── */
const W = {
  bg:      "#f8f5ea",    /* warm cream */
  bgDeep:  "#f0ece0",    /* slightly deeper cream */
  ink:     "#0a0a0c",    /* near-black text */
  inkMid:  "rgba(10,10,12,0.55)",
  inkDim:  "rgba(10,10,12,0.3)",
  gold:    "#b8912a",    /* muted gold readable on cream */
  goldDim: "rgba(184,145,42,0.15)",
  border:  "rgba(10,10,12,0.1)",
  borderStrong: "rgba(10,10,12,0.18)",
};

/* ── Reveal ─── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Case card ─── */
function CaseCard({ c, index }: { c: (typeof CASES)[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: "1 1 clamp(300px, 45%, 520px)",
        border: `1px solid ${W.borderStrong}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      {/* video / media */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "clamp(180px, 26vh, 280px)",
        overflow: "hidden",
        flexShrink: 0,
        background: W.bgDeep,
      }}>
        {c.video ? (
          <video
            autoPlay muted loop playsInline preload="metadata"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          >
            <source src={c.video} type="video/mp4" />
          </video>
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${c.palette[2]} 0%, ${c.palette[1]} 50%, ${c.palette[0]} 100%)`,
            opacity: 0.5,
          }} />
        )}

        {/* light gradient at bottom */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.85) 100%)",
        }} />

        {/* case badge */}
        <span style={{
          position: "absolute", top: 14, left: 16,
          fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
          fontSize: "0.5rem", letterSpacing: "0.28em", textTransform: "uppercase",
          color: W.gold,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(8px)",
          padding: "3px 8px",
          borderRadius: 2,
          border: `1px solid ${W.goldDim}`,
        }}>
          case {c.id}
        </span>

        {/* palette dots */}
        <div style={{ position: "absolute", bottom: 14, left: 16, display: "flex", gap: 5 }}>
          {c.palette.map((col) => (
            <span key={col} style={{
              width: 10, height: 10, borderRadius: "50%",
              background: col, border: "1px solid rgba(0,0,0,0.12)",
            }} />
          ))}
        </div>
      </div>

      {/* text */}
      <div style={{
        padding: "clamp(20px, 2.5vw, 32px)",
        display: "flex", flexDirection: "column", flex: 1,
      }}>
        <h3 style={{
          fontFamily: "var(--font-bebas, sans-serif)",
          fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
          lineHeight: 0.9, letterSpacing: "-0.01em",
          color: W.ink, margin: "0 0 14px",
        }}>
          {c.couple}
        </h3>

        <p style={{
          fontFamily: "var(--font-cormorant, serif)",
          fontStyle: "italic",
          fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)",
          lineHeight: 1.65, color: W.inkMid,
          margin: "0 0 24px",
        }}>
          {c.description}
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "7px 16px", marginBottom: 28,
        }}>
          {c.features.map((f) => (
            <span key={f} style={{
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.55rem", letterSpacing: "0.08em",
              textTransform: "uppercase", color: W.inkDim,
              borderBottom: `1px solid ${W.border}`,
              paddingBottom: 7,
            }}>
              ↳ {f}
            </span>
          ))}
        </div>

        <div style={{ marginTop: "auto" }}>
          <a
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.56rem", letterSpacing: "0.2em",
              textTransform: "uppercase", color: W.gold,
              textDecoration: "none",
              borderBottom: `1px solid ${W.goldDim}`,
              paddingBottom: "2px",
            }}
          >
            {c.slug} →
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main ─── */
export default function WeddingServiceAd() {
  return (
    <section style={{ background: W.bg, overflow: "hidden" }}>
      <style>{`
        @media (max-width: 720px) { .wedding-cases { flex-direction: column !important; } }
      `}</style>

      {/* header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        padding: "clamp(32px, 6vw, 56px) clamp(24px, 6vw, 80px)",
        borderBottom: `1px solid ${W.borderStrong}`,
        flexWrap: "wrap", gap: "1rem",
      }}>
        <Reveal>
          <div>
            <p style={{
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.6rem", letterSpacing: "0.3em",
              textTransform: "uppercase", color: W.gold,
              margin: "0 0 10px",
            }}>
              section 05 / services
            </p>
            <h2 style={{
              fontFamily: "var(--font-bebas, sans-serif)",
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              lineHeight: 0.92, letterSpacing: "-0.01em",
              color: W.ink, margin: 0,
            }}>
              Wedding<br />Invitations
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p style={{
            fontFamily: "var(--font-cormorant, serif)",
            fontStyle: "italic",
            fontSize: "clamp(1rem, 1.3vw, 1.2rem)",
            color: W.inkMid, maxWidth: 340,
            lineHeight: 1.65, margin: 0,
          }}>
            Digital wedding invitations that live on the web — not on a shelf. Every couple gets a custom build, from RSVP to gallery.
          </p>
        </Reveal>
      </div>

      {/* marquee */}
      <Reveal>
        <div style={{
          overflow: "hidden",
          padding: "clamp(18px, 2.5vw, 30px) clamp(24px, 6vw, 80px)",
          borderBottom: `1px solid ${W.border}`,
          background: W.bgDeep,
        }}>
          <p style={{
            fontFamily: "var(--font-bebas, sans-serif)",
            fontSize: "clamp(1.1rem, 2.5vw, 2rem)",
            letterSpacing: "0.1em", color: `${W.ink}22`,
            textTransform: "uppercase", margin: 0,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            custom build &nbsp;·&nbsp; RSVP flow &nbsp;·&nbsp; live URL &nbsp;·&nbsp; 3D gallery &nbsp;·&nbsp;
            timeline &nbsp;·&nbsp; maps &nbsp;·&nbsp; fully responsive &nbsp;·&nbsp; no templates
          </p>
        </div>
      </Reveal>

      {/* cards */}
      <div style={{
        padding: "clamp(32px, 5vw, 56px) clamp(24px, 6vw, 80px)",
        borderBottom: `1px solid ${W.borderStrong}`,
      }}>
        <div
          className="wedding-cases"
          style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px, 3vw, 36px)" }}
        >
          {CASES.map((c, i) => (
            <CaseCard key={c.id} c={c} index={i} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <Reveal delay={0.05}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "clamp(28px, 4vw, 48px) clamp(24px, 6vw, 80px)",
          flexWrap: "wrap", gap: "1.5rem",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.58rem", letterSpacing: "0.25em",
              textTransform: "uppercase", color: W.inkDim,
              margin: "0 0 8px",
            }}>
              Your day. Your URL. Your story.
            </p>
            <p style={{
              fontFamily: "var(--font-cormorant, serif)",
              fontStyle: "italic",
              fontSize: "clamp(1.4rem, 2.5vw, 2.1rem)",
              color: W.ink, margin: 0, lineHeight: 1.2,
            }}>
              Let&apos;s build something your guests will remember.
            </p>
          </div>

          <a
            href="mailto:alexis.rs@inverater.com?subject=Wedding%20Invitation%20Inquiry"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.62rem", letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#fff",
              background: W.ink,
              padding: "14px 28px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = W.gold)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = W.ink)}
          >
            Get in touch →
          </a>
        </div>
      </Reveal>
    </section>
  );
}
