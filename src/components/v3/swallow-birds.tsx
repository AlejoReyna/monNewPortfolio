"use client";

import { useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════
// SWALLOW BIRDS (Canvas)
// ───────────────────────────────────────────────────────────────────────
// Golondrinas dibujadas con bezier curves en Canvas <2D>. Recicladas
// directamente del bloque "Padres" de la invitación de Cindy & Jorge
// (ParentsSection.tsx) para reutilizar el mismo fondo animado.
// El canvas usa pointer-events: none y se adapta al contenedor padre.
// ═══════════════════════════════════════════════════════════════════════

interface Bird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  waveAmp: number;
  waveFreq: number;
  waveOffset: number;
  scale: number;
  phase: number; // batir de alas [0, 1)
  beatSpeed: number;
  time: number;
}

function createBird(canvasW: number, canvasH: number, init: boolean): Bird {
  return {
    x: init ? Math.random() * canvasW : -70,
    y: 40 + Math.random() * (canvasH - 80),
    vx: 2.2 + Math.random() * 3.2,
    vy: (Math.random() - 0.5) * 0.7,
    waveAmp: 10 + Math.random() * 16,
    waveFreq: 0.007 + Math.random() * 0.009,
    waveOffset: Math.random() * Math.PI * 2,
    scale: 15.6 + Math.random() * 15.6,
    phase: Math.random(),
    beatSpeed: 0.011 + Math.random() * 0.009,
    time: Math.random() * 1000,
  };
}

function updateBird(b: Bird, dt: number, canvasW: number, canvasH: number): boolean {
  b.time += dt;
  b.phase += b.beatSpeed * dt;
  if (b.phase >= 1) b.phase -= 1;

  b.x += b.vx * dt * 0.38;
  b.y += b.vy * dt * 0.38 + Math.sin(b.time * b.waveFreq + b.waveOffset) * 0.35;

  if (b.y < 18) b.vy = Math.abs(b.vy) * 0.8 + 0.2;
  if (b.y > canvasH - 18) b.vy = -Math.abs(b.vy) * 0.8 - 0.2;

  return b.x > canvasW + 80;
}

function drawSwallow(ctx: CanvasRenderingContext2D, b: Bird, color: string) {
  const s = b.scale;
  const beat = Math.sin(b.phase * Math.PI * 2);
  const dip = beat * s * 0.52;
  const sweep = beat * s * 0.1;

  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.7;

  // Cuerpo
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.26, s * 0.09, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cola bifurcada
  ctx.beginPath();
  ctx.moveTo(-s * 0.22, s * 0.04);
  ctx.quadraticCurveTo(-s * 0.52, s * 0.26, -s * 0.68, s * 0.2);
  ctx.moveTo(-s * 0.22, s * 0.04);
  ctx.quadraticCurveTo(-s * 0.5, s * 0.15, -s * 0.52, s * 0.06);
  ctx.stroke();

  // Ala izquierda
  ctx.beginPath();
  ctx.moveTo(-s * 0.05, 0);
  ctx.bezierCurveTo(-s * 0.28, -sweep + dip * 0.35, -s * 0.52, dip * 0.75, -s * 0.78, dip);
  ctx.bezierCurveTo(-s * 0.52, dip * 0.45 + s * 0.11, -s * 0.23, s * 0.08, -s * 0.05, s * 0.04);
  ctx.fill();

  // Ala derecha (espejo)
  ctx.beginPath();
  ctx.moveTo(s * 0.05, 0);
  ctx.bezierCurveTo(s * 0.28, -sweep + dip * 0.35, s * 0.52, dip * 0.75, s * 0.78, dip);
  ctx.bezierCurveTo(s * 0.52, dip * 0.45 + s * 0.11, s * 0.23, s * 0.08, s * 0.05, s * 0.04);
  ctx.fill();

  ctx.restore();
}

interface SwallowBirdsProps {
  /** Inicia/detiene el loop. Útil para pausar cuando el panel no está visible. */
  active?: boolean;
  /** Cantidad de golondrinas. */
  count?: number;
  /** Color del trazo (mismo tono sepia-dorado del texto por defecto). */
  color?: string;
  /** Opacidad global muy tenue para no competir con el contenido. */
  alpha?: number;
  className?: string;
}

export default function SwallowBirds({
  active = true,
  count = 9,
  color = "#8B7355",
  alpha = 0.18,
  className,
}: SwallowBirdsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const birdsRef = useRef<Bird[]>([]);
  const lastTimeRef = useRef<number>(0);
  const activeRef = useRef(false);

  const loop = useCallback(
    (now: number) => {
      if (!activeRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const dt = Math.min((now - lastTimeRef.current) / 16.67, 3);
      lastTimeRef.current = now;

      const W = canvas.width / dpr;
      const H = canvas.height / dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.globalAlpha = alpha;

      for (let i = 0; i < birdsRef.current.length; i++) {
        const dead = updateBird(birdsRef.current[i], dt, W, H);
        if (dead) birdsRef.current[i] = createBird(W, H, false);
        drawSwallow(ctx, birdsRef.current[i], color);
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    },
    [alpha, color]
  );

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeRef.current) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    if (W === 0 || H === 0) return;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    birdsRef.current = Array.from({ length: count }, () => createBird(W, H, true));
    activeRef.current = true;
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
  }, [count, loop]);

  const stop = useCallback(() => {
    activeRef.current = false;
    cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Arranque / parada según prop `active` y reduced-motion ──────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    if (active) {
      // Pequeño defer para asegurar que el contenedor ya tiene tamaño.
      const id = window.requestAnimationFrame(() => start());
      return () => {
        window.cancelAnimationFrame(id);
        stop();
      };
    }
    stop();
    return undefined;
  }, [active, start, stop]);

  // ── Resize ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !activeRef.current) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
