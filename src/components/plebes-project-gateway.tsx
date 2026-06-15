"use client";

import { motion } from "framer-motion";
import styles from "./plebes-project-gateway.module.css";

export default function PlebesProjectGateway({ isActive = false }: { isActive?: boolean }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -60, y: 60 },
    show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section className={styles.screen} aria-labelledby="plebes-project-title">
      <div className={styles.inner}>
        <motion.div 
          className={styles.copy}
          variants={container}
          initial="hidden"
          animate={isActive ? "show" : "hidden"}
        >
          <motion.h2 id="plebes-project-title" className={styles.title} variants={item}>
            part of the{" "}
            <img className={styles.logoWord} src="/plebeslogo.svg" alt="plebes" />
            project
          </motion.h2>
          <motion.a className={styles.cta} href="https://plebes.xyz" target="_blank" rel="noreferrer" variants={item}>
            Visit plebes.xyz
          </motion.a>
        </motion.div>

        <motion.div 
          className={styles.media}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <img src="/mon_frame.png" alt="Mon frame artwork for the Plebes project" />
        </motion.div>
      </div>
    </section>
  );
}
