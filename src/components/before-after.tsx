"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const CASES = [
  {
    zone: "Живіт",
    before: "/screens/s12-before.jpg",
    after: "/screens/s12-after.jpg",
    caption: "Живіт / 40 років / ультразвукова ліпосакція + Renuvion, 150 cc / 2 роки після",
    photo:
      "Фото: Vaishali Doolabh, MD. Пацієнтка — співробітниця Apyx Medical. Як і після будь-якої процедури, результати індивідуальні.",
  },
  {
    zone: "Шия та підборіддя",
    before: "/screens/s12-neck-before.jpg",
    after: "/screens/s12-neck-after.jpg",
    caption: "Шия / 66 років / PAL + Renuvion, 75 cc / 6 місяців",
    photo: "Фото: Brian E. Rosett, MD",
  },
  {
    zone: "Руки",
    before: "/screens/s12-arms-before.jpg",
    after: "/screens/s12-arms-after.jpg",
    caption: "Руки / 71 рік / PAL + Renuvion, 400 cc жиру / 12 тижнів",
    photo: "Фото: David Benvenuti, MD",
  },
  {
    zone: "Стегна",
    before: "/screens/s12-thighs-before.jpg",
    after: "/screens/s12-thighs-after.jpg",
    caption: "Стегна / 53 роки / ліпосакція + Renuvion, 1 100 cc / 5 тижнів",
    photo: "Фото: Melinda Lacerna, MD",
  },
];

const FILTERS = ["Всі", ...CASES.map((c) => c.zone)];

export function BeforeAfter() {
  const [filter, setFilter] = useState("Живіт");
  const [opened, setOpened] = useState<string | null>(null);
  const [pos, setPos] = useState(50);
  const [hinted, setHinted] = useState(false);
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<HTMLDivElement>(null);

  // при першій появі лінія один раз проїжджає — показує, що кадр можна тягнути
  useEffect(() => {
    const el = box.current;
    if (!el || hinted) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setHinted(true);
        const from = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - from) / 1400);
          setPos(50 + Math.sin(t * Math.PI) * 18);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hinted]);

  // Вибраний головний кейс (за фільтром або кліком)
  const targetZone = opened ?? (filter === "Всі" ? CASES[0].zone : filter);
  const main = CASES.find((c) => c.zone === targetZone) ?? CASES[0];
  // Інші кейси: показуємо всі інші 3 кейси, доступні для свайпу
  const otherCases = CASES.filter((c) => c !== main);

  const handleCaseScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const step = el.scrollWidth / otherCases.length;
    const idx = Math.min(
      otherCases.length - 1,
      Math.max(0, Math.round(el.scrollLeft / step))
    );
    setActiveCaseIdx(idx);
  };

  return (
    <section id="before-after" className="section">
      <div className="container-site flex flex-col gap-[clamp(24px,3vw,48px)]">
        <div className="flex flex-col gap-[clamp(16px,2vw,32px)] lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <h2 data-rv className="max-w-[16ch] text-[length:var(--fs-h2)] font-medium leading-[1.02] tracking-[-0.026em] text-white">
            Клінічні результати
            <br />
            До&nbsp;/&nbsp;Після
          </h2>

          <div data-rv="stagger" className="-mx-[var(--pad)] flex gap-2 overflow-x-auto px-[var(--pad)] [--step:60ms] [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:justify-end lg:px-0">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFilter(f);
                  setOpened(null);
                }}
                aria-pressed={f === filter}
                className={`min-h-11 shrink-0 rounded-[var(--radius-pill)] border px-5 text-[length:var(--fs-body)] transition-colors duration-[500ms] ease-[var(--ease)] ${
                  f === filter
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-[var(--hairline)] text-[var(--text-muted)] hover:border-white/30"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid min-w-0 gap-[clamp(20px,2.6vw,40px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.52fr)] lg:items-start">
          {/* Сравнение: линию тянут мышью или пальцем */}
          <div className="flex min-w-0 flex-col gap-[clamp(12px,1.4vw,20px)]">
            <div ref={box} className="relative aspect-[820/600] w-full select-none overflow-hidden rounded-[var(--radius-card)]">
              <Image
                key={main.before}
                src={main.before}
                alt={`${main.zone} до процедури`}
                fill
                sizes="(min-width: 1024px) 57vw, 100vw"
                className="anim-swap object-cover"
              />
              <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
                <Image
                  key={main.after}
                  src={main.after}
                  alt={`${main.zone} після процедури`}
                  fill
                  sizes="(min-width: 1024px) 57vw, 100vw"
                  className="anim-swap object-cover"
                />
              </div>
              <span className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-white" style={{ left: `${pos}%` }} aria-hidden />
              <span
                className="pointer-events-none absolute top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgb(0_0_0/0.35)]"
                style={{ left: `${pos}%` }}
                aria-hidden
              >
                <svg viewBox="0 0 24 24" className="size-5 text-[var(--bg-deep)]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
                </svg>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={pos}
                onChange={(e) => setPos(Number(e.target.value))}
                aria-label="Порівняння до і після"
                className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <p className="text-[length:var(--fs-body)] leading-[1.5] text-white lg:text-[length:var(--fs-lead)]">
                {main.caption}
              </p>
              <p className="text-[length:var(--fs-body)] leading-[1.5] text-[var(--text-faint)]">{main.photo}</p>
            </div>
          </div>

          {/* Інші кейси: клік відкриває кейс у великому кадрі */}
          <div className="min-w-0">
            <p className="pb-4 text-[length:var(--fs-h3)] leading-[1.1] text-white lg:hidden">Інші кейси</p>
            <div
              ref={swipeRef}
              onScroll={handleCaseScroll}
              className="swipe-row lg:flex-col lg:gap-[clamp(18px,2.2vw,32px)] lg:overflow-visible lg:[margin-inline:0] lg:[padding-inline:0]"
            >
              {otherCases.map((o) => (
                <button
                  key={o.caption}
                  type="button"
                  onClick={() => {
                    setOpened(o.zone);
                    setFilter(o.zone);
                  }}
                  aria-pressed={o === main}
                  className={`flex w-[72vw] cursor-pointer flex-col gap-[10px] rounded-[var(--radius-field)] p-2 text-left transition-colors duration-[420ms] ease-[var(--ease)] sm:w-[300px] lg:w-full ${
                    o === main ? "bg-white/8" : "hover:bg-white/5"
                  }`}
                >
                  <div className="grid w-full grid-cols-2 gap-[2px]">
                    {[o.before, o.after].map((src, n) => (
                      <div key={src} className="relative aspect-[210/120] overflow-hidden">
                        <Image src={src} alt={n ? "Після" : "До"} fill sizes="(min-width: 1024px) 15vw, 36vw" className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[length:var(--fs-body)] leading-[1.5] text-white">{o.caption}</p>
                  <p className="text-[length:var(--fs-body)] leading-[1.5] text-[var(--text-faint)]">{o.photo}</p>
                </button>
              ))}
            </div>

            {/* Точки пагінації під іншими кейсами на телефоні */}
            <div className="mt-4 flex items-center justify-center gap-1.5 lg:hidden">
              {otherCases.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setActiveCaseIdx(i);
                    const el = swipeRef.current;
                    if (el) {
                      const card = el.children[i] as HTMLElement | undefined;
                      card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                    }
                  }}
                  aria-label={`Перейти до кейсу ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeCaseIdx === i
                      ? "w-6 bg-[var(--accent)]"
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
