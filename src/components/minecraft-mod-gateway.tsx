"use client";

import { motion } from "framer-motion";
import styles from "./minecraft-mod-gateway.module.css";

type MinecraftModGatewayProps = {
  onSeeMore?: () => void;
  isActive?: boolean;
};

export default function MinecraftModGateway({ onSeeMore, isActive = false }: MinecraftModGatewayProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: 60, rotate: 5 },
    show: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className={styles.screen} aria-labelledby="minecraft-mod-title">
      <motion.div 
        className={styles.content}
        variants={container}
        initial="hidden"
        animate={isActive ? "show" : "hidden"}
      >
        <motion.p className={styles.eyebrow} variants={item}>Playable Web3 Experiment</motion.p>
        <motion.h2 id="minecraft-mod-title" className={styles.title} variants={item}>
          Crypto Minecraft Mod
        </motion.h2>
        <motion.button type="button" className={styles.cta} onClick={onSeeMore} variants={item}>
          See more
        </motion.button>
      </motion.div>
    </section>
  );
}
