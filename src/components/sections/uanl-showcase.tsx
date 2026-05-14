"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─────────────────────────────────────────────
   Redact: wraps any child behind a solid bar
   that retracts right→left on viewport entry.
   The bar is the same colour as the page bg,
   so children are invisible until exposed.
───────────────────────────────────────────── */
function Redact({
  children,
  delay = 0,
  block = false,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  block?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", display: block ? "block" : "inline-block", ...style }}
    >
      {children}
      {/* the bar */}
      <motion.span
        aria-hidden
        initial={{ scaleX: 1 }}
        animate={inView ? { scaleX: 0 } : {}}
        transition={{ duration: 0.55, delay, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          background: "#08080a",
          transformOrigin: "right",
          display: "block",
          /* thin leading edge so you can see the bar peeling */
          borderLeft: "1.5px solid rgba(200,168,74,0.18)",
        }}
      />
    </div>
  );
}

/* ── stat block ───────────────────────────── */
function Stat({ label, value, suffix = "", delay }: {
  label: string; value: string | number; suffix?: string; delay: number;
}) {
  return (
    <Redact delay={delay} block>
      <div style={{ borderLeft: "1px solid rgba(200,168,74,0.25)", paddingLeft: 16 }}>
        <span style={{
          fontFamily: "var(--font-bebas, sans-serif)",
          fontSize: "clamp(2rem, 3.5vw, 3rem)",
          color: "#f8f5ea",
          lineHeight: 1,
          display: "block",
        }}>
          {value}{suffix}
        </span>
        <span style={{
          fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
          fontSize: "0.52rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          display: "block",
          marginTop: 4,
        }}>
          {label}
        </span>
      </div>
    </Redact>
  );
}

/* ── feature line ─────────────────────────── */
function Feature({ text, delay }: { text: string; delay: number }) {
  return (
    <Redact delay={delay} block>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        paddingBlock: 10,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <span style={{
          fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
          fontSize: "0.52rem",
          color: "rgba(200,168,74,0.55)",
        }}>◆</span>
        <span style={{
          fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
          fontSize: "0.62rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(248,245,234,0.5)",
        }}>
          {text}
        </span>
      </div>
    </Redact>
  );
}

/* ── mini browser mockup ──────────────────── */
function BrowserMockup() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <Redact delay={0.3} block style={{ width: "100%" }}>
      <div style={{
        width: "100%",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
        overflow: "hidden",
        background: "#0d0e10",
      }}>
        {/* chrome bar */}
        <div style={{
          height: 36,
          background: "#1a1b1f",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 8,
        }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.8 }} />
          ))}
          <div style={{
            marginLeft: 10, flex: 1, height: 20, borderRadius: 4,
            background: "#252629", display: "flex", alignItems: "center",
            paddingLeft: 10, maxWidth: 320,
          }}>
            <span style={{
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.5rem",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.05em",
            }}>
              deimos.dgi.uanl.mx/siase
            </span>
          </div>
          <div style={{
            marginLeft: "auto", width: 22, height: 22, borderRadius: 4,
            background: "linear-gradient(135deg, #003366 0%, #c8a84a 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.6rem", fontWeight: 700, color: "#fff",
            fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
          }}>U</div>
        </div>

        {/* portal layout */}
        <div style={{ display: "flex", height: "clamp(280px, 38vh, 420px)" }}>
          {/* sidebar */}
          <div style={{
            width: 52, background: "#003366",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            display: "flex", flexDirection: "column",
            alignItems: "center", padding: "12px 0", gap: 14,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 6,
              background: "rgba(200,168,74,0.2)",
              border: "1px solid rgba(200,168,74,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 8,
            }}>
              <span style={{ fontSize: "0.55rem", color: "#c8a84a", fontFamily: "monospace" }}>≡</span>
            </div>
            {["◉", "▦", "◇", "◈", "◎"].map((icon, i) => (
              <div key={i} style={{
                width: 30, height: 28, borderRadius: 5,
                background: i === 0 ? "rgba(200,168,74,0.15)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{
                  fontSize: "0.65rem",
                  color: i === 0 ? "rgba(200,168,74,0.9)" : "rgba(255,255,255,0.2)",
                }}>{icon}</span>
              </div>
            ))}
          </div>

          {/* dashboard */}
          <div style={{ flex: 1, background: "#0f1117", padding: "14px 16px", overflow: "hidden" }}>
            {/* greeting */}
            <div style={{ marginBottom: 12 }}>
              <span style={{
                fontFamily: "var(--font-space-mono, monospace)",
                fontSize: "0.5rem", color: "rgba(200,168,74,0.7)",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>Bienvenido, Alexis</span>
              <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                {["ITC • 9no sem", "Mat: 2167059", "Activo"].map((chip) => (
                  <span key={chip} style={{
                    fontFamily: "var(--font-space-mono, monospace)",
                    fontSize: "0.42rem", color: "rgba(255,255,255,0.35)",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 3, padding: "2px 6px",
                  }}>{chip}</span>
                ))}
              </div>
            </div>

            {/* credit bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "0.42rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>CRÉDITOS</span>
                <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "0.42rem", color: "rgba(200,168,74,0.7)" }}>187 / 220</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: "85%" } : {}}
                  transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "100%", background: "linear-gradient(90deg, #003366, #c8a84a)", borderRadius: 2 }}
                />
              </div>
            </div>

            {/* quick cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
              {[
                { label: "Horario", icon: "▤", sub: ".ics export" },
                { label: "Calificaciones", icon: "◈", sub: "notifs ON" },
                { label: "Kardex", icon: "◉", sub: "87 materias" },
                { label: "Nexus", icon: "⬡", sub: "3 pendientes" },
              ].map((card) => (
                <div key={card.label} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 5, padding: "7px 8px",
                }}>
                  <span style={{ fontSize: "0.6rem", color: "rgba(200,168,74,0.7)" }}>{card.icon}</span>
                  <div style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "0.42rem", color: "rgba(248,245,234,0.6)", letterSpacing: "0.05em", marginTop: 3 }}>{card.label}</div>
                  <div style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "0.38rem", color: "rgba(200,168,74,0.45)", marginTop: 1 }}>{card.sub}</div>
                </div>
              ))}
            </div>

            {/* nexus widget */}
            <div style={{ background: "rgba(0,51,102,0.12)", border: "1px solid rgba(0,51,102,0.4)", borderRadius: 5, padding: "7px 10px" }}>
              <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "0.4rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,168,74,0.55)" }}>
                Próximas entregas — Nexus
              </span>
              {["Proyecto Final · Compiladores", "Parcial 3 · Redes"].map((item, i) => (
                <div key={item} style={{
                  fontFamily: "var(--font-space-mono, monospace)", fontSize: "0.4rem",
                  color: "rgba(248,245,234,0.35)",
                  paddingTop: 4,
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : undefined,
                  marginTop: i > 0 ? 4 : 6,
                }}>↳ {item}</div>
              ))}
            </div>
          </div>
        </div>

        {/* scan line sweeps across after mockup is revealed */}
        <motion.div
          initial={{ top: "0%" }}
          animate={inView ? { top: "110%" } : {}}
          transition={{ duration: 0.7, delay: 1, ease: "linear" }}
          style={{
            position: "absolute",
            left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent, rgba(200,168,74,0.5), transparent)",
            pointerEvents: "none", zIndex: 10,
          }}
        />
      </div>
    </Redact>
  );
}

