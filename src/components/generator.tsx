"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/**
 * Выноски вокруг панели. Координаты — доли от кадра схемы, а не пиксели:
 * схема масштабируется целиком, подписи и линии едут вместе с панелью.
 * Кадр взят из макета: рабочая область 1440 x 860, отсчёт от y = 240.
 */
type Callout = {
  en: string;
  ua: string;
  /** подпись: доля слева, доля сверху, ширина в долях */
  label: { x: number; y: number; w: number };
  /** линия от подписи к точке */
  line: { x: number; y: number; len: number; horizontal?: boolean };
  dot: { x: number; y: number };
  /** подпись стоит над линией, значит её низ прижат к началу линии */
  above?: boolean;
};

/** Точные координаты деталей на самой панели генератора (в % от габаритов панели) */
const PANEL_DOTS = [
  { x: 27.5, y: 27.9 }, // 1. Monopolar
  { x: 51.0, y: 27.9 }, // 2. Bipolar
  { x: 67.1, y: 27.9 }, // 3. J-Plasma
  { x: 67.1, y: 53.4 }, // 4. Joule Counter
  { x: 32.1, y: 69.8 }, // 5. Split Grounding Pad
  { x: 66.5, y: 70.5 }, // 6. Handpiece Insertion
];

const CALLOUTS: Callout[] = [
  {
    en: "STANDARD MONOPOLAR",
    ua: "Стандартний монополярний режим",
    label: { x: 0.311, y: 0.026, w: 0.13 },
    line: { x: 0.311, y: 0.11, len: 0.183 },
    dot: { x: 0.311, y: 0.293 },
    above: false,
  },
  {
    en: "STANDARD BIPOLAR",
    ua: "Стандартний біполярний режим",
    label: { x: 0.508, y: 0.026, w: 0.13 },
    line: { x: 0.508, y: 0.11, len: 0.183 },
    dot: { x: 0.508, y: 0.293 },
    above: false,
  },
  {
    en: "RENUVION / J-PLASMA",
    ua: "Режим плазмово-RF впливу",
    label: { x: 0.644, y: 0.026, w: 0.13 },
    line: { x: 0.644, y: 0.11, len: 0.183 },
    dot: { x: 0.644, y: 0.293 },
    above: false,
  },
  {
    en: "JOULE COUNTER",
    ua: "Лічильник поданої енергії (Джоулі)",
    label: { x: 0.845, y: 0.428, w: 0.135 },
    line: { x: 0.658, y: 0.451, len: 0.175, horizontal: true },
    dot: { x: 0.644, y: 0.451 },
  },
  {
    en: "SPLIT GROUNDING PAD",
    ua: "Роз’єм нейтрального електрода",
    label: { x: 0.35, y: 0.724, w: 0.16 },
    line: { x: 0.35, y: 0.563, len: 0.161 },
    dot: { x: 0.35, y: 0.553 },
    above: false,
  },
  {
    en: "HANDPIECE INSERTION",
    ua: "Підключення адаптера / насадки",
    label: { x: 0.639, y: 0.724, w: 0.16 },
    line: { x: 0.639, y: 0.567, len: 0.157 },
    dot: { x: 0.639, y: 0.557 },
    above: false,
  },
];

const MODES = [
  "Генератор гелієвої плазми",
  "Монополярний електрокоагулятор",
  "Біполярний електрокоагулятор",
];

const POWER = [
  { value: "300 Вт", label: "Cut (Розріз)" },
  { value: "200 Вт", label: "Blend (Розріз з коагуляцією)" },
];

/*
 * Точка-маркер. Ядро белое в кольце акцента и с тёмным ореолом: половина точек
 * стоит на светлой панели, половина на тёмном фоне, и одноцветная заливка
 * пропадала то там, то там.
 *
 * Появление висит на внутреннем слое: на внешнем стоит центрирующий сдвиг,
 * а переход появления пишет в то же свойство transform и сбил бы точку с места.
 */
function Dot({
  x,
  y,
  delay,
  active,
}: {
  x: number;
  y: number;
  delay: number;
  active?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`absolute size-[clamp(16px,1.9vw,26px)] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ${
        active ? "z-10 scale-125" : "z-0"
      }`}
      style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
    >
      <span
        data-rv="fade"
        style={{ "--d": `${delay}ms`, "--dur": "600ms" } as React.CSSProperties}
        className="absolute inset-0"
      >
        <span
          className={`pulse-ring absolute inset-0 rounded-full border-2 transition-colors duration-300 ${
            active
              ? "border-[var(--accent)] shadow-[0_0_16px_var(--accent)]"
              : "border-[rgb(0_163_224/0.9)]"
          }`}
        />
        <span
          className={`absolute left-1/2 top-1/2 size-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
            active
              ? "scale-110 bg-[var(--accent)] shadow-[0_0_0_3px_white,0_0_20px_6px_rgb(0_163_224/0.9)]"
              : "bg-white shadow-[0_0_0_2.5px_var(--accent),0_0_12px_3px_rgb(2_10_28/0.6)]"
          }`}
        />
      </span>
    </span>
  );
}

