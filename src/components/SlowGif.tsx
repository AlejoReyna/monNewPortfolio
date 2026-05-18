"use client";

import { useEffect, useRef, useCallback } from "react";
import { parseGIF, decompressFrames } from "gifuct-js";

interface SlowGifProps {
  src: string;
  /** Multiplicador de delay por frame. speedFactor=5 → ciclo de 2s pasa a 10s */
  speedFactor?: number;
  /** Posición horizontal: "left" | "center" | "right" */
  objectPosition?: "center" | "right" | "left";
  /** Posición vertical: "top" | "center" | "bottom" */
  objectPositionY?: "top" | "center" | "bottom";
  /**
   * Offset desde el top del canvas en px antes de calcular el contain.
   * Úsalo para dejar espacio bajo el navbar (ej. 80).
   * El personaje se dibuja en el área [topOffsetPx .. canvasH].
   */
  topOffsetPx?: number;
  className?: string;
  alt?: string;
}

export default function SlowGif({
  src,
  speedFactor = 1.8,
  objectPosition = "right",
  objectPositionY = "center",
  topOffsetPx = 0,
  className,
  alt,
}: SlowGifProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mountedRef = useRef(true);
  const animFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = () => {
    if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
  };

  /**
   * Emula object-fit: contain con soporte para topOffsetPx.
   * El área de dibujo es [topOffsetPx .. canvasH] verticalmente.
   */
  const calcContainRect = (
    canvasW: number,
    canvasH: number,
    gifW: number,
    gifH: number,
    posX: "left" | "center" | "right",
    posY: "top" | "center" | "bottom",
    topOff: number
  ) => {
    const availH = canvasH - topOff;
    const scale  = Math.min(canvasW / gifW, availH / gifH);
    const drawW  = gifW * scale;
    const drawH  = gifH * scale;

    // Horizontal
    let drawX = 0;
    if (posX === "center") drawX = (canvasW - drawW) / 2;
    else if (posX === "right") drawX = canvasW - drawW;

    // Vertical — relativo al área disponible [topOff .. canvasH]
    let drawY = topOff + (availH - drawH) / 2; // center
    if (posY === "top")    drawY = topOff;
    if (posY === "bottom") drawY = canvasH - drawH;

    return { drawX, drawY, drawW, drawH };
  };

  const run = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const res = await fetch(src);
    const buf = await res.arrayBuffer();
    const gif = parseGIF(buf);
    const frames = decompressFrames(gif, true);

    if (!frames.length || !mountedRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gifW = gif.lsd.width;
    const gifH = gif.lsd.height;

    const offscreen = document.createElement("canvas");
    offscreen.width  = gifW;
    offscreen.height = gifH;
    const octx = offscreen.getContext("2d")!;

    let frameIndex = 0;

    const renderFrame = () => {
      if (!mountedRef.current) return;

      const frame = frames[frameIndex];
      const { dims, patch, delay, disposalType } = frame;

      if (disposalType === 2) octx.clearRect(dims.left, dims.top, dims.width, dims.height);
      else if (disposalType === 3) octx.clearRect(0, 0, gifW, gifH);

      octx.putImageData(
        new ImageData(patch as unknown as Uint8ClampedArray<ArrayBuffer>, dims.width, dims.height),
        dims.left,
        dims.top
      );

      // Sync canvas buffer ↔ CSS layout size
      const cw = canvas.offsetWidth  || gifW;
      const ch = canvas.offsetHeight || gifH;
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width  = cw;
        canvas.height = ch;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { drawX, drawY, drawW, drawH } = calcContainRect(
        canvas.width, canvas.height,
        gifW, gifH,
        objectPosition, objectPositionY,
        topOffsetPx
      );
      ctx.drawImage(offscreen, drawX, drawY, drawW, drawH);

      frameIndex = (frameIndex + 1) % frames.length;

      const delayMs = Math.max((delay ?? 10) * 10, 20) * speedFactor;
      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current) animFrameRef.current = requestAnimationFrame(renderFrame);
      }, delayMs);
    };

    animFrameRef.current = requestAnimationFrame(renderFrame);
  }, [src, speedFactor, objectPosition, objectPositionY, topOffsetPx]);

  useEffect(() => {
    mountedRef.current = true;
    run();
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [run]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label={alt}
    />
  );
}
