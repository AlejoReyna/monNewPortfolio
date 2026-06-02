"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import styles from "./wedding-service-gateway.module.css";

const simpleIcon = (slug: string, color: string) => `https://cdn.simpleicons.org/${slug}/${color}`;

const techRowVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const techItemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
};

// Shared stack across Andrea-y-Aldo and Cindy-y-Jorge (weddings package.json).
const weddingTechStack = [
  { label: "Next.js", logo: simpleIcon("nextdotjs", "FFFFFF") },
  { label: "React", logo: simpleIcon("react", "FFFFFF") },
  { label: "TypeScript", logo: simpleIcon("typescript", "FFFFFF") },
  { label: "Tailwind CSS", logo: simpleIcon("tailwindcss", "FFFFFF") },
  { label: "Vercel", logo: simpleIcon("vercel", "FFFFFF") },
] as const;

const previewProjects = [
  {
    id: "andrea" as const,
    href: "https://aldoyandrea.com",
    label: "View deploy",
    stack: ["Next.js", "CSS Modules", "Framer Motion"],
    story: {
      title: "Andrea & Aldo",
      spec: "Production SPA — 2025",
      description: "Single Page Application de alto rendimiento optimizada para dispositivos móviles. Enfoque crítico en la velocidad de carga de recursos multimedia de alta resolución, animaciones fluidas y renderizado del lado del cliente sin bloqueos."
    }
  },
  {
    id: "cindy" as const,
    href: "https://cindy-s-wedding.vercel.app",
    label: "REVEALING IN AUGUST",
    stack: ["React", "TailwindCSS", "Vercel Optimization"],
    story: {
      title: "Cindy & Jorge",
      spec: "Interactive Core — 2026",
      description: "Arquitectura UI basada en maquetación fluida y adaptabilidad rigurosa de viewports. Implementación de carga diferida avanzada (Lazy Loading) y mitigación sistemática de errores de hidratación en ambientes SSR."
    }
  },
] as const;

const timerLabels = ["Días", "Horas", "Minutos", "Segundos"];

const getTimeLeft = (targetDate: string) => {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return [0, 0, 0, 0];
  }

  return [
    Math.floor(difference / (1000 * 60 * 60 * 24)),
    Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    Math.floor((difference % (1000 * 60)) / 1000),
  ];
};

const formatNumber = (value: number) => value.toString().padStart(2, "0");

function AndreaHeroPreview() {
  return (
    <div className={styles.heroShell}>
      <div className={styles.andreaOverlay} />
      <div className={styles.andreaTopOverlay} />

      <div className={styles.andreaContent}>
        <div className={styles.andreaDate}>SÁBADO 18 DE OCTUBRE</div>
        <div className={styles.andreaNames}>
          <h3>ANDREA</h3>
          <span>&amp;</span>
          <h3>ALDO</h3>
        </div>
        <p className={styles.andreaKicker}>ACOMPÁÑANOS A CELEBRAR</p>
        <span className={styles.andreaButton}>CONFIRMAR ASISTENCIA</span>
      </div>

      <div className={styles.andreaTimer}>
        <Countdown targetDate="2025-10-18T00:00:00" variant="andrea" />
      </div>
    </div>
  );
}

