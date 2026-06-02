"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./this-cafeteria-gateway.module.css";

const TECH_INTERVAL_MS = 2000;

const simpleIcon = (slug: string, color: string) => `https://cdn.simpleicons.org/${slug}/${color}`;

const techStack = [
  { label: ".NET 10", logo: simpleIcon("dotnet", "512BD4") },
  { label: "ASP.NET Core", logo: simpleIcon("dotnet", "512BD4") },
  { label: "Blazor", logo: simpleIcon("blazor", "512BD4") },
  { label: "PostgreSQL", logo: simpleIcon("postgresql", "4169E1") },
  {
    label: "AWS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
  },
  { label: "Ethereum", logo: simpleIcon("ethereum", "3C3C3D") },
  { label: "Solidity", logo: simpleIcon("solidity", "363636") },
  { label: "Docker", logo: simpleIcon("docker", "2496ED") },
  { label: "Nginx", logo: simpleIcon("nginx", "009639") },
  { label: "GitHub", logo: simpleIcon("github", "181717") },
];

const infraItems = [
  { service: "EC2 · GitHub Actions", detail: "Hosting and CI/CD deploys" },
  { service: "RDS PostgreSQL", detail: "Product, order, and wallet data" },
  { service: "S3", detail: "Receipt PDFs and static assets" },
  { service: "SQS", detail: "Wallet-status and order-processing queues" },
  { service: "SES", detail: "Transactional receipt email" },
  { service: "IAM", detail: "Role-based service access" },
] as const;

function CafeteriaHeroPreview({ animate = false }: { animate?: boolean }) {
  return (
    <section
      className={`${styles.editorialHero} ${animate ? styles.editorialHeroReady : ""}`}
      aria-hidden="true"
    >
      <div className={styles.heroMedia} aria-hidden="true" />
      <div className={styles.heroContent}>
        <p className={styles.heroEyebrow}>Est. 2024</p>
        <h1>
          A sanctuary for the <span className={styles.headlineItalic}>patient brewer.</span>
        </h1>
        <p className={styles.heroLede}>
          Embrace the slow living movement with seasonal coffee, manual brewing, and pastry made for
          lingering.
        </p>
        <div className={styles.heroActions}>
          <span className={`${styles.heroButton} ${styles.heroButtonDark}`}>Explore the menu</span>
          <span className={`${styles.heroButton} ${styles.heroButtonGhost}`}>Our story</span>
        </div>
      </div>
    </section>
  );
}

export default function ThisCafeteriaGateway({ isActive = false }: { isActive?: boolean }) {
  const [techIndex, setTechIndex] = useState(0);
  const activeTech = techStack[techIndex];

  useEffect(() => {
    if (!isActive) {
      setTechIndex(0);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setTechIndex((index) => (index + 1) % techStack.length);
    }, TECH_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isActive]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section className={styles.screen} aria-labelledby="this-cafeteria-title">
      <motion.div
        className={styles.previewLayer}
        aria-label="Artisanal Brew mobile hero preview"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
      >
        <a
          className={styles.previewCol}
          href="https://cafe.alexisreyna.dev"
          target="_blank"
          rel="noreferrer"
        >
          <CafeteriaHeroPreview animate={isActive} />
        </a>
      </motion.div>

      <motion.div
        className={styles.foreground}
        variants={container}
        initial="hidden"
        animate={isActive ? "show" : "hidden"}
      >
        <div className={styles.contentBlock}>
          <motion.h1 id="this-cafeteria-title" className={styles.title} variants={item}>
            Artisanal Brew
          </motion.h1>

          <motion.div className={styles.bodyGrid} variants={item}>
            <div className={styles.stackCopy}>
              <p className={styles.stackLead}>
                A cloud-ready ASP.NET commerce platform for specialty coffee with Blazor storefronts and
                Identity-protected order flows. Ethereum Sepolia powers token payments, staking, and rewards.
              </p>

              <dl className={styles.infraList}>
                {infraItems.map((item) => (
                  <div key={item.service} className={styles.infraRow}>
                    <dt className={styles.infraService}>{item.service}</dt>
                    <dd className={styles.infraDetail}>{item.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className={styles.carouselShell} aria-label="Artisanal Brew technical stack">
              <div className={styles.techRotator} aria-live="polite" aria-atomic="true">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeTech.label}
                    className={styles.techSpotlight}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <img className={styles.techSpotlightLogo} src={activeTech.logo} alt="" aria-hidden="true" />
                    <span className={styles.techSpotlightLabel}>{activeTech.label}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className={styles.actions}>
              <a className={styles.cta} href="https://cafe.alexisreyna.dev">
                Visit the cafe
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
