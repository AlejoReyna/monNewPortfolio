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
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 1.1 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const carouselDock = {
    hidden: { opacity: 0, y: "100%" },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const, delay: 0.45 },
    },
  };

  return (
    <section className={styles.screen} aria-labelledby="this-cafeteria-title">
      <motion.div
        className={styles.content}
        variants={container}
        initial="hidden"
        animate={isActive ? "show" : "hidden"}
      >
        <motion.h1 id="this-cafeteria-title" className={styles.title} variants={item}>
          Artisanal Brew
        </motion.h1>
        <motion.p className={styles.stackLead} variants={item}>
          A cloud-ready ASP.NET commerce platform for specialty coffee, pairing durable product
          and order flows with Identity access, Blazor interfaces, AWS services, and Ethereum
          Sepolia token payments, staking, and rewards.
        </motion.p>

        <motion.div className={styles.actions} variants={item}>
          <a className={styles.cta} href="https://cafe.alexisreyna.dev">
            Visit the cafe
          </a>
          <span className={styles.status}>Clean Architecture · Web3 commerce · AWS-ready backend</span>
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.carouselShell}
        aria-label="Artisanal Brew technical stack"
        variants={carouselDock}
        initial="hidden"
        animate={isActive ? "show" : "hidden"}
      >
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
      </motion.div>
    </section>
  );
}
