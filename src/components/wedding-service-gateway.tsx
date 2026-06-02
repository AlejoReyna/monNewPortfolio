"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./wedding-service-gateway.module.css";

const previewProjects = [
  {
    id: "andrea",
    href: "https://aldoyandrea.com",
  },
  {
    id: "cindy",
    href: "https://cindy-s-wedding.vercel.app",
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

  useEffect(() => {
    setValues(getTimeLeft(targetDate));
    const timer = window.setInterval(() => {
      setValues(getTimeLeft(targetDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={`${styles.countdown} ${styles[`${variant}Countdown`]}`}>
      {values.map((value, index) => (
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
          <a
            className={`${styles.previewCol} ${styles.andreaCol}`}
            href={previewProjects[0].href}
            target="_blank"
            rel="noreferrer"
          >
            <AndreaHeroPreview />
          </a>

          <a
            className={`${styles.previewCol} ${styles.cindyCol}`}
            href={previewProjects[1].href}
            target="_blank"
            rel="noreferrer"
          >
            <CindyHeroPreview />
          </a>
        </div>
      </motion.div>

      <motion.div 
        className={styles.foreground}
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={isActive ? { clipPath: "circle(150% at 50% 50%)" } : { clipPath: "circle(0% at 50% 50%)" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
          <div className={styles.copyBlock}>
            <h2 id="wedding-service-title" className={styles.title}>
              Wedding invitations, engineered.
            </h2>
            <p className={styles.lede}>
              Bespoke wedding websites with cinematic invitations, guest-friendly RSVP flows,
              schedules, galleries, maps, and the production details couples need before the day
              arrives.
            </p>
          </div>

          <div className={styles.actions}>
            <a className={styles.primary} href="https://aldoyandrea.com" target="_blank" rel="noreferrer">
              View live invitation
            </a>
            <a
              className={styles.secondary}
              href="mailto:alexis.rs@inverater.com?subject=Wedding%20website%20service"
            >
              Build one
            </a>
          </div>
        </motion.div>
    </section>
  );
}
