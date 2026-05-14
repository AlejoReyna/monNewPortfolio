"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import ChatInterface from "@/components/chat-interface";

/* ═══════════════════════════════════════════
   Hero V2 — Night Sky / GIC style
   ═══════════════════════════════════════════ */

const COMIC_MESSAGES = [
  "i build ai slop 24/7",
  "slurp",
  "ships at 2am",
  "powered by caffeine",
  "git push --force",
  "it works on my machine",
  "todo: fix later",
  "console.log everything",
];

/** Full-line rotating greetings above the draggable terminal */
const DRAG_GREETINGS = [
  "hey, you made it — drag me anywhere",
  "welcome in, grab the window",
  "good to see you — pull me around",
  "pull up a chair, then drag the chat",
  "make yourself at home, move me if you like",
  "you're in the right place — try dragging",
  "glad you're here, terminal's draggable",
  "take a look around, i'm not glued down",
  "vibes: online — toss me anywhere",
  "ready when you are — drag me anywhere",
];
type HeroV2Props = {
  /**
   * Inside `HeroCarouselSequence` the hero stays in a sticky frame; window-based
   * `useScroll` on this section mis-tracks, so inner fades/parallax hide content early.
   * Omit scroll-driven motion here — the parent sequence handles the reveal.
   */
  embedInScrollSequence?: boolean;
  /** When embedded, fades hero chrome (not the BG) during the carousel wipe. */
  embedContentOpacity?: MotionValue<number>;
  /**
   * When true, strips the background image, vignette and dot grid so the
   * section inherits a flat `#08080a` base — used by the v3 page which wants
   * a uniform background throughout.
   */
  noBgImage?: boolean;
};