export function Generator() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const swipeRowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const selectCallout = (i: number) => {
    setActiveIdx(i);
    const card = cardRefs.current[i];
    const row = swipeRowRef.current;
    if (card && row) {
      const targetLeft =
        card.offsetLeft - row.offsetLeft - (row.clientWidth - card.clientWidth) / 2;
      row.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const row = swipeRowRef.current;
    if (!row) return;
    const scrollCenter = row.scrollLeft + row.clientWidth / 2;
    let closest = 0;
    let minDiff = Infinity;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const center = el.offsetLeft - row.offsetLeft + el.clientWidth / 2;
      const diff = Math.abs(scrollCenter - center);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    });
    setActiveIdx(closest);
  };

  return (
    <section id="generator" className="section">
      <div className="container-site flex flex-col gap-[clamp(28px,3.5vw,56px)]">
        <div data-rv="stagger" className="section-head [--step:120ms]">
          <h2 className="max-w-[18ch] text-[length:var(--fs-h2)] font-medium leading-[1.02] tracking-[-0.026em] text-white">
            Платформа RENUVION
            <br />
            генератор 3&nbsp;в&nbsp;1
          </h2>
          <p className="text-[length:var(--fs-body)] leading-[1.5] text-white/72 lg:text-[length:var(--fs-lead)]">
            Об&rsquo;єднує американську якість та&nbsp;бездоганну
            універсальність для операційного блоку.
          </p>
        </div>

        {/* Схема с выносками — только на компьютере: на узком экране подписи нечитаемы */}
        <div className="relative hidden aspect-[1440/860] w-full lg:block">
          {/* панель: края гасятся маской, иначе виден прямоугольник её собственного фона */}
          <div
            data-rv="scene"
            className="panel-fade absolute left-[8%] top-[12%] h-[62%] w-[84%]"
          >
            <Image
              src="/screens/s05-panel.png"
              alt="Передня панель генератора Renuvion"
              fill
              sizes="(min-width: 1024px) 84vw, 100vw"
              className="object-contain"
            />
          </div>

          {CALLOUTS.map((c, i) => {
            // выноски открываются одна за другой, внутри каждой: точка, линия, подпись
            const base = i * 300;
            // линия всегда растёт от точки: вниз, вверх или вправо — смотря где точка
            const grow = c.line.horizontal
              ? ""
              : c.dot.y > c.line.y
                ? "y-up"
                : "y";
            const isActive = activeIdx === i;
            return (
              <div
                key={c.en}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => setActiveIdx(i)}
                className="cursor-pointer"
              >
                <div
                  data-rv
                  style={
                    {
                      left: `${c.label.x * 100}%`,
                      top:
                        c.above === false
                          ? `${c.label.y * 100}%`
                          : `calc(${c.line.y * 100}% - 12px)`,
                      width: `${c.label.w * 100}%`,
                      "--d": `${base + 760}ms`,
                    } as React.CSSProperties
                  }
                  className={`absolute flex flex-col gap-[6px] transition-all duration-300 ${
                    c.above === false ? "" : "-translate-y-full"
                  } ${isActive ? "scale-105" : ""}`}
                >
                  <p
                    className={`whitespace-nowrap text-[clamp(11px,0.9vw,15px)] uppercase tracking-[0.08em] transition-colors duration-300 ${
                      isActive ? "font-semibold text-white" : "text-[var(--accent)]"
                    }`}
                  >
                    {c.en}
                  </p>
                  <p
                    className={`text-[length:var(--fs-body)] leading-[1.3] transition-colors duration-300 ${
                      isActive ? "text-white" : "text-white/80"
                    }`}
                  >
                    {c.ua}
                  </p>
                </div>

                <span
                  aria-hidden
                  data-draw={grow}
                  className={`absolute transition-all duration-300 ${
                    isActive
                      ? "bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]"
                      : "bg-[rgb(0_163_224/0.85)]"
                  }`}
                  style={
                    {
                      ...(c.line.horizontal
                        ? {
                            left: `${c.line.x * 100}%`,
                            top: `${c.line.y * 100}%`,
                            width: `${c.line.len * 100}%`,
                            height: isActive ? 2 : 1,
                          }
                        : {
                            left: `${c.line.x * 100}%`,
                            top: `${c.line.y * 100}%`,
                            height: `${c.line.len * 100}%`,
                            width: isActive ? 2 : 1,
                          }),
                      "--d": `${base + 340}ms`,
                    } as unknown as React.CSSProperties
                  }
                />
                <Dot x={c.dot.x} y={c.dot.y} delay={base} active={isActive} />
              </div>
            );
          })}

          {/* три режима слева */}
          <div
            data-rv="stagger"
            className="absolute left-0 top-[27%] flex w-[26%] flex-col gap-[10px] [--step:90ms]"
          >
            <p className="text-[clamp(11px,0.9vw,15px)] uppercase tracking-[0.08em] text-[var(--accent)]">
              Три режими
            </p>
            {MODES.map((m) => (
              <p
                key={m}
                className="text-[length:var(--fs-body)] leading-[1.4] text-white/85"
              >
                {m}
              </p>
            ))}
          </div>

          {/* мощности под панелью */}
          <div
            data-count
            className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-[clamp(24px,3.4vw,48px)]"
          >
            {POWER.map((p) => (
              <div key={p.value} className="flex flex-col gap-[6px] text-white">
                <p className="whitespace-nowrap text-[clamp(28px,3.3vw,48px)] font-medium leading-none">
                  {p.value}
                </p>
                <p className="text-[length:var(--fs-body)] opacity-60">
                  {p.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Телефон и планшет: панель с интерактивными точками и свайп-лента */}
        <div className="lg:hidden">
          {/* Контейнер панели генератора с точками-маркерами 1–6 */}
          <div className="relative -mx-[var(--pad)] aspect-[2928/1264] overflow-hidden rounded-[var(--radius-card)] border border-white/8 bg-[#051026]">
            <Image
              src="/screens/s05-panel.png"
              alt="Передня панель генератора Renuvion"
              fill
              sizes="100vw"
              priority
              className="object-contain"
            />

            {/* Подсвечиваемые точки на деталях аппарата */}
            {PANEL_DOTS.map((dot, i) => {
              const isActive = activeIdx === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectCallout(i)}
                  aria-label={`Деталь ${i + 1}: ${CALLOUTS[i].ua}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all duration-300 ${
                    isActive
                      ? "size-8 sm:size-9 z-10 bg-[var(--accent)] text-[#051026] font-bold text-[14px] sm:text-[15px] shadow-[0_0_24px_rgb(0_163_224/0.95)] scale-110"
                      : "size-6 sm:size-7 z-0 bg-[#051026]/90 border border-[var(--accent)] text-[var(--accent)] text-[12px] sm:text-xs font-semibold hover:scale-110"
                  }`}
                  style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                >
                  {isActive && (
                    <span className="absolute -inset-1.5 rounded-full border-2 border-[var(--accent)] animate-ping opacity-75 pointer-events-none" />
                  )}
                  <span>{i + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Интерактивная лента карточек деталей */}
          <div
            ref={swipeRowRef}
            onScroll={handleScroll}
            className="swipe-row mt-6"
          >
            {CALLOUTS.map((c, i) => {
              const isActive = activeIdx === i;
              return (
                <article
                  key={c.en}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  onClick={() => selectCallout(i)}
                  className={`flex w-[240px] cursor-pointer flex-col gap-[10px] rounded-[var(--radius-card)] p-5 transition-all duration-300 ${
                    isActive
                      ? "border border-[var(--accent)] bg-[#0d2348] shadow-[0_12px_36px_rgb(0_163_224/0.25)] -translate-y-1"
                      : "border border-white/6 bg-[var(--bg-elevated)] hover:border-white/20"
                  }`}
                >
                  <span
                    className={`flex size-9 items-center justify-center rounded-full text-[17px] font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-[var(--accent)] text-[#051026] font-bold shadow-[0_0_16px_rgb(0_163_224/0.7)]"
                        : "border border-[rgb(0_163_224/0.5)] text-[var(--accent)]"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <p
                    className={`whitespace-nowrap text-[15px] uppercase tracking-[0.08em] transition-colors duration-300 ${
                      isActive ? "font-semibold text-white" : "text-[var(--accent)]"
                    }`}
                  >
                    {c.en}
                  </p>
                  <p className="text-[length:var(--fs-body)] leading-[1.3] text-white">
                    {c.ua}
                  </p>
                </article>
              );
            })}
          </div>

          {/* Точки пагинации под карточками */}
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {CALLOUTS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectCallout(i)}
                aria-label={`Перейти до пункту ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIdx === i
                    ? "w-6 bg-[var(--accent)]"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <p className="text-[15px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
              Три режими
            </p>
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => (
                <span
                  key={m}
                  className="rounded-[var(--radius-pill)] border border-white/16 px-4 py-2 text-[length:var(--fs-body)] text-white/85"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-[clamp(24px,8vw,48px)]">
            {POWER.map((p) => (
              <div key={p.value} className="flex flex-col gap-[6px] text-white">
                <p className="whitespace-nowrap text-[clamp(28px,8vw,40px)] font-medium leading-none">
                  {p.value}
                </p>
                <p className="text-[length:var(--fs-body)] opacity-60">
                  {p.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
