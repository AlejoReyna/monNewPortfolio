"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── UANL institutional palette ─────────────────── */
const U = {
  navy:    "#002E6D",
  navyDim: "#001F4D",
  gold:    "#F5B800",
  goldDim: "rgba(245,184,0,0.18)",
  goldText:"rgba(245,184,0,0.85)",
};

/* ── Rise: staggered fade-up after curtains open ─── */
function Rise({
  children, delay = 0, style, className,
}: {
  children: React.ReactNode; delay?: number;
  style?: React.CSSProperties; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style} className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Feature line ───────────────────────────────── */
function Feature({ text, delay }: { text: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        paddingBlock: 10,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <span style={{
        fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
        fontSize: "0.52rem", color: U.goldText,
      }}>◆</span>
      <span style={{
        fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
        fontSize: "0.62rem", letterSpacing: "0.08em",
        textTransform: "uppercase", color: "rgba(248,245,234,0.5)",
      }}>{text}</span>
    </motion.div>
  );
}

/* ── Stat block ─────────────────────────────────── */
function Stat({ label, value, suffix = "", delay }: {
  label: string; value: string | number; suffix?: string; delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderLeft: `2px solid ${U.gold}44`, paddingLeft: 16 }}
    >
      <span style={{
        fontFamily: "var(--font-bebas, sans-serif)",
        fontSize: "clamp(2rem, 3.5vw, 3rem)",
        color: "#f8f5ea", lineHeight: 1, display: "block",
      }}>{value}{suffix}</span>
      <span style={{
        fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
        fontSize: "0.52rem", letterSpacing: "0.2em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
        display: "block", marginTop: 4,
      }}>{label}</span>
    </motion.div>
  );
}

/* ── Torch SVG ──────────────────────────────────── */
function Torch({ size = 28, opacity = 0.7 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 28 42" fill="none" style={{ opacity }}>
      {/* flame */}
      <ellipse cx="14" cy="10" rx="5" ry="7" fill={U.gold} opacity="0.9"/>
      <ellipse cx="14" cy="12" rx="3" ry="5" fill="#fff" opacity="0.4"/>
      <path d="M11 14 Q14 8 17 14 Q15 18 14 16 Q13 18 11 14Z" fill={U.gold}/>
      {/* handle */}
      <rect x="12" y="17" width="4" height="14" rx="2" fill="rgba(245,184,0,0.6)"/>
      <rect x="10" y="29" width="8" height="3" rx="1.5" fill="rgba(245,184,0,0.5)"/>
      <rect x="9" y="31" width="10" height="4" rx="2" fill="rgba(245,184,0,0.35)"/>
    </svg>
  );
}

