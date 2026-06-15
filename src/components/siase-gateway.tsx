"use client";

import { motion } from "framer-motion";
import styles from "./siase-gateway.module.css";

// SIASE Plus — MV3 extension that modernizes the UANL student portal.
const REPO_URL = "https://github.com/AlejoReyna/theUANL";
// TODO: swap for a live demo/landing URL if one is published.
const DEMO_URL = "https://github.com/AlejoReyna/theUANL#readme";

const simpleIcon = (slug: string, color = "eaf2ff") =>
  `https://cdn.simpleicons.org/${slug}/${color}`;

const techStack = [
  { label: "React", logo: simpleIcon("react") },
  { label: "TypeScript", logo: simpleIcon("typescript") },
  { label: "Vite", logo: simpleIcon("vite") },
  { label: "Tailwind CSS", logo: simpleIcon("tailwindcss") },
  { label: "Framer Motion", logo: simpleIcon("framer") },
  { label: "Google Chrome", logo: simpleIcon("googlechrome") },
] as const;

export default function SiaseGateway({ isActive = false }: { isActive?: boolean }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  // The status badge + tech stack are the last things to animate in.
  const badgeContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 1.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const logoGroup = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
  };

  const logoItem = {
    hidden: { opacity: 0, y: 12, scale: 0.85 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const renderTechItems = () =>
    techStack.map((tech) => (
      <motion.li key={tech.label} className={styles.techChip} variants={logoItem}>
        <img
          className={styles.techLogo}
          src={tech.logo}
          alt={tech.label}
          title={tech.label}
          loading="lazy"
        />
      </motion.li>
    ));

  return (
    <section className={styles.screen} aria-labelledby="siase-title">
      <motion.div
        className={styles.backgroundCol}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
      >
        <div className={styles.scheduleGrid} aria-hidden="true" />
        <div className={styles.aurora} aria-hidden="true" />
      </motion.div>

      <motion.div
        className={styles.deployBadge}
        variants={badgeContainer}
        initial="hidden"
        animate={isActive ? "show" : "hidden"}
      >
        <motion.span className={styles.deployPill} variants={item}>
          <span className={styles.deployDot} aria-hidden="true" />
          Chrome · Manifest V3
        </motion.span>

        <motion.ul
          className={`${styles.techRow} ${styles.techRowTop}`}
          variants={logoGroup}
          aria-label="SIASE Plus tech stack"
        >
          {renderTechItems()}
        </motion.ul>
      </motion.div>

      <motion.div
        className={styles.foreground}
        variants={container}
        initial="hidden"
        animate={isActive ? "show" : "hidden"}
      >
        <div className={styles.content}>
          <motion.h1 id="siase-title" className={styles.wordmark} variants={item}>
            SIASE<span className={styles.wordmarkAccent}>+</span>
          </motion.h1>

          <motion.p className={styles.subtitle} variants={item}>
            Modernizing the UANL student portal
          </motion.p>

          <motion.p className={styles.lead} variants={item}>
            A <span className={styles.leadAccent}>Manifest V3 Chrome extension</span> that reskins
            UANL&apos;s legacy SIASE portal into a clean academic dashboard — without breaking its
            original navigation. It caches grades and schedules, sends grade-change notifications
            from a background worker, parses your timetable, and exports it to Google Calendar,
            Outlook, or an <span className={styles.leadAccent}>.ics</span> file.
          </motion.p>

          <motion.div className={styles.actions} variants={item}>
            <a className={styles.ctaPrimary} href={DEMO_URL} target="_blank" rel="noreferrer">
              View project <span aria-hidden="true">→</span>
            </a>
            <a className={styles.ctaSecondary} href={REPO_URL} target="_blank" rel="noreferrer">
              Repo <span aria-hidden="true">↗</span>
            </a>
          </motion.div>

          <motion.ul
            className={`${styles.techRow} ${styles.techRowBottom}`}
            variants={logoGroup}
            aria-label="SIASE Plus tech stack"
          >
            {renderTechItems()}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
}