export default function HeroV2({
  embedInScrollSequence,
  embedContentOpacity,
  noBgImage = false,
}: HeroV2Props) {
  const heroRef = useRef<HTMLElement>(null);
  const [devBorder, setDevBorder] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const [dragGreetIndex, setDragGreetIndex] = useState(0);
  const [dragGreetVisible, setDragGreetVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setMsgVisible(v => {
        if (v) return false; // visible → start standby
        setMsgIndex(i => (i + 1) % COMIC_MESSAGES.length); // advance on hidden → visible
        return true;
      });
    }, 2000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => {
      setDragGreetVisible(v => {
        if (v) return false;
        setDragGreetIndex(i => (i + 1) % DRAG_GREETINGS.length);
        return true;
      });
    }, 2800);
    return () => clearInterval(t);
  }, []);

  /* parallax / fade */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.5 });
  const embed = !!embedInScrollSequence;
  const bgY = useTransform(smooth, [0, 1], embed ? ["0%", "0%"] : ["0%", "22%"]);
  const contentY = useTransform(smooth, [0, 1], embed ? ["0px", "0px"] : ["0px", "55px"]);
  const baseContentOpacity = useTransform(smooth, [0, 0.65], embed ? [1, 1] : [1, 0]);
  const baseGifOpacity = useTransform(smooth, [0, 0.55], embed ? [1, 1] : [1, 0]);

  const contentOpacity =
    embed && embedContentOpacity
      ? useTransform(
          [baseContentOpacity, embedContentOpacity],
          ([a, b]) => (Number(a) || 1) * (Number(b) || 1)
        )
      : baseContentOpacity;
  const gifOpacity =
    embed && embedContentOpacity
      ? useTransform(
          [baseGifOpacity, embedContentOpacity],
          ([a, b]) => (Number(a) || 1) * (Number(b) || 1)
        )
      : baseGifOpacity;
  const assetZoom = 1.4;
  const gifScale = useTransform(smooth, [0, 1], embed ? [assetZoom, assetZoom] : [assetZoom, 0.93 * assetZoom]);
  const arrowOpacity = useTransform(scrollYProgress, embed ? [0, 1] : [0, 0.08], embed ? [0, 0] : [1, 0]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen overflow-hidden flex"
      style={{ backgroundColor: noBgImage ? "#08080a" : "var(--gic-night-sky)" }}
    >
      {/* ── Background image + parallax ── */}
      {!noBgImage && (
        <motion.div
          className="absolute inset-0 z-0 scale-110"
          style={{ y: bgY }}
        >
          <Image
            src="/shadersmine.png"
            alt="Architectural night backdrop"
            fill
            priority
            className="object-cover"
            style={{ opacity: 0.28, mixBlendMode: "luminosity" }}
          />
          {/* Multi-layer vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(31,31,41,0.55) 0%, rgba(31,31,41,0.3) 40%, rgba(31,31,41,0.85) 100%)",
            }}
          />
        </motion.div>
      )}

      {/* ── Subtle grid pattern ── */}
      {!noBgImage && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            maskImage:
              "radial-gradient(ellipse 70% 80% at 50% 50%, black 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 80% at 50% 50%, black 40%, transparent 100%)",
          }}
        />
      )}

      {/* ── Main content ── */}
      <motion.div
        className="relative z-10 w-full h-screen px-6 md:px-10 lg:px-16 flex flex-col"
        style={{
          y: contentY,
          opacity: contentOpacity,
          maxWidth: "var(--gic-max-width)",
          margin: "0 auto",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(380px,min(640px,52vw))] gap-10 lg:gap-12 items-start lg:items-stretch w-full flex-1">

          {/* ── Left column: layout placeholder ── */}
          <div className={`relative w-full h-full min-h-[min(70vh,520px)] lg:min-h-[min(88vh,780px)] ${devBorder ? "border-2 border-rose-400" : ""}`}>

            {/* ── Pixelated phrase above the line ── */}
            <div
              className="absolute pointer-events-none select-none max-w-[min(92vw,520px)]"
              style={{ top: "30%", left: "8%", zIndex: 5 }}
            >
              <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');`}</style>
              <AnimatePresence mode="wait">
                {dragGreetVisible && (
                  <motion.span
                    key={`drag-greet-${dragGreetIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{
                      fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
                      fontSize: "clamp(0.7rem, 1.1vw, 1rem)",
                      color: "#ffffff",
                      letterSpacing: "0.05em",
                      lineHeight: 1.85,
                      display: "block",
                    }}
                  >
                    &gt; {DRAG_GREETINGS[dragGreetIndex]}_
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* ── Dev: horizontal line at 45% ── */}
            {devBorder && (
              <div
                className="absolute inset-x-0 pointer-events-none"
                style={{ top: "38%", height: "1px", background: "rgba(255,0,0,0.6)" }}
              />
            )}
          </div>

          {/* ── Right column: GIF full height ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
            className={`hidden lg:block relative lg:ml-[15%] w-full h-full min-h-[min(88vh,700px)] pt-16 overflow-hidden pointer-events-none origin-top rounded-lg ${devBorder ? "border-2 border-rose-400" : ""}`}
            style={{ opacity: gifOpacity, scale: gifScale }}
            aria-hidden
          >
            <Image
              src="/16.gif"
              alt=""
              fill
              priority
              unoptimized
              sizes="(min-width: 1400px) min(540px, 46vw), 0px"
              className="object-contain object-center"
            />
            {/* ── Dev: head divider line ── */}
            {devBorder && (
              <div
                className="absolute inset-x-0 pointer-events-none"
                style={{ top: "23%", height: "1px", background: "rgba(255,0,0,0.6)" }}
              />
            )}
            {/* ── Dev: vertical line ── */}
            {devBorder && (
              <div
                className="absolute pointer-events-none"
                style={{ left: "61.5%", top: 0, width: "1px", height: "23%", background: "rgba(255,0,0,0.6)" }}
              />
            )}

            {/* ── Comic speech bubbles ── */}
            {/* Static pointer line toward face */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 10 }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="63%" y1="13%" x2="59%" y2="16%" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            {/* Bubble — cycles with 2s visible / 2s standby */}
            <div className="absolute pointer-events-none" style={{ top: "8.5%", left: "62.5%", zIndex: 10 }}>
              <AnimatePresence mode="wait">
                {msgVisible && (
                  <motion.span
                    key={`b-${msgIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      display: "block",
                      fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
                      fontSize: "0.78rem",
                      color: "white",
                      transform: "rotate(-3deg)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {COMIC_MESSAGES[msgIndex]}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        </div>
      </motion.div>


      {/* ── Draggable terminal ── */}
      <style>{`.comic-terminal, .comic-terminal * { font-family: 'Comic Sans MS', 'Comic Sans', cursive !important; }`}</style>
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={heroRef}
        dragElastic={0}
        className="absolute z-30 cursor-grab active:cursor-grabbing comic-terminal"
        style={{
          top: "39%",
          left: "8%",
          width: "min(520px, 42vw)",
          height: "min(450px, 50vh)",
          fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
        }}
      >
        <ChatInterface variant="panel" className="!w-full !h-full max-w-none" />
      </motion.div>

      {/* ── DEV: border toggle ── */}
      <button
        onClick={() => setDevBorder(v => !v)}
        className="absolute bottom-3 right-3 z-50 pointer-events-auto"
        style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.08em",
          color: devBorder ? "rgba(251,113,133,0.9)" : "rgba(255,255,255,0.2)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "2px 4px",
          userSelect: "none",
        }}
        title="Toggle dev border"
      >
        {devBorder ? "[border: on]" : "[border: off]"}
      </button>
    </section>
  );
}
