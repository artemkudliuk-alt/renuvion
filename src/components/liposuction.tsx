"use client";

import { useRef, useState } from "react";

const STEPS = [
  {
    n: "01",
    title: "Видалення надлишкової\nжирової тканини",
    text: "Ліпосакція створює форму, але знижує наповненість тканин.",
  },
  {
    n: "02",
    title: "Формування анатомічного рельєфу",
    text: "Скульптурування та опрацювання переходів між зонами.",
  },
  {
    n: "03",
    title: "Renuvion — робота з підшкірними\nм’якими тканинами",
    text: "Швидке нагрівання до 85 °C та миттєве охолодження: коагуляція, стягування та адаптація шкіри до нового контуру.",
  },
];

const FORMULA = [
  { term: "Ліпосакція", sub: "Об’єм і форма" },
  { term: "Renuvion", sub: "Адаптація та ліфтинг тканин" },
  { term: "Ідеальний результат", sub: "" },
];

/** шаг, выделенный по умолчанию: именно на нём в работу вступает Renuvion */
const DEFAULT_STEP = 2;

export function Liposuction() {
  // подсветка переезжает за курсором, без курсора возвращается на шаг с Renuvion
  const [hovered, setHovered] = useState<number | null>(null);
  const swipeRef = useRef<HTMLDivElement>(null);
  const activeStep = hovered ?? DEFAULT_STEP;
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const isDragging = useRef(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (typeof window !== "undefined" && window.innerWidth >= 1024)) return;
    const el = swipeRef.current;
    if (!el) return;
    isDown.current = true;
    isDragging.current = false;
    startX.current = e.clientX;
    startScrollLeft.current = el.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDown.current) return;
    const el = swipeRef.current;
    if (!el) return;
    const diff = e.clientX - startX.current;
    if (Math.abs(diff) > 4) {
      if (!isDragging.current) {
        isDragging.current = true;
        el.style.scrollSnapType = "none";
        el.style.scrollBehavior = "auto";
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
      el.scrollLeft = startScrollLeft.current - diff;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDown.current) return;
    isDown.current = false;
    const el = swipeRef.current;
    if (!el) return;

    try {
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }

    el.style.scrollSnapType = "x mandatory";
    el.style.scrollBehavior = "smooth";

    if (isDragging.current) {
      setTimeout(() => {
        isDragging.current = false;
      }, 60);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isDragging.current) return;
    const el = e.currentTarget;
    const step = el.scrollWidth / STEPS.length;
    const idx = Math.min(
      STEPS.length - 1,
      Math.max(0, Math.round(el.scrollLeft / step))
    );
    setHovered(idx);
  };

  return (
    <section id="liposuction" className="section">
      <div className="container-site flex flex-col gap-[clamp(28px,3.5vw,56px)]">
        <div data-rv="stagger" className="section-head [--step:120ms]">
          <h2 className="max-w-[24ch] text-[length:var(--fs-h2)] font-medium leading-[1.02] tracking-[-0.026em] text-[var(--text)]">
            Renuvion&nbsp;+&nbsp;Liposuction:
            <br />
            новий стандарт Body Contouring
          </h2>
          <p className="text-[length:var(--fs-body)] leading-[1.5] text-[var(--text-muted)] lg:text-[length:var(--fs-lead)]">
            Ліпосакція видаляє жир, але створює проблему надлишку шкірного лоскуту. Renuvion розв&rsquo;язує цю проблему
            без додаткових довгих розрізів.
          </p>
        </div>

        {/* Шаги: на компьютере три колонки, на телефоне лента */}
        <div
          ref={swipeRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onScroll={handleScroll}
          data-rv="stagger"
          className="swipe-row cursor-grab select-none active:cursor-grabbing [--step:130ms] lg:grid lg:grid-cols-3 lg:gap-[clamp(16px,1.7vw,24px)] lg:[margin-inline:0] lg:[padding-inline:0]"
        >
          {STEPS.map((s, i) => {
            const on = i === activeStep;
            return (
            <article
              key={s.n}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              onClick={() => setHovered(i)}
              tabIndex={0}
              aria-current={on}
              // длительности намеренно разные: одинаковые читаются как шаблон
              className={`flex w-[78vw] cursor-pointer flex-col justify-between gap-[clamp(24px,4vw,56px)] rounded-[var(--radius-card)] p-[clamp(20px,2.4vw,40px)] transition-[background-color,translate,box-shadow] duration-[620ms] ease-[var(--ease)] sm:w-[320px] lg:w-auto ${
                on
                  ? "-translate-y-1 bg-[#10254a] shadow-[0_18px_48px_rgb(0_0_0/0.35)]"
                  : "bg-[var(--bg-elevated)]"
              }`}
            >
              <p
                className={`text-[clamp(56px,6.5vw,96px)] font-medium leading-[0.88] tracking-[-0.04em] transition-colors duration-[320ms] ease-[var(--ease)] ${
                  on ? "text-[var(--accent)]" : "text-[var(--text-faint)]"
                }`}
              >
                {s.n}
              </p>
              <div className="flex flex-col gap-[clamp(10px,1.1vw,16px)]">
                <p className="whitespace-pre-line text-[length:var(--fs-h3)] leading-[1.08] tracking-[-0.02em] text-[var(--text)]">
                  {s.title}
                </p>
                <p className="text-[length:var(--fs-body)] leading-[1.55] text-[var(--text-muted)]">{s.text}</p>
              </div>
            </article>
            );
          })}
        </div>

        {/* Точки пагінації під кроками на телефоні */}
        <div className="flex items-center justify-center gap-1.5 lg:hidden">
          {STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setHovered(i);
                const el = swipeRef.current;
                if (el) {
                  const card = el.children[i] as HTMLElement | undefined;
                  card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                }
              }}
              aria-label={`Перейти до кроку ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeStep === i
                  ? "w-6 bg-[var(--accent)]"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Формула */}
        <div data-rv="stagger" className="flex flex-col gap-[clamp(14px,1.6vw,24px)] [--step:110ms] sm:flex-row sm:flex-wrap sm:items-center sm:gap-[clamp(16px,2.2vw,32px)]">
          {FORMULA.map((f, i) => (
            <div key={f.term} className="flex items-center gap-[clamp(14px,1.6vw,24px)]">
              {i > 0 && (
                <span
                  aria-hidden
                  className="text-[clamp(26px,2.8vw,40px)] font-medium leading-none text-[var(--accent)]"
                >
                  {i === 1 ? "+" : "="}
                </span>
              )}
              <span className="flex flex-col gap-1">
                <span className="text-[length:var(--fs-h3)] leading-[1.08] tracking-[-0.02em] text-[var(--text)]">
                  {f.term}
                </span>
                {f.sub && (
                  <span className="text-[length:var(--fs-body)] leading-[1.5] text-[var(--text-faint)]">{f.sub}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
