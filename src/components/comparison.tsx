"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const ROWS = [
  { p: "Вид енергії", rf: "Біполярна RF-енергія", ren: "RF + Гелієва плазма" },
  {
    p: "Механізм передачі",
    rf: "Між внутрішнім та зовнішнім електродами",
    ren: "Сфокусований плазмово‑RF потік безпосередньо у тканину",
  },
  { p: "Швидкість нагріву", rf: "Поступове нагрівання", ren: "Миттєве (долі секунди до 85 °C)" },
  {
    p: "Термічний контроль",
    rf: "Повільне охолодження, ризик градієнта",
    ren: "Локальний вплив із миттєвим охолодженням гелієм",
  },
  {
    p: "Безпека для епідермісу",
    rf: "Потребує постійного моніторингу T° шкіри",
    ren: "Поверхня шкіри не нагрівається вище 41 °С (без опіків)",
  },
  {
    p: "Ключовий ефект",
    rf: "Прогрів та коагуляція",
    ren: "Максимальне скорочення колагену та ліфтинг підшкірних тканин",
  },
];

const SIDES = [
  { src: "/screens/s08-rf.jpg", tag: "Класичний підхід", title: "Преміальний біполярний RF", accent: false, video: "" },
  { src: "/screens/s08-renuvion.jpg", tag: "Renuvion", title: "Гелієва плазма + RF", accent: true, video: "/hero/scene-loop.mp4" },
];

function Minus() {
  return (
    <svg viewBox="0 0 24 24" className="mt-[3px] size-[clamp(18px,1.6vw,24px)] shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="1.5" />
      <path d="M8 12h8" stroke="#fff" strokeOpacity=".5" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="mt-[3px] size-[clamp(18px,1.6vw,24px)] shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#34D399" fillOpacity=".14" stroke="#34D399" strokeWidth="1.5" />
      <path d="m7.5 12.4 3 3 6-6.4" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Comparison() {
  const [activeIdx, setActiveIdx] = useState(0);
  const swipeRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const step = el.scrollWidth / ROWS.length;
    const idx = Math.min(
      ROWS.length - 1,
      Math.max(0, Math.round(el.scrollLeft / step))
    );
    setActiveIdx(idx);
  };

  return (
    <section className="section">
      <div className="container-site flex flex-col gap-[clamp(28px,3.5vw,56px)]">
        <h2 data-rv className="max-w-[26ch] text-[length:var(--fs-h2)] font-medium leading-[1.02] tracking-[-0.026em] text-white">
          Порівняння технологій:
          <br className="hidden sm:inline" />{" "}
          чому Renuvion переважає класичний RF
        </h2>

        {/* Шапка versus: два окремі кадри з відчутним відступом та більшим миготливим значком VS по центру */}
        <div data-rv="scene" className="relative grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-6 lg:gap-8">
          {SIDES.map((s) => (
            <div
              key={s.tag}
              className={`relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-[#07132b] lg:aspect-[640/380] shadow-[0_12px_36px_rgb(0_0_0/0.45)] ${
                s.accent ? "border border-[rgb(0_163_224/0.4)]" : "border border-white/10"
              }`}
            >
              {s.video ? (
                // та же петля, что на первом экране; кадр шире карточки — увеличен к аппарату, как на прежней картинке
                <video
                  src={s.video}
                  poster="/hero/scene.png"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={s.title}
                  className="absolute inset-0 size-full origin-[88%_78%] scale-[1.22] object-cover"
                />
              ) : (
                <Image src={s.src} alt={s.title} fill sizes="(min-width: 1024px) 45vw, 50vw" className="object-cover" />
              )}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[rgb(5_16_38/0.92)] to-transparent" />
              <div className="absolute inset-x-[clamp(14px,2vw,32px)] bottom-[clamp(14px,2vw,32px)] flex flex-col gap-[6px]">
                <p
                  className={`text-[clamp(14px,1vw,15px)] uppercase tracking-[0.16em] ${
                    s.accent ? "text-[var(--accent)]" : "text-white/60"
                  }`}
                >
                  {s.tag}
                </p>
                <p className="text-[length:var(--fs-h3)] font-medium leading-[1.2] text-white">{s.title}</p>
              </div>
            </div>
          ))}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <span
              aria-hidden
              className="pulse-ring absolute -inset-2 rounded-full border-2 border-[var(--accent)]"
            />
            <span className="vs-breathe flex size-[clamp(56px,7vw,76px)] items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[#051026] text-[clamp(18px,2vw,24px)] font-bold text-white shadow-[0_0_32px_rgb(0_163_224/0.75)]">
              VS
            </span>
          </div>
        </div>

        {/* Телефон: легенда і лента параметрів */}
        <div className="lg:hidden">
          <div className="flex gap-7 pb-4 text-[clamp(15px,3.8vw,16px)] font-medium uppercase tracking-[0.12em]">
            <span className="flex items-center gap-2 text-white/60">
              <Minus /> Біполярний RF
            </span>
            <span className="flex items-center gap-2 text-[var(--accent)]">
              <Check /> Renuvion
            </span>
          </div>
          <div
            ref={swipeRef}
            data-lenis-prevent
            onScroll={handleScroll}
            className="swipe-row"
          >
            {ROWS.map((r) => (
              <article
                key={r.p}
                className="flex w-[78vw] flex-col gap-[14px] rounded-[var(--radius-card)] bg-[var(--bg-elevated)] p-5 sm:w-[320px]"
              >
                <p className="text-[length:var(--fs-body)] text-white/70">{r.p}</p>
                <p className="flex items-start gap-2 text-[length:var(--fs-body)] leading-[1.45] text-white/65">
                  <Minus />
                  {r.rf}
                </p>
                <p className="flex items-start gap-2 text-[length:var(--fs-body)] font-medium leading-[1.45] text-white">
                  <Check />
                  {r.ren}
                </p>
              </article>
            ))}
          </div>

          {/* Точки пагінації під параметрами на телефоні */}
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {ROWS.map((_, i) => (
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
                aria-label={`Перейти до параметра ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIdx === i
                    ? "w-6 bg-[var(--accent)]"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Компьютер: таблица с выделенной колонкой Renuvion */}
        <div className="relative hidden lg:block">
          {/* подложка правой колонки — она главная в сравнении */}
          <div aria-hidden className="absolute inset-y-0 right-0 w-1/2 rounded-[var(--radius-card)] bg-[#0b1933]" />
          <div data-rv="stagger" className="relative [--step:70ms]">
            {ROWS.map((r) => (
              <div key={r.p} className="group grid grid-cols-2 border-t border-white/10 py-[clamp(16px,1.8vw,24px)] transition-colors duration-[420ms] ease-[var(--ease)] hover:border-white/25">
                <div className="pr-[clamp(16px,2.2vw,32px)]">
                  <p className="text-[length:var(--fs-body)] leading-[1.4] text-white/55">{r.p}</p>
                  <p className="mt-[10px] flex items-start gap-[clamp(10px,1vw,14px)] text-[length:var(--fs-lead)] leading-[1.4] text-white/65">
                    <Minus />
                    <span>{r.rf}</span>
                  </p>
                </div>
                <p className="flex items-start gap-[clamp(10px,1vw,14px)] self-end pl-[clamp(16px,2.2vw,32px)] text-[length:var(--fs-lead)] font-medium leading-[1.4] text-white transition-transform duration-[520ms] ease-[var(--ease)] group-hover:translate-x-1">
                  <Check />
                  <span>{r.ren}</span>
                </p>
              </div>
            ))}
            <div className="border-t border-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