function CindyHeroPreview() {
  const cindy = "Cindy".split("");
  const jorge = "Jorge".split("");

  return (
    <div className={styles.heroShell}>
      <div className={styles.cindyVisualShell}>
        <div className={styles.cindyOverlay} />
      </div>

      <div className={styles.cindyContent}>
        <div className={styles.cindyTopSpacer} />
        <div className={styles.cindyCenterGroup}>
          <div>
            <h3 className={styles.cindyNamesText}>
              {cindy.map((char, index) => (
                <span key={`cindy-${index}`}>{char}</span>
              ))}
            </h3>
            <p className={styles.cindyAmpersand}>&amp;</p>
            <h3 className={styles.cindyNamesText}>
              {jorge.map((char, index) => (
                <span key={`jorge-${index}`}>{char}</span>
              ))}
            </h3>
          </div>
          <div className={styles.cindyDate}>22 de agosto de 2026</div>
        </div>

        <div className={styles.cindyBottomGroup}>
          <span className={styles.cindyButton}>
            <span className={styles.cindyButtonBorder} />
            <span className={styles.cindyButtonBg} />
            <span className={styles.cindyButtonLabel}>Confirma Tu Asistencia</span>
          </span>
          <div className={styles.cindyTimer}>
            <Countdown targetDate="2026-08-22T00:00:00" variant="cindy" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Countdown({ targetDate, variant }: { targetDate: string; variant: "andrea" | "cindy" }) {
  const [values, setValues] = useState([0, 0, 0, 0]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setValues(getTimeLeft(targetDate));
    const timer = window.setInterval(() => {
      setValues(getTimeLeft(targetDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  const currentValues = isMounted ? values : [0, 0, 0, 0];

  return (
    <div className={`${styles.countdown} ${styles[`${variant}Countdown`]}`}>
      {currentValues.map((value, index) => (
        <div className={styles.countdownItem} key={timerLabels[index]}>
          <div className={styles.countdownCard}>
            <div className={styles.countdownNumber}>{formatNumber(value)}</div>
            <div className={styles.countdownLabel}>{timerLabels[index]}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WeddingServiceGateway({ isActive = false }: { isActive?: boolean }) {
  const [hoveredId, setHoveredId] = useState<"andrea" | "cindy" | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={styles.screen} aria-labelledby="wedding-service-title">
      <motion.div 
        className={styles.previewLayer} 
        aria-label="Wedding invitation mobile hero previews"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
      >
        <div className={styles.previewGrid}>
          
          {/* COLUMNA IZQUIERDA: ANDREA */}
          <a
            className={`${styles.previewCol} ${styles.andreaCol}`}
            href={previewProjects[0].href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredId("andrea")}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Contenido original: Se desvanece por completo si la derecha (Cindy) tiene hover */}
            <motion.div 
              className={styles.innerPreviewWrapper}
              animate={{ opacity: hoveredId === "cindy" ? 0 : 1 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              style={{ pointerEvents: hoveredId === "cindy" ? "none" : "auto" }}
            >
              <AndreaHeroPreview />
              <div className={styles.colFooter}>
                <span className={`${styles.colHint} ${styles.colHintAction}`}>
                  {previewProjects[0].label}
                </span>
                <span className={styles.techStackBadge}>
                  {previewProjects[0].stack.join("  |  ")}
                </span>
              </div>
            </motion.div>

            {/* GRID OPUESTO: Muestra la info de CINDY cuando CINDY tiene hover */}
            <AnimatePresence>
              {hoveredId === "cindy" && (
                <motion.div 
                  className={styles.storyGrid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={styles.gridHeader}>
                    <span className={styles.gridSpec}>{previewProjects[1].story.spec}</span>
                    <h4 className={styles.gridTitle}>{previewProjects[1].story.title}</h4>
                  </div>
                  <div className={styles.gridBody}>
                    <p className={styles.gridDescription}>{previewProjects[1].story.description}</p>
                    <div className={styles.gridFooterStack}>
                      {previewProjects[1].stack.map((tech) => (
                        <span key={tech} className={styles.gridTechTag}>{tech}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </a>

          {/* COLUMNA DERECHA: CINDY */}
          <a
            className={`${styles.previewCol} ${styles.cindyCol}`}
            href={previewProjects[1].href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredId("cindy")}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Contenido original: Se desvanece por completo si la izquierda (Andrea) tiene hover */}
            <motion.div 
              className={styles.innerPreviewWrapper}
              animate={{ opacity: hoveredId === "andrea" ? 0 : 1 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              style={{ pointerEvents: hoveredId === "andrea" ? "none" : "auto" }}
            >
              <CindyHeroPreview />
              <div className={styles.colFooter}>
                <span className={`${styles.colHint} ${styles.colHintAction} ${styles.colHintActionWide}`}>
                  {previewProjects[1].label}
                </span>
                <span className={styles.techStackBadge}>
                  {previewProjects[1].stack.join("  |  ")}
                </span>
              </div>
            </motion.div>

            {/* GRID OPUESTO: Muestra la info de ANDREA cuando ANDREA tiene hover */}
            <AnimatePresence>
              {hoveredId === "andrea" && (
                <motion.div 
                  className={styles.storyGrid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={styles.gridHeader}>
                    <span className={styles.gridSpec}>{previewProjects[0].story.spec}</span>
                    <h4 className={styles.gridTitle}>{previewProjects[0].story.title}</h4>
                  </div>
                  <div className={styles.gridBody}>
                    <p className={styles.gridDescription}>{previewProjects[0].story.description}</p>
                    <div className={styles.gridFooterStack}>
                      {previewProjects[0].stack.map((tech) => (
                        <span key={tech} className={styles.gridTechTag}>{tech}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </a>

        </div>
      </motion.div>

      {/* FOREGROUND CENTRAL: Desaparece completamente al hacer hover */}
      <motion.div
        className={styles.foreground}
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={isActive ? { clipPath: "circle(150% at 50% 50%)" } : { clipPath: "circle(0% at 50% 50%)" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: "none" }} 
      >
        <div className={styles.foregroundInner}>
          <motion.div 
            className={styles.copyBlock}
            animate={{ opacity: hoveredId ? 0 : 1, y: hoveredId ? -15 : 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <h2 id="wedding-service-title" className={styles.title}>
              Wedding websites, beautifully made.
            </h2>
            <p className={styles.engineeringSubtitle}>
              Fluidly animated Single Page Applications featuring high-performance image optimization & strict mobile-first UI architecture.
            </p>

            <motion.ul
              className={styles.techRow}
              aria-label="Wedding invitation technical stack"
              variants={
                shouldReduceMotion
                  ? undefined
                  : techRowVariants
              }
              initial={shouldReduceMotion ? false : "hidden"}
              animate={isActive ? "show" : "hidden"}
            >
              {weddingTechStack.map((tech) => (
                <motion.li
                  key={tech.label}
                  className={styles.techItem}
                  variants={shouldReduceMotion ? undefined : techItemVariants}
                  initial={shouldReduceMotion ? false : undefined}
                >
                  <img className={styles.techItemLogo} src={tech.logo} alt="" aria-hidden="true" />
                  <span className={styles.techItemLabel}>{tech.label}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}