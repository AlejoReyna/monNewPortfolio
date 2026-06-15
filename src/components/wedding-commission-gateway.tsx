"use client";

import { motion, useReducedMotion } from "framer-motion";
import SwallowBirds from "@/components/v3/swallow-birds";
import styles from "./wedding-commission-gateway.module.css";

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.25 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function WeddingCommissionGateway({ isActive = false }: { isActive?: boolean }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={styles.screen} aria-labelledby="wedding-commission-title">
      {/* Fachada de iglesia en line-art (mismo trazo sepia que las golondrinas),
          anclada al borde inferior como telón de fondo */}
      <svg
        className={styles.church}
        viewBox="0 0 360 340"
        fill="none"
        aria-hidden="true"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Suelo, atrio y escalinata */}
        <path d="M8 330 L352 330" />
        <path d="M70 330 L70 322 L290 322 L290 330" />
        <path d="M150 322 L150 314 L210 314 L210 322" />
        <path d="M158 314 L158 308 L202 308 L202 314" />

        {/* ── Torre izquierda ── */}
        <path d="M30 322 L30 150 M95 322 L95 150" />
        <path d="M30 300 L95 300 M30 210 L95 210" />
        <path d="M55 280 L55 252 Q55 244 62.5 244 Q70 244 70 252 L70 280 Z" />
        <path d="M55 195 L55 175 Q55 165 62.5 165 Q70 165 70 175 L70 195 Z" />
        <path d="M26 150 L99 150" />
        <path d="M34 150 L34 108 M91 150 L91 108" />
        <path d="M48 150 L48 124 Q48 106 62.5 106 Q77 106 77 124 L77 150" />
        <path d="M30 108 L95 108" />
        <path d="M40 108 Q40 70 62.5 66 Q85 70 85 108" />
        <path d="M55 66 L55 54 L70 54 L70 66" />
        <path d="M62.5 54 L62.5 36 M56 44 L69 44" />
        <circle cx="62.5" cy="50" r="2.5" />

        {/* ── Torre derecha ── */}
        <path d="M330 322 L330 150 M265 322 L265 150" />
        <path d="M265 300 L330 300 M265 210 L330 210" />
        <path d="M290 280 L290 252 Q290 244 297.5 244 Q305 244 305 252 L305 280 Z" />
        <path d="M290 195 L290 175 Q290 165 297.5 165 Q305 165 305 175 L305 195 Z" />
        <path d="M261 150 L334 150" />
        <path d="M269 150 L269 108 M326 150 L326 108" />
        <path d="M283 150 L283 124 Q283 106 297.5 106 Q312 106 312 124 L312 150" />
        <path d="M265 108 L330 108" />
        <path d="M275 108 Q275 70 297.5 66 Q320 70 320 108" />
        <path d="M290 66 L290 54 L305 54 L305 66" />
        <path d="M297.5 54 L297.5 36 M291 44 L304 44" />
        <circle cx="297.5" cy="50" r="2.5" />

        {/* ── Cuerpo central ── */}
        <path d="M95 322 L95 150 M265 322 L265 150" />
        <path d="M89 150 L271 150 M95 158 L265 158" />
        <path d="M120 300 L120 158 M126 300 L126 158 M118 158 L128 158 M118 300 L128 300" />
        <path d="M234 300 L234 158 M240 300 L240 158 M232 158 L242 158 M232 300 L242 300" />
        {/* portal y arquivolta */}
        <path d="M156 322 L156 250 Q156 214 180 214 Q204 214 204 250 L204 322" />
        <path d="M148 322 L148 246 Q148 206 180 206 Q212 206 212 246 L212 322" />
        <path d="M174 208 L186 208 L184 220 L176 220 Z" />
        <path d="M180 322 L180 250 M166 314 L166 266 M194 314 L194 266 M162 296 L198 296" />
        {/* ventana del coro */}
        <path d="M160 196 L160 166 Q160 152 180 152 Q200 152 200 166 L200 196 Z" />
        <path d="M180 152 L180 196 M160 176 L200 176" />

        {/* ── Frontón ── */}
        <path d="M112 150 L180 112 L248 150 M120 150 L180 120 L240 150" />
        <path d="M180 112 L180 96 M174 104 L186 104" />
        <circle cx="180" cy="110" r="2.5" />
        <path d="M112 150 L112 138 M248 150 L248 138" />
        <circle cx="112" cy="134" r="3" />
        <circle cx="248" cy="134" r="3" />

        {/* ── Cúpula central (detrás) ── */}
        <path d="M150 120 Q150 78 180 74 Q210 78 210 120" />
        <path d="M150 120 L210 120 M180 120 L180 74" />
        <path d="M164 116 L173 80 M196 116 L187 80" />
        <path d="M170 74 L170 60 L190 60 L190 74" />
        <path d="M168 60 Q180 48 192 60" />
        <path d="M180 48 L180 32 M174 40 L186 40" />
        <circle cx="180" cy="44" r="2.5" />
      </svg>

      {/* Fondo animado reciclado de la sección "Padres" de Cindy & Jorge */}
      <SwallowBirds active={isActive} count={11} color="#8B7355" alpha={0.22} className={styles.birds} />

      <motion.div
        className={styles.content}
        variants={shouldReduceMotion ? undefined : containerVariants}
        initial={shouldReduceMotion ? false : "hidden"}
        animate={isActive ? "show" : "hidden"}
      >
        <motion.p className={styles.eyebrow} variants={shouldReduceMotion ? undefined : itemVariants}>
          ¿Y la tuya?
        </motion.p>

        <motion.h2
          id="wedding-commission-title"
          className={styles.title}
          variants={shouldReduceMotion ? undefined : itemVariants}
        >
          Love is all you need …
          <span className={styles.titleScript}>…del resto, me encargo yo.</span>
        </motion.h2>

        <motion.span className={styles.divider} variants={shouldReduceMotion ? undefined : itemVariants}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerDot} />
          <span className={styles.dividerLine} />
        </motion.span>

        <motion.p className={styles.lede} variants={shouldReduceMotion ? undefined : itemVariants}>
          Invitaciones de boda hechas a mano: sitios fluidos, rápidos y a medida,
          construidos para contar la historia de los dos.
        </motion.p>

        <motion.p className={styles.footnote} variants={shouldReduceMotion ? undefined : itemVariants}>
          Diseño &amp; desarrollo · Alexis Reyna
        </motion.p>

        <motion.div className={styles.deploys} variants={shouldReduceMotion ? undefined : itemVariants}>
          <a
            className={styles.deployLink}
            href="https://cindyjorge.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.deployNames}>Cindy &amp; Jorge</span>
            <span className={styles.deployUrl}>cindyjorge.com</span>
          </a>
          <span className={styles.deploySep} aria-hidden="true" />
          <a
            className={styles.deployLink}
            href="https://aldoyandrea.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.deployNames}>Andrea &amp; Aldo</span>
            <span className={styles.deployUrl}>aldoyandrea.com</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