/* ── Main component ───────────────────────── */
const FEATURES = [
  "Modern dashboard — credit progress + ICS export",
  "Grade-change notifications via service worker",
  "Nexus upcoming deadlines (token auth + TTL fix)",
  "Searchable sidebar — 6 service categories",
  "Multi-frame content scripts: top, left, center",
  "Theme system: Institutional · Dark · Minimalist",
];

export default function UANLShowcase() {
  return (
    <section style={{ background: "transparent", overflow: "hidden" }}>
      <style>{`
        @media (max-width: 860px) { .uanl-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        padding: "clamp(32px, 6vw, 56px) clamp(24px, 6vw, 80px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexWrap: "wrap", gap: "1rem",
      }}>
        <div>
          <Redact delay={0.05} block>
            <p style={{
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.6rem", letterSpacing: "0.3em",
              textTransform: "uppercase", color: "rgba(200,168,74,0.82)", margin: "0 0 10px",
            }}>
              section 04 / open source
            </p>
          </Redact>

          <Redact delay={0.15} block>
            <h2 style={{
              fontFamily: "var(--font-bebas, sans-serif)",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              lineHeight: 0.9, letterSpacing: "-0.01em",
              color: "#f8f5ea", margin: 0,
            }}>
              SIASE<br />
              <span style={{ color: "rgba(200,168,74,0.9)" }}>Plus</span>
            </h2>
          </Redact>
        </div>

        <Redact delay={0.2}>
          <a
            href="https://github.com/AlejoReyna/theUANL"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.62rem", letterSpacing: "0.22em",
              textTransform: "uppercase", color: "rgba(200,168,74,0.7)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(200,168,74,0.3)",
              paddingBottom: "2px",
            }}
          >
            View on GitHub →
          </a>
        </Redact>
      </div>

      {/* body */}
      <div
        className="uanl-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px, 5vw, 64px)",
          padding: "clamp(32px, 5vw, 56px) clamp(24px, 6vw, 80px)",
        }}
      >
        {/* left */}
        <div>
          {/* tags */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {["Chrome Extension", "MV3", "TypeScript", "Vite + CRXJS"].map((t, i) => (
              <Redact key={t} delay={0.1 + i * 0.06}>
                <span style={{
                  fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
                  fontSize: "0.5rem", letterSpacing: "0.15em",
                  textTransform: "uppercase", color: "rgba(200,168,74,0.6)",
                  border: "1px solid rgba(200,168,74,0.2)",
                  borderRadius: 2, padding: "3px 8px",
                  display: "block",
                }}>{t}</span>
              </Redact>
            ))}
          </div>

          {/* description */}
          <Redact delay={0.28} block style={{ marginBottom: 32 }}>
            <p style={{
              fontFamily: "var(--font-cormorant, serif)",
              fontStyle: "italic",
              fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)",
              lineHeight: 1.65,
              color: "rgba(248,245,234,0.55)",
              margin: 0,
            }}>
              A second attempt to rebuild UANL&apos;s SIASE portal — this time as a seasoned dev. A Chrome extension that turns a 2000s-era iframe portal into a modern academic dashboard with live notifications, Nexus integration, and ICS schedule export.
            </p>
          </Redact>

          {/* features */}
          <div style={{ marginBottom: 36 }}>
            {FEATURES.map((f, i) => (
              <Feature key={f} text={f} delay={0.38 + i * 0.09} />
            ))}
          </div>

          {/* stats */}
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            <Stat label="commits" value={18} delay={0.9} />
            <Stat label="TypeScript" value="70" suffix="%" delay={1.0} />
            <Stat label="frame contexts" value={3} delay={1.1} />
          </div>
        </div>

        {/* right: browser mockup */}
        <BrowserMockup />
      </div>
    </section>
  );
}
