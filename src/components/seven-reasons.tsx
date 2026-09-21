"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type Reason = {
  img: string;
  title: string;
  text: string;
  /** светлая карточка — тёмный текст поверх светлого низа фотографии */
  light: boolean;
};

const REASONS: Reason[] = [
  {
    img: "/screens/s04-c1.png",
    title: "Відповідь\nна ключовий запит",
    text: "Найефективніша відповідь на запит пацієнтів щодо підтягування шкіри.",
    light: true,
  },
  {
    img: "/screens/s04-c2.png",
    title: "Доведений результат",
    text: "Клінічно доведений ефект у понад 90 дослідженнях.",
    light: false,
  },
  {
    img: "/screens/s04-c3.png",
    title: "FDA Approved",
    text: "Офіційне схвалення FDA за кількома показаннями.",
    light: true,
  },
  {
    img: "/screens/s04-c4.png",
    title: "Американська надійність",
    text: "Універсальний якісний апарат від Apyx Medical (США).",
    light: false,
  },
  {
    img: "/screens/s04-c5.jpg",
    title: "Багатофункціональність",
    text: "Найкращий електрохірургічний коагулятор для операційної.",
    light: true,
  },
  {
    img: "/screens/s04-c6.png",
    title: "Високий ROI",
    text: "Швидка окупність та висока маржинальність послуги.",
    light: false,
  },
  {
    img: "/screens/s04-c7.png",
    title: "Реальні До / Після",
    text: "Вражаючі візуальні результати процедур.",
    light: true,
  },
];

function Card({ reason, index }: { reason: Reason; index: number }) {
  const ink = reason.light ? "text-[#051026]" : "text-white";
  return (
    <article className="group relative flex aspect-[300/420] w-[78vw] shrink-0 flex-col justify-end gap-[clamp(10px,1.1vw,16px)] overflow-hidden rounded-[var(--radius-card)] p-[clamp(20px,2.2vw,32px)] sm:aspect-[4/3] sm:w-auto sm:rounded-none">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src={reason.img}
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 78vw"
          className="object-cover transition-transform duration-[900ms] ease-[var(--ease)] group-hover:scale-[1.04]"
        />
        <div className={reason.light ? "veil-light absolute inset-0" : "veil-dark absolute inset-0"} />
      </div>

      <p
        className={`relative text-[clamp(32px,3.3vw,48px)] font-medium leading-none tracking-[-0.02em] opacity-90 ${ink}`}
      >
        0{index + 1}
      </p>
      <p
        className={`relative max-w-[16ch] whitespace-pre-line text-[length:var(--fs-h3)] leading-[1.05] tracking-[-0.02em] ${ink}`}
      >
        {reason.title}
      </p>
      <p className={`relative max-w-[30ch] text-[length:var(--fs-body)] leading-[1.5] opacity-75 ${ink}`}>
        {reason.text}
      </p>
    </article>
  );
}

function Closing() {
  return (
    <div className="flex h-full flex-col justify-end gap-[clamp(10px,1.1vw,16px)] sm:p-[clamp(20px,2.2vw,32px)]">
      <span className="h-px w-12 bg-white/40" aria-hidden />
      <p className="text-[length:var(--fs-body)] uppercase tracking-[0.18em] text-white/55">Правильний вибір</p>
      <a href="#before-after" className="btn group flex items-center gap-5">
        <span className="text-[length:var(--fs-h3)] leading-[1.1] text-white">Без корекції після операції</span>
        <Image src="/svg/arrow-long.svg" alt="" width={36} height={12} unoptimized aria-hidden className="h-3 w-9 shrink-0" />
      </a>
    </div>
  );
}

export function SevenReasons() {
  const [activeIdx, setActiveIdx] = useState(0);
  const swipeRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const step = el.scrollWidth / REASONS.length;
    const idx = Math.min(
      REASONS.length - 1,
      Math.max(0, Math.round(el.scrollLeft / step))
    );
    setActiveIdx(idx);
  };

  return (
    <section className="section">
      <div className="container-site">
        {/*
          На компьютере — сетка на волосяных линиях: заголовок занимает первую ячейку,
          дальше семь карточек и закрывающий блок. На телефоне сетка не читается,
          поэтому заголовок отдельно, а карточки листаются пальцем.
        */}
        <div data-rv className="sm:hidden">
          <h2 className="max-w-[18ch] text-[length:var(--fs-h2)] font-medium leading-[1.05] tracking-[-0.026em] text-white">
            Сім причин, чому Renuvion потрібен клініці
          </h2>
          <p className="mt-4 max-w-[36ch] text-[length:var(--fs-body)] leading-[1.5] text-white/60">
            Сучасна технологія. Реальні результати. Впевненість у&nbsp;кожній деталі.
          </p>
        </div>

        <div
          ref={swipeRef}
          onScroll={handleScroll}
          data-rv
          className="swipe-row mt-8 [--d:120ms] sm:hidden"
        >
          {REASONS.map((r, i) => (
            <Card key={r.title} reason={r} index={i} />
          ))}
        </div>

        {/* Точки пагінації під картками на телефоні */}
        <div className="mt-4 flex items-center justify-center gap-1.5 sm:hidden">
          {REASONS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setActiveIdx(i);
                const el = swipeRef.current;
                if (el) {
                  const card = el.children[i] as HTMLElement | undefined;
                  card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                }
              }}
              aria-label={`Перейти до причини ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIdx === i
                  ? "w-6 bg-[var(--accent)]"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Closing />
        </div>

        {/*
          Каждая ячейка открывается сама, когда доходит до экрана: сетка высокая,
          и общая лесенка проигрывала бы нижние ряды задолго до того, как их увидят.
          Внутри ряда карточки расходятся по колонке — получается по одной, не разом.
        */}
        <div className="hidden border-b border-[var(--hairline)] sm:grid sm:grid-cols-2 lg:grid-cols-3">
          <div data-rv className="flex flex-col justify-start gap-[clamp(12px,1.4vw,20px)] border-t border-[var(--hairline)] pb-[clamp(20px,2.2vw,32px)] pr-[clamp(16px,2.6vw,40px)] pt-[clamp(20px,2.2vw,32px)]">
            <h2 className="max-w-[14ch] text-[length:var(--fs-h2)] font-medium leading-[1.0] tracking-[-0.026em] text-white">
              Сім причин, чому Renuvion потрібен клініці
            </h2>
            <p className="max-w-[32ch] text-[length:var(--fs-body)] leading-[1.5] text-white/60">
              Сучасна технологія. Реальні результати. Впевненість у&nbsp;кожній деталі.
            </p>
          </div>

          {REASONS.map((r, i) => (
            // заголовок занимает первую ячейку, поэтому левая граница — у всех, кроме начала ряда
            <div
              key={r.title}
              data-rv
              style={{ "--d": `${((i + 1) % 3) * 200}ms`, "--dur": "1100ms" } as React.CSSProperties}
              className={`border-t border-[var(--hairline)] ${(i + 1) % 2 === 0 ? "" : "sm:border-l"} ${
                (i + 1) % 3 === 0 ? "lg:border-l-0" : "lg:border-l"
              }`}
            >
              <Card reason={r} index={i} />
            </div>
          ))}

          <div data-rv style={{ "--dur": "1100ms" } as React.CSSProperties} className="border-t border-[var(--hairline)] sm:border-l">
            <Closing />
          </div>
        </div>
      </div>
    </section>
  );
}
