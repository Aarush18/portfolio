"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** 0.0–1.0 density per pixel (higher = more stars) */
  density?: number;
  /** base pixels/second drift; layer speed scales off this */
  speed?: number;
  /** 0–1 global opacity */
  opacity?: number;
};

export default function Starfield({ density = 0.00018, speed = 24, opacity = 0.95 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Respect reduced motion: draw once, no animation
    let reduceMotion = false;
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const setRM = () => (reduceMotion = !!mq?.matches);
    setRM();
    mq?.addEventListener?.("change", setRM);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Star = {
      x: number; y: number; r: number; a: number; va: number;
      vx: number; vy: number; hue: number; layer: number;
    };
    let stars: Star[] = [];

    function resize() {
      const w = window.innerWidth, h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    }

    function initStars() {
      const w = canvas.width / dpr, h = canvas.height / dpr;
      const count = Math.max(140, Math.floor(w * h * density));
      const arr: Star[] = [];
      for (let i = 0; i < count; i++) {
        const layer = Math.random(); // 0 (near) -> 1 (far)
        const r = 0.6 + (1 - layer) * 1.4;
        // Stronger, more visible drift (slight random angle per star)
        const base = speed * (0.5 + layer * 1.2); // far stars slower
        const baseAngle = -Math.PI / 2 - 0.2;     // general upward-left
        const jitter = (Math.random() - 0.5) * 0.3;
        const ang = baseAngle + jitter;
        const vx = Math.cos(ang) * base;
        const vy = Math.sin(ang) * base;

        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          a: 0.5 + Math.random() * 0.5,
          va: (Math.random() * 0.8 + 0.2) * (Math.random() < 0.5 ? -1 : 1),
          vx, vy,
          hue: 210 + Math.random() * 50,
          layer,
        });
      }
      stars = arr;
    }

    function drawStatic() {
      const w = canvas.width / dpr, h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const s of stars) {
        ctx.globalAlpha = s.a * opacity;
        ctx.fillStyle = `hsl(${s.hue} 30% 88%)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    let last = performance.now();
    function loop(now: number) {
      const dt = Math.min(50, now - last) / 1000; // seconds
      last = now;

      const w = canvas.width / dpr, h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (const s of stars) {
        // Move
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        // Wrap around all edges (with small buffer)
        if (s.x < -3) s.x = w + 3;
        if (s.x > w + 3) s.x = -3;
        if (s.y < -3) s.y = h + 3;
        if (s.y > h + 3) s.y = -3;

        // Twinkle
        s.a += s.va * dt * 0.35;
        if (s.a < 0.3 || s.a > 1) s.va *= -1;

        // Draw (slightly bigger on nearer layers)
        const rad = s.r * (1 + (1 - s.layer) * 0.25);
        ctx.globalAlpha = s.a * opacity;
        ctx.fillStyle = `hsl(${s.hue} 30% 88%)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(loop);
    }

    // Init
    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      drawStatic();
    } else {
      rafRef.current = requestAnimationFrame((t) => {
        last = t;
        loop(t);
      });
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      mq?.removeEventListener?.("change", setRM);
    };
  }, [density, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ backgroundColor: "#0b0b0f" }}
    />
  );
}
