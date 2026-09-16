"use client";

import { useEffect, useRef } from "react";

/*
 * Фон всей страницы: светящиеся «кругляшки» как в роликах — разного размера,
 * медленно всплывают и покачиваются. Дальние слои мельче и тусклее и чуть отстают
 * при прокрутке — получается глубина. Canvas стоит за контентом (z-index −1),
 * поэтому секции не должны заливать себя фоном — фон страницы задаёт body.
 * reduced-motion: один неподвижный кадр. Скрытая вкладка: кадры не считаются.
 */

type Dot = { x: number; y: number; r: number; depth: number; vy: number; sway: number; phase: number; alpha: number; hue: 0 | 1 };

const COLORS = ["0 163 224", "140 215 255"] as const;

function makeDots(w: number, h: number): Dot[] {
  const count = Math.min(110, Math.round((w * h) / 16000));
  return Array.from({ length: count }, () => {
    const depth = Math.random(); // 0 — дальний, 1 — ближний
    const big = Math.random() < 0.08;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: big ? 10 + Math.random() * 16 : 0.8 + depth * 3.2 + Math.random(),
      depth,
      vy: 0.06 + depth * 0.22,
      sway: 6 + Math.random() * 18,
      phase: Math.random() * Math.PI * 2,
      alpha: big ? 0.05 + Math.random() * 0.06 : 0.18 + depth * 0.5,
      hue: Math.random() < 0.8 ? 0 : 1,
    };
  });
}

export function BokehField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    let raf = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      // на телефоне высота меняется при скрытии адресной строки — частицы не пересоздаём
      const widthChanged = window.innerWidth !== w;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (widthChanged) dots = makeDots(w, h);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const scroll = window.scrollY;
      for (const d of dots) {
        // параллакс: ближние сдвигаются при прокрутке сильнее
        const py = (((d.y - scroll * (0.04 + d.depth * 0.12)) % (h + 60)) + h + 60) % (h + 60) - 30;
        const px = d.x + Math.sin(t * 0.004 + d.phase) * d.sway;
        const twinkle = 0.75 + 0.25 * Math.sin(t * 0.02 + d.phase * 3);
        const a = d.alpha * twinkle;
        const g = ctx.createRadialGradient(px, py, 0, px, py, d.r * 2.2);
        g.addColorStop(0, `rgb(${COLORS[d.hue]} / ${a})`);
        g.addColorStop(0.35, `rgb(${COLORS[d.hue]} / ${a * 0.6})`);
        g.addColorStop(1, `rgb(${COLORS[d.hue]} / 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, d.r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      t += 1;
      for (const d of dots) {
        d.y -= d.vy;
        if (d.y < -30) {
          d.y += h + 60;
          d.x = Math.random() * w;
        }
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (still) draw();
      else if (!document.hidden) raf = requestAnimationFrame(tick);
    };

    resize();
    start();
    const onResize = () => {
      resize();
      if (still) draw();
    };
    const onScroll = () => still && draw();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", start);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 size-full" />;
}
