"use client";

import { useEffect, useState } from "react";

/*
 * Панель внизу экрана на телефоне (ТЗ, раздел 3.4): всегда видны «Зателефонувати» и «Запитати ціну».
 * «Запитати ціну» открывает окно заявки (lead-modal.tsx), без JS ведёт к форме.
 * На странице под панелью оставлен отступ той же высоты, чтобы она не закрывала подвал.
 * На первом экране панель спрятана: там своя главная кнопка, и панель закрывала бы её (AI-RULES HERO-02).
 */
export function MobileCta() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const btn =
    "flex min-h-12 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-pill)] px-2 text-[clamp(15px,4.2vw,17px)] font-medium transition-[background-color,scale] duration-[320ms] ease-[var(--ease)] active:scale-[0.98]";
  return (
    <>
      <div aria-hidden className="h-[calc(76px+env(safe-area-inset-bottom))] lg:hidden" />
      <nav
        aria-label="Швидкий зв'язок"
        className={`fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-white/8 bg-[rgb(5_16_38/0.88)] px-3 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-500 ease-[var(--ease)] lg:hidden ${shown ? "" : "pointer-events-none translate-y-full"}`}
      >
        <a href="tel:+380503584109" className={`${btn} border border-white/24 text-white active:bg-white/10`}>
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 max-[359px]:hidden" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path
              d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"
              strokeLinejoin="round"
            />
          </svg>
          Зателефонувати
        </a>
        <a href="#contact" data-lead="price" className={`${btn} bg-[var(--accent)] text-[var(--on-accent)] active:bg-white`}>
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 max-[359px]:hidden" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" strokeLinejoin="round" />
            <path d="M14 3v5h5M9 13h6M9 17h4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Запитати ціну
        </a>
      </nav>
    </>
  );
}
