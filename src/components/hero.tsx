"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import ChatInterface from "./minecraft-chat-interface";
import {
  HIDE_HERO_SIDEBAR_CLASS,
  SHADERSMINE_WALLPAPER,
  WALLPAPER_STORAGE_KEY,
  WALLPAPERS,
  type Wallpaper,
} from "@/lib/wallpaper";

type HeroProps = {
  className?: string;
};

export default function Hero({ className }: HeroProps) {
  const [wallpaper, setWallpaper] = useState<Wallpaper>(WALLPAPERS[0]);
  const isShadersmineWallpaper = wallpaper === SHADERSMINE_WALLPAPER;

  const heroRef = useRef<HTMLElement>(null);

  // Progreso del scroll: 0 cuando el hero llena la pantalla, 1 cuando salió completamente
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Spring suave para suavizar el movimiento del parallax
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    mass: 0.5,
  });

  // Parallax del fondo: se mueve hacia abajo más lento que el contenido → sensación de profundidad
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "25%"]);
  // GIF: fade out + leve scale down al scrollear
  const gifOpacity = useTransform(smoothProgress, [0, 0.55], [1, 0]);
  const gifScale = useTransform(smoothProgress, [0, 1], [1, 0.93]);
  // Chat: sube ligeramente y se desvanece al scrollear
  const chatY = useTransform(smoothProgress, [0, 0.8], ["0px", "40px"]);
  const chatOpacity = useTransform(smoothProgress, [0, 0.7], [1, 0]);
  // Scroll indicator: desaparece en cuanto el usuario hace scroll
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  useEffect(() => {
    const lastWallpaper = window.localStorage.getItem(WALLPAPER_STORAGE_KEY);
    const nextWallpaper = lastWallpaper === WALLPAPERS[1] ? WALLPAPERS[0] : WALLPAPERS[1];

    setWallpaper(nextWallpaper);
    window.localStorage.setItem(WALLPAPER_STORAGE_KEY, nextWallpaper);
    document.body.classList.toggle(
      HIDE_HERO_SIDEBAR_CLASS,
      nextWallpaper === SHADERSMINE_WALLPAPER
    );

    return () => {
      document.body.classList.remove(HIDE_HERO_SIDEBAR_CLASS);
    };
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className={`relative min-h-screen overflow-hidden bg-black ${className ?? ""}`}
    >
      {/* Background wallpaper con parallax — scale ligero para evitar bordes vacíos */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY, scale: 1.15 }}
      >
        <Image
          src={wallpaper}
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      {/* GIF con fade + scale al scrollear */}
      <motion.div
        className="pointer-events-none absolute inset-0 h-full z-10"
        style={{ opacity: gifOpacity, scale: gifScale }}
      >
        <Image
          src="/16.gif"
          alt="Animated overlay"
          fill
          priority
          unoptimized
          className="mt-[10vh] md:mt-[20vh] lg:mt-[28vh] object-contain object-center lg:object-right
                     origin-center lg:origin-right scale-[1.1] sm:scale-[0.95] md:scale-[1.2]
                     lg:scale-[1.35] xl:scale-[1.45] lg:translate-x-[200px]"
        />
      </motion.div>

      {/* Grid para otros contenidos */}
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[60%_40%] items-stretch lg:pl-24 xl:pl-28 pt-7" />

      {/* === Minecraft chat con parallax sutil === */}
      <motion.div
        className="pointer-events-auto absolute bottom-6 z-30"
        style={{
          left: isShadersmineWallpaper ? 12 : 108,
          marginTop: 8,
          y: chatY,
          opacity: chatOpacity,
        }}
      >
        <ChatInterface />
      </motion.div>

      {/* Separador inferior */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Scroll indicator — dos chevrons apilados con bounce, desaparecen al scrollear */}
      <motion.div
        className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center"
        style={{ opacity: indicatorOpacity }}
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white/60">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.22 }}
          className="-mt-2"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white/30">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