/* ── Browser mockup ─────────────────────────────── */
function BrowserMockup({ sectionInView }: { sectionInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={sectionInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "100%",
        border: `1px solid ${U.navy}88`,
        borderRadius: 8, overflow: "hidden",
        background: "#0a0c12", position: "relative",
        boxShadow: `0 0 40px ${U.goldDim}`,
      }}
    >
      {/* chrome bar */}
      <div style={{
        height: 36, background: "#141720",
        borderBottom: `1px solid ${U.navy}66`,
        display: "flex", alignItems: "center", padding: "0 14px", gap: 8,
      }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.8 }} />
        ))}
        <div style={{
          marginLeft: 10, flex: 1, height: 20, borderRadius: 4,
          background: "#1e2230", display: "flex", alignItems: "center",
          paddingLeft: 10, maxWidth: 320,
        }}>
          <span style={{
            fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
            fontSize: "0.5rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em",
          }}>deimos.dgi.uanl.mx/siase</span>
        </div>
        {/* UANL extension badge */}
        <div style={{
          marginLeft: "auto", width: 24, height: 24, borderRadius: 5,
          background: `linear-gradient(135deg, ${U.navy} 0%, ${U.gold} 130%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.55rem", fontWeight: 800, color: "#fff",
          fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
          letterSpacing: "-0.03em",
          boxShadow: `0 0 8px ${U.goldDim}`,
        }}>U+</div>
      </div>

      {/* portal */}
      <div style={{ display: "flex", height: "clamp(280px, 38vh, 420px)" }}>

        {/* UANL sidebar */}
        <div style={{
          width: 56, background: U.navy,
          borderRight: `1px solid ${U.gold}22`,
          display: "flex", flexDirection: "column",
          alignItems: "center", padding: "14px 0", gap: 12,
        }}>
          {/* torch icon at top */}
          <div style={{ marginBottom: 6 }}>
            <Torch size={18} opacity={0.9} />
          </div>
          {/* nav icons */}
          {["◉", "▦", "◇", "◈", "◎", "⬡"].map((icon, i) => (
            <div key={i} style={{
              width: 32, height: 28, borderRadius: 5,
              background: i === 0 ? `${U.gold}20` : "transparent",
              borderLeft: i === 0 ? `2px solid ${U.gold}` : "2px solid transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontSize: "0.6rem",
                color: i === 0 ? U.gold : "rgba(255,255,255,0.22)",
              }}>{icon}</span>
            </div>
          ))}
          {/* motto at bottom */}
          <div style={{ marginTop: "auto", paddingBottom: 8 }}>
            <span style={{
              display: "block",
              fontFamily: "var(--font-space-mono, monospace)",
              fontSize: "0.3rem",
              color: `${U.gold}55`,
              letterSpacing: "0.05em",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              textTransform: "uppercase",
            }}>UANL · 1933</span>
          </div>
        </div>

        {/* dashboard */}
        <div style={{ flex: 1, background: "#0f1117", padding: "14px 16px", overflow: "hidden" }}>
          {/* header strip */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", marginBottom: 12,
          }}>
            <div>
              <span style={{
                fontFamily: "var(--font-space-mono, monospace)",
                fontSize: "0.52rem", color: U.goldText,
                letterSpacing: "0.08em", textTransform: "uppercase",
                display: "block",
              }}>Bienvenido, Alexis ◎</span>
              <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
                {["ITC · 9°sem", "Mat: 2167059", "Activo"].map((chip, ci) => (
                  <span key={chip} style={{
                    fontFamily: "var(--font-space-mono, monospace)",
                    fontSize: "0.38rem", color: ci === 2 ? U.goldText : "rgba(255,255,255,0.35)",
                    background: ci === 2 ? `${U.gold}12` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${ci === 2 ? U.gold + "33" : "rgba(255,255,255,0.07)"}`,
                    borderRadius: 3, padding: "2px 6px",
                  }}>{chip}</span>
                ))}
              </div>
            </div>
            {/* small escudo placeholder */}
            <div style={{
              width: 28, height: 28, borderRadius: 4,
              background: `linear-gradient(135deg, ${U.navy}, ${U.navyDim})`,
              border: `1px solid ${U.gold}33`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Torch size={11} opacity={0.8} />
            </div>
          </div>

          {/* credit progress */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "0.4rem", color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Créditos</span>
              <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "0.4rem", color: U.goldText }}>187 / 220</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={sectionInView ? { width: "85%" } : {}}
                transition={{ duration: 1.4, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: "100%", background: `linear-gradient(90deg, ${U.navy}, ${U.gold})`, borderRadius: 2 }}
              />
            </div>
          </div>

          {/* quick cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 10 }}>
            {[
              { label: "Horario", icon: "▤", sub: ".ics export" },
              { label: "Calificaciones", icon: "◈", sub: "notifs ON" },
              { label: "Kardex", icon: "◉", sub: "87 materias" },
              { label: "Nexus", icon: "⬡", sub: "3 pendientes" },
            ].map((card) => (
              <div key={card.label} style={{
                background: `${U.navy}10`,
                border: `1px solid ${U.navy}44`,
                borderRadius: 5, padding: "7px 8px",
              }}>
                <span style={{ fontSize: "0.58rem", color: U.goldText }}>{card.icon}</span>
                <div style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "0.4rem", color: "rgba(248,245,234,0.6)", letterSpacing: "0.04em", marginTop: 3 }}>{card.label}</div>
                <div style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "0.35rem", color: `${U.gold}66`, marginTop: 1 }}>{card.sub}</div>
              </div>
            ))}
          </div>

          {/* nexus widget */}
          <div style={{
            background: `${U.navy}18`,
            border: `1px solid ${U.navy}55`,
            borderLeft: `2px solid ${U.gold}88`,
            borderRadius: 5, padding: "7px 10px",
          }}>
            <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "0.38rem", letterSpacing: "0.12em", textTransform: "uppercase", color: U.goldText, opacity: 0.7 }}>
              Próximas entregas — Nexus
            </span>
            {["Proyecto Final · Compiladores", "Parcial 3 · Redes"].map((item, i) => (
              <div key={item} style={{
                fontFamily: "var(--font-space-mono, monospace)", fontSize: "0.38rem",
                color: "rgba(248,245,234,0.32)", paddingTop: 4,
                borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : undefined,
                marginTop: i > 0 ? 4 : 5,
              }}>↳ {item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* scan line */}
      <motion.div
        initial={{ top: "0%" }}
        animate={sectionInView ? { top: "110%" } : {}}
        transition={{ duration: 0.8, delay: 1.6, ease: "linear" }}
        style={{
          position: "absolute", left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${U.gold}88, transparent)`,
          pointerEvents: "none", zIndex: 10,
        }}
      />
    </motion.div>
  );
}

/* ── Main component ─────────────────────────────── */
const FEATURES = [
  "Dashboard moderno — progreso de créditos + ICS",
  "Notificaciones de calificaciones (service worker)",
  "Widget de Nexus con autenticación y fix de TTL",
  "Barra lateral con 6 categorías de servicios",
  "Content scripts en 3 frames: top, left, center",
  "Sistema de temas: Institucional · Dark · Minimal",
];

export default function UANLShowcase() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-120px" });

  return (
    <section ref={sectionRef} style={{ background: "transparent", overflow: "hidden", position: "relative" }}>
      <style>{`
        @media (max-width: 860px) { .uanl-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ══ CURTAIN REVEAL ══════════════════════════════
          Seam glows UANL gold → curtains part outward.
      ════════════════════════════════════════════════ */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: [0, 1, 0] } : {}}
        transition={{ duration: 0.45, delay: 0.05, times: [0, 0.3, 1] }}
        style={{
          position: "absolute", top: 0, bottom: 0,
          left: "calc(50% - 1px)", width: 2,
          background: U.gold,
          boxShadow: `0 0 20px 8px ${U.gold}55`,
          zIndex: 20, pointerEvents: "none",
        }}
      />
      <motion.div
        aria-hidden
        initial={{ x: 0 }}
        animate={inView ? { x: "-100%" } : {}}
        transition={{ duration: 1.05, delay: 0.18, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute", top: 0, left: 0, bottom: 0, width: "50%",
          background: `linear-gradient(to right, #08080a 82%, ${U.navy}18 100%)`,
          zIndex: 15, pointerEvents: "none",
        }}
      />
      <motion.div
        aria-hidden
        initial={{ x: 0 }}
        animate={inView ? { x: "100%" } : {}}
        transition={{ duration: 1.05, delay: 0.18, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute", top: 0, right: 0, bottom: 0, width: "50%",
          background: `linear-gradient(to left, #08080a 82%, ${U.navy}18 100%)`,
          zIndex: 15, pointerEvents: "none",
        }}
      />

      {/* ── Section header ── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        padding: "clamp(32px, 6vw, 56px) clamp(24px, 6vw, 80px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexWrap: "wrap", gap: "1rem",
      }}>
        <div>
          <Rise delay={0.7}>
            <p style={{
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.6rem", letterSpacing: "0.3em",
              textTransform: "uppercase", color: "rgba(200,168,74,0.82)", margin: "0 0 10px",
            }}>
              section 04 / open source
            </p>
          </Rise>

          {/* Title + shimmer */}
          <motion.div
            style={{ position: "relative", display: "inline-block", overflow: "hidden" }}
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 style={{
              fontFamily: "var(--font-bebas, sans-serif)",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              lineHeight: 0.9, letterSpacing: "-0.01em",
              color: "#f8f5ea", margin: 0,
            }}>
              SIASE<br />
              <span style={{ color: U.gold }}>Plus</span>
            </h2>
            {/* UANL motto under title */}
            <p style={{
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.48rem", letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: `${U.gold}55`,
              margin: "10px 0 0",
            }}>
              Alere Flammam Veritatis · UANL 1933
            </p>
            {/* shimmer sweep */}
            <motion.span
              aria-hidden
              initial={{ x: "-110%" }}
              animate={inView ? { x: "130%" } : {}}
              transition={{ duration: 0.65, delay: 1.1, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(105deg, transparent 30%, ${U.gold}55 50%, transparent 70%)`,
                pointerEvents: "none", display: "block",
              }}
            />
          </motion.div>
        </div>

        <Rise delay={0.85} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Torch size={16} opacity={0.6} />
            <span style={{
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.5rem", letterSpacing: "0.18em",
              textTransform: "uppercase", color: `${U.gold}66`,
            }}>
              Chrome Extension · MV3
            </span>
          </div>
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
            Ver en GitHub →
          </a>
        </Rise>
      </div>

      {/* ── Body grid ── */}
      <div
        className="uanl-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px, 5vw, 64px)",
          padding: "clamp(32px, 5vw, 56px) clamp(24px, 6vw, 80px)",
        }}
      >
        {/* left column */}
        <div>
          {/* tags */}
          <Rise delay={0.9}>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {["TypeScript", "Vite + CRXJS", "MV3", "Shadow DOM"].map((t) => (
                <span key={t} style={{
                  fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
                  fontSize: "0.5rem", letterSpacing: "0.12em",
                  textTransform: "uppercase", color: `${U.gold}88`,
                  border: `1px solid ${U.gold}22`,
                  borderRadius: 2, padding: "3px 8px",
                }}>{t}</span>
              ))}
            </div>
          </Rise>

          {/* description */}
          <Rise delay={1.0} style={{ marginBottom: 32 }}>
            <p style={{
              fontFamily: "var(--font-cormorant, serif)",
              fontStyle: "italic",
              fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)",
              lineHeight: 1.65,
              color: "rgba(248,245,234,0.55)",
              margin: 0,
            }}>
              Todo estudiante UANL pasa años peleando contra SIASE — el portal más odiado del campus. Esta extensión es la respuesta: un dashboard moderno, notificaciones de calificaciones en tiempo real e integración con Nexus, corriendo sobre el mismo iframe de siempre.
            </p>
          </Rise>

          {/* features */}
          <div style={{ marginBottom: 36 }}>
            {FEATURES.map((f, i) => (
              <Feature key={f} text={f} delay={1.05 + i * 0.08} />
            ))}
          </div>

          {/* stats */}
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            <Stat label="commits" value={18} delay={1.5} />
            <Stat label="TypeScript" value="70" suffix="%" delay={1.6} />
            <Stat label="estudiantes UANL" value="200K+" delay={1.7} />
          </div>
        </div>

        {/* right: browser mockup */}
        <BrowserMockup sectionInView={inView} />
      </div>
    </section>
  );
}
