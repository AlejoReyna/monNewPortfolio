"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const CASES = [
  {
    id: "01",
    couple: "Andrea & Aldo",
    slug: "aldoyandrea.com",
    href: "https://aldoyandrea.com",
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
    features: ["3D photo gallery", "Custom color system", "TypeScript 95%", "265 commits"],
    palette: ["#d4c5e2", "#9b7fb5", "#6b4f8a"],
    description:
      "A three-dimensional gallery experience that let guests relive every moment — from the engagement ring to the last dance.",
  },
];

/* ── Fade-up reveal wrapper ─────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Case study card ────────────────────── */
function CaseCard({ c, index }: { c: (typeof CASES)[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, delay: 0.15 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "clamp(24px, 3vw, 40px)",
        overflow: "hidden",
        flex: "1 1 clamp(300px, 45%, 520px)",
      }}
    >
      {/* ambient glow */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${c.palette[1]}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* case number */}
      <span
        style={{
          fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
          fontSize: "0.55rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(200,168,74,0.6)",
          display: "block",
          marginBottom: 20,
        }}
      >
        case {c.id}
      </span>

      {/* couple name */}
      <h3
        style={{
          fontFamily: "var(--font-bebas, sans-serif)",
          fontSize: "clamp(2.4rem, 4.5vw, 4rem)",
          lineHeight: 0.9,
          letterSpacing: "-0.01em",
          color: "#f8f5ea",
          margin: "0 0 16px",
        }}
      >
        {c.couple}
      </h3>

      {/* description */}
      <p
        style={{
          fontFamily: "var(--font-cormorant, serif)",
          fontStyle: "italic",
          fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
          lineHeight: 1.6,
          color: "rgba(248,245,234,0.55)",
          margin: "0 0 28px",
        }}
      >
        {c.description}
      </p>

      {/* palette swatches */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {c.palette.map((col) => (
          <span
            key={col}
            title={col}
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: col,
              border: "1px solid rgba(255,255,255,0.12)",
              flexShrink: 0,
            }}
          />
        ))}
        <span
          style={{
            fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
            fontSize: "0.5rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            alignSelf: "center",
            marginLeft: 4,
          }}
        >
          custom palette
        </span>
      </div>

      {/* feature list */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 20px",
          marginBottom: 32,
        }}
      >
        {c.features.map((f) => (
          <span
            key={f}
            style={{
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.58rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(248,245,234,0.38)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              paddingBottom: 8,
            }}
          >
            ↳ {f}
          </span>
        ))}
      </div>

      {/* CTA */}
      <a
        href={c.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
          fontSize: "0.58rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(200,168,74,0.8)",
          textDecoration: "none",
          borderBottom: "1px solid rgba(200,168,74,0.3)",
          paddingBottom: "2px",
          transition: "color 0.2s, border-color 0.2s",
        }}
      >
        {c.slug} →
      </a>
    </motion.div>
  );
}

/* ── Main component ─────────────────────── */
export default function WeddingServiceAd() {
  return (
    <section style={{ background: "transparent", overflow: "hidden" }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          padding: "clamp(32px, 6vw, 56px) clamp(24px, 6vw, 80px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <Reveal>
          <div>
            <p
              style={{
                fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(200,168,74,0.82)",
                margin: "0 0 10px",
              }}
            >
              section 05 / services
            </p>
            <h2
              style={{
                fontFamily: "var(--font-bebas, sans-serif)",
                fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.01em",
                color: "#f8f5ea",
                margin: 0,
              }}
            >
              Wedding
              <br />
              Invitations
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p
            style={{
              fontFamily: "var(--font-cormorant, serif)",
              fontStyle: "italic",
              fontSize: "clamp(1rem, 1.3vw, 1.2rem)",
              color: "rgba(248,245,234,0.45)",
              maxWidth: 340,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Digital wedding invitations that live on the web — not on a shelf. Every couple gets a custom build, from RSVP to gallery.
          </p>
        </Reveal>
      </div>

      {/* ── Marquee tag line ── */}
      <Reveal>
        <div
          style={{
            overflow: "hidden",
            padding: "clamp(20px, 3vw, 36px) clamp(24px, 6vw, 80px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-bebas, sans-serif)",
              fontSize: "clamp(1.1rem, 2.5vw, 2rem)",
              letterSpacing: "0.08em",
              color: "rgba(200,168,74,0.18)",
              textTransform: "uppercase",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            custom build &nbsp;·&nbsp; RSVP flow &nbsp;·&nbsp; live URL &nbsp;·&nbsp; 3D gallery &nbsp;·&nbsp;
            timeline &nbsp;·&nbsp; maps &nbsp;·&nbsp; fully responsive &nbsp;·&nbsp; no templates
          </p>
        </div>
      </Reveal>

      {/* ── Case studies ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0,
          padding: "clamp(32px, 5vw, 56px) clamp(24px, 6vw, 80px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <style>{`
          @media (max-width: 720px) {
            .wedding-cases { flex-direction: column !important; }
            .wedding-case-divider { display: none !important; }
          }
        `}</style>
        <div
          className="wedding-cases"
          style={{ display: "flex", flexWrap: "wrap", gap: "clamp(24px, 4vw, 48px)", width: "100%" }}
        >
          {CASES.map((c, i) => (
            <CaseCard key={c.id} c={c} index={i} />
          ))}
        </div>
      </div>

      {/* ── Bottom CTA strip ── */}
      <Reveal delay={0.05}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "clamp(28px, 4vw, 48px) clamp(24px, 6vw, 80px)",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
                fontSize: "0.58rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.2)",
                margin: "0 0 8px",
              }}
            >
              Your day. Your URL. Your story.
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant, serif)",
                fontStyle: "italic",
                fontSize: "clamp(1.4rem, 2.5vw, 2.1rem)",
                color: "#f8f5ea",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Let&apos;s build something your guests will remember.
            </p>
          </div>

          <a
            href="mailto:alexis.rs@inverater.com?subject=Wedding%20Invitation%20Inquiry"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.62rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#08080a",
              background: "rgba(200,168,74,0.9)",
              padding: "14px 28px",
              textDecoration: "none",
              transition: "background 0.25s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(200,168,74,1)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(200,168,74,0.9)")}
          >
            Get in touch →
          </a>
        </div>
      </Reveal>
    </section>
  );
}
