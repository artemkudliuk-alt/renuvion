"use client";

import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "./site-header";

/*
 * Элементы, живущие поверх страницы при прокрутке:
 * — закреплённая шапка: выезжает сверху, когда шапка первого экрана ушла из вида.
 *   Шапка первого экрана остаётся на месте — её кнопка центрирована по аппарату на фоне;
 * — кнопка «наверх» справа внизу с кольцом прогресса прокрутки.
 * Кольцо обновляется напрямую через ref, без перерисовки React на каждый кадр прокрутки.
 */

const R = 24;
const CIRC = 2 * Math.PI * R;

export function ScrollChrome() {
  const [past, setPast] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      ring.current?.style.setProperty("stroke-dashoffset", String(CIRC * (1 - p)));
      setPast(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toTop = () => {
    // с плавной прокруткой — через Lenis (site-motion.tsx), без неё — штатно
    const handled = !document.dispatchEvent(new Event("scroll:top", { cancelable: true }));
    if (!handled) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hidden = "pointer-events-none opacity-0";

  return (
    <>
      <div
        inert={!past}
        className={`fixed inset-x-0 top-0 z-40 border-b border-white/8 bg-[rgb(5_16_38/0.78)] backdrop-blur-xl transition-[translate,opacity] duration-[600ms] ease-[var(--ease)] ${
          past ? "" : `${hidden} -translate-y-full`
        }`}
      >
        <SiteHeader floating />
      </div>

      <button
        type="button"
        onClick={toTop}
        aria-label="Нагору"
        inert={!past}
        className={`group fixed right-[clamp(16px,2.2vw,32px)] z-40 flex size-14 items-center justify-center rounded-full bg-[rgb(10_27_56/0.82)] text-white shadow-[0_10px_30px_rgb(0_0_0/0.35)] backdrop-blur-md transition-[translate,opacity,background-color] duration-[620ms] ease-[var(--ease)] hover:-translate-y-1 hover:bg-[var(--accent)] hover:text-[var(--on-accent)] bottom-[calc(88px+env(safe-area-inset-bottom))] lg:bottom-[clamp(16px,2.2vw,32px)] ${
          past ? "" : `${hidden} translate-y-4`
        }`}
      >
        {/* кольцо: тонкая дорожка и заполнение акцентом по мере прокрутки */}
        <svg viewBox="0 0 56 56" className="absolute inset-0 size-full -rotate-90" aria-hidden>
          <circle cx="28" cy="28" r={R} fill="none" stroke="rgb(255 255 255 / 0.14)" strokeWidth="1.5" />
          <circle
            ref={ring}
            cx="28"
            cy="28"
            r={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC}
            className="transition-[stroke] duration-[320ms] group-hover:stroke-white/0"
          />
        </svg>
        <svg
          viewBox="0 0 24 24"
          className="relative size-5 transition-transform duration-[520ms] ease-[var(--ease)] group-hover:-translate-y-[3px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </button>
    </>
  );
}
