"use client";

import { motion } from "framer-motion";
import styles from "./nonamedbot-gateway.module.css";

// TODO: replace with the live cascade-ai dashboard URL once confirmed.
const DEPLOYMENT_URL = "https://cascade-ai-dashboard.vercel.app";
const DOCS_URL = "https://github.com/AlejoReyna/no-named-yet-bot";

const simpleIcon = (slug: string, color = "e8f0ea") =>
  `https://cdn.simpleicons.org/${slug}/${color}`;

const techStack = [
  { label: "Python", logo: simpleIcon("python") },
  { label: "pandas", logo: simpleIcon("pandas") },
  { label: "NumPy", logo: simpleIcon("numpy") },
  { label: "CoinMarketCap", logo: simpleIcon("coinmarketcap") },
  { label: "pytest", logo: simpleIcon("pytest") },
  { label: "Next.js", logo: simpleIcon("nextdotjs") },
  { label: "GitHub", logo: simpleIcon("github") },
] as const;

export default function NoNamedBotGateway({ isActive = false }: { isActive?: boolean }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  };

  // The "Deployed on" badge is the last thing to animate in.
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
    <section className={styles.screen} aria-labelledby="nonamedbot-title">
      <motion.div
        className={styles.backgroundCol}
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
      >
        <div className={styles.watermark} aria-hidden="true" />
      </motion.div>

      <motion.div
        className={styles.deployBadge}
        variants={badgeContainer}
        initial="hidden"
        animate={isActive ? "show" : "hidden"}
      >
        <motion.span className={styles.deployLabel} variants={item}>
          Deployed on
        </motion.span>
        <motion.img
          className={styles.deployLogo}
          src="/bnb_logo.webp"
          alt="BNB Chain"
          loading="lazy"
          variants={item}
        />

        <motion.ul
          className={`${styles.techRow} ${styles.techRowTop}`}
          variants={logoGroup}
          aria-label="NoNamedBot tech stack"
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
          <motion.h1 id="nonamedbot-title" className={styles.wordmark} variants={item}>
            NoNamedBot
          </motion.h1>

          <motion.p className={styles.subtitle} variants={item}>
            Autonomous BSC trading agent
          </motion.p>

          <motion.p className={styles.lead} variants={item}>
            At its core, a <span className={styles.leadAccent}>TWAK agent</span> — a
            production-minded Python bot for the BNB Hack AI Trading Agent Edition. It scores
            high-liquidity BNB Chain tokens with regime-aware guardrails and executes self-custody
            swaps through TWAK, so Python never holds a trading key.
          </motion.p>

          <motion.div className={styles.actions} variants={item}>
            <a
              className={styles.ctaPrimary}
              href={DEPLOYMENT_URL}
              target="_blank"
              rel="noreferrer"
            >
              View deployment <span aria-hidden="true">→</span>
            </a>
            <a
              className={styles.ctaSecondary}
              href={DOCS_URL}
              target="_blank"
              rel="noreferrer"
            >
              Docs <span aria-hidden="true">↗</span>
            </a>
          </motion.div>

          <motion.ul
            className={`${styles.techRow} ${styles.techRowBottom}`}
            variants={logoGroup}
            aria-label="NoNamedBot tech stack"
          >
            {renderTechItems()}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
}
