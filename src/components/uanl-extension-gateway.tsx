"use client";

import { motion } from "framer-motion";
import styles from "./uanl-extension-gateway.module.css";

const features = [
  "SIASE dashboard",
  "Nexus activity widget",
  "Kardex progress",
  "Schedule export",
];

export default function UANLExtensionGateway({ isActive = false }: { isActive?: boolean }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, rotateX: -60, y: 40 },
    show: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className={styles.screen} aria-labelledby="uanl-extension-title" style={{ perspective: 1200 }}>
      <div className={styles.inner}>
        <motion.div 
          className={styles.copy}
          variants={container}
          initial="hidden"
          animate={isActive ? "show" : "hidden"}
        >
          <motion.p className={styles.eyebrow} variants={item}>UANL Extension · MV3</motion.p>
          <motion.h2 id="uanl-extension-title" className={styles.title} variants={item}>
            UANL Interface+
          </motion.h2>
          <motion.p className={styles.lede} variants={item}>
            A browser extension that modernizes the UANL student portal: cleaner navigation,
            academic progress, Nexus context, and useful student workflows layered over legacy
            SIASE frames.
          </motion.p>

          <motion.div className={styles.featureGrid} variants={item}>
            {features.map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </motion.div>

          <motion.div className={styles.actions} variants={item}>
            <a className={styles.primary} href="https://uanl-interface.vercel.app" target="_blank" rel="noreferrer">
              View demo
            </a>
            <a className={styles.secondary} href="https://github.com/AlejoReyna/UANLInterface" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </motion.div>
        </motion.div>

        <div className={styles.media} aria-label="UANL Interface extension preview">
          <div className={styles.browser}>
            <div className={styles.browserBar}>
              <span />
              <span />
              <span />
              <strong>deimos.dgi.uanl.mx</strong>
              <em>U+</em>
            </div>
            <video autoPlay muted loop playsInline preload="metadata">
              <source src="/preview-siase.mp4" type="video/mp4" />
            </video>
          </div>
          <div className={styles.metrics} aria-hidden="true">
            <span>
              <strong>3</strong>
              frames
            </span>
            <span>
              <strong>MV3</strong>
              extension
            </span>
            <span>
              <strong>UANL</strong>
              palette
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
