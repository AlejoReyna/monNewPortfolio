"use client";

import { useEffect, useRef } from "react";

type Vector2 = { x: number; y: number };

export default function PongBackground({ active = false }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef<boolean>(active);

  // Game state kept in refs to avoid rerenders
  const ballRef = useRef<{ pos: Vector2; vel: Vector2; radius: number }>({
    pos: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    radius: 8,
  });
  const leftPaddleRef = useRef<{ y: number; w: number; h: number }>({ y: 0, w: 10, h: 80 });
  const rightPaddleRef = useRef<{ y: number; w: number; h: number }>({ y: 0, w: 10, h: 80 });
  const fieldRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const keysRef = useRef<{ up: boolean; down: boolean }>({ up: false, down: false });
  const pointerYRef = useRef<number | null>(null);

  // keep active flag in ref for the animation loop
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      fieldRef.current.width = w;
      fieldRef.current.height = h;

      // Scale paddles relative to height
      const padH = Math.max(60, Math.min(160, Math.round(h * 0.18)));
      leftPaddleRef.current.h = padH;
      rightPaddleRef.current.h = padH;
      leftPaddleRef.current.w = 10;
      rightPaddleRef.current.w = 10;

      // Reset ball to center on resize to avoid tunneling
      serveBall();
    }

    function serveBall() {
      const { width: w, height: h } = fieldRef.current;
      const speed = Math.max(220, Math.min(520, Math.sqrt(w * h) * 0.28));
      const angle = (Math.random() * 0.6 - 0.3) + (Math.random() < 0.5 ? 0 : Math.PI); // slight up/down, random left/right
      ballRef.current.pos.x = w * 0.5;
      ballRef.current.pos.y = h * 0.5;
      ballRef.current.vel.x = Math.cos(angle) * speed;
      ballRef.current.vel.y = Math.sin(angle) * speed;
      ballRef.current.radius = Math.max(6, Math.min(10, Math.round(Math.min(w, h) * 0.008)));

      leftPaddleRef.current.y = h * 0.5 - leftPaddleRef.current.h / 2;
      rightPaddleRef.current.y = h * 0.5 - rightPaddleRef.current.h / 2;
    }

    function update(dt: number) {
      const { width: w, height: h } = fieldRef.current;
      const ball = ballRef.current;
      const lp = leftPaddleRef.current;
      const rp = rightPaddleRef.current;

      // AI paddles follow ball with easing and capped speed
      const paddleMaxSpeed = Math.max(240, Math.min(520, h * 0.55));
      const follow = (targetY: number, currentY: number, heightPx: number) => {
        const center = currentY + heightPx / 2;
        const toward = targetY - center;
        const step = Math.sign(toward) * Math.min(Math.abs(toward) * 0.12, paddleMaxSpeed * dt);
        let next = currentY + step;
        next = Math.max(20, Math.min(h - heightPx - 20, next));
        return next;
      };

      lp.y = follow(ball.pos.y, lp.y, lp.h);

      if (activeRef.current) {
        // Player control for right paddle: keys have priority over pointer
        const vertical = (keysRef.current.down ? 1 : 0) + (keysRef.current.up ? -1 : 0);
        if (vertical !== 0) {
          const maxSpeed = Math.max(240, Math.min(520, h * 0.55));
          rp.y += vertical * maxSpeed * dt;
          rp.y = Math.max(20, Math.min(h - rp.h - 20, rp.y));
        } else {
          const pointerY = pointerYRef.current;
          if (pointerY !== null) {
            const target = pointerY;
            rp.y = follow(target, rp.y, rp.h);
          }
        }
      } else {
        // Idle background mode: AI mirrors ball with some wobble
        rp.y = follow(ball.pos.y + Math.sin(performance.now() * 0.002) * (h * 0.06), rp.y, rp.h);
      }

      // Move ball
      ball.pos.x += ball.vel.x * dt;
      ball.pos.y += ball.vel.y * dt;

      // Wall collisions
      if (ball.pos.y - ball.radius <= 0 && ball.vel.y < 0) {
        ball.pos.y = ball.radius;
        ball.vel.y *= -1;
      } else if (ball.pos.y + ball.radius >= h && ball.vel.y > 0) {
        ball.pos.y = h - ball.radius;
        ball.vel.y *= -1;
      }

      // Paddle collisions
      const padInset = 18;
      const leftX = padInset;
      const rightX = w - padInset - rp.w;

      // Left
      if (ball.pos.x - ball.radius <= leftX + lp.w && ball.pos.x > leftX) {
        if (ball.pos.y >= lp.y && ball.pos.y <= lp.y + lp.h && ball.vel.x < 0) {
          ball.pos.x = leftX + lp.w + ball.radius;
          ball.vel.x *= -1;
          ball.vel.y += ((ball.pos.y - (lp.y + lp.h / 2)) / (lp.h / 2)) * 160;
          accelerate(ball);
        }
      }

      // Right
      if (ball.pos.x + ball.radius >= rightX && ball.pos.x < rightX + rp.w) {
        if (ball.pos.y >= rp.y && ball.pos.y <= rp.y + rp.h && ball.vel.x > 0) {
          ball.pos.x = rightX - ball.radius;
          ball.vel.x *= -1;
          ball.vel.y += ((ball.pos.y - (rp.y + rp.h / 2)) / (rp.h / 2)) * 160;
          accelerate(ball);
        }
      }

      // Score/reset when ball exits left or right
      if (ball.pos.x < -60 || ball.pos.x > w + 60) {
        serveBall();
      }
    }

    function accelerate(ball: { vel: Vector2 }) {
      const speed = Math.hypot(ball.vel.x, ball.vel.y);
      const next = Math.min(speed * 1.05, 900);
      const scale = next / speed;
      ball.vel.x *= scale;
      ball.vel.y *= scale;
    }

    function render(ctx2: CanvasRenderingContext2D) {
      const { width: w, height: h } = fieldRef.current;
      ctx2.clearRect(0, 0, w, h);

      // Subtle background tint
      ctx2.fillStyle = activeRef.current ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)";
      ctx2.fillRect(0, 0, w, h);

      // Center dashed line
      ctx2.strokeStyle = activeRef.current ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.18)";
      ctx2.lineWidth = 3;
      ctx2.setLineDash([10, 12]);
      ctx2.beginPath();
      ctx2.moveTo(w / 2, 0);
      ctx2.lineTo(w / 2, h);
      ctx2.stroke();
      ctx2.setLineDash([]);

      // Paddles
      const padColor = activeRef.current ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.28)";
      const padInset = 18;
      ctx2.fillStyle = padColor;
      // left
      ctx2.fillRect(padInset, leftPaddleRef.current.y, leftPaddleRef.current.w, leftPaddleRef.current.h);
      // right
      ctx2.fillRect(w - padInset - rightPaddleRef.current.w, rightPaddleRef.current.y, rightPaddleRef.current.w, rightPaddleRef.current.h);

      // Ball
      ctx2.beginPath();
      ctx2.arc(ballRef.current.pos.x, ballRef.current.pos.y, ballRef.current.radius, 0, Math.PI * 2);
      ctx2.fillStyle = activeRef.current ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.6)";
      ctx2.shadowColor = activeRef.current ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.35)";
      ctx2.shadowBlur = activeRef.current ? 12 : 8;
      ctx2.fill();
      ctx2.shadowBlur = 0;
    }

    let lastTs = 0;
    function loop(ts: number) {
      if (!lastTs) lastTs = ts;
      const dt = Math.min((ts - lastTs) / 1000, 0.033);
      lastTs = ts;
      update(dt);
      render(ctx);
      rafRef.current = requestAnimationFrame(loop);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        if (activeRef.current) e.preventDefault();
        keysRef.current.up = true;
      }
      if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
        if (activeRef.current) e.preventDefault();
        keysRef.current.down = true;
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") keysRef.current.up = false;
      if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") keysRef.current.down = false;
    }

    function onMouseMove(e: MouseEvent) {
      if (!activeRef.current) return;
      pointerYRef.current = e.clientY;
    }

    function onTouchMove(e: TouchEvent) {
      if (!activeRef.current) return;
      if (e.touches && e.touches.length) pointerYRef.current = e.touches[0].clientY;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <canvas ref={canvasRef} className="block w-full h-full" aria-hidden="true" />
    </div>
  );
}


