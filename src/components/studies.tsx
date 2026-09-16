"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const PAPERS = [
  {
    img: "/screens/s10-paper1.jpg",
    title:
      "Радіочастотна енергія на основі гелієвої плазми для скорочення шкіри: клінічне застосування, рекомендації з безпеки та результати в хірургії контурування тіла High Definition",
    original:
      "Helium Plasma-Driven Radiofrequency for Skin Contraction: Clinical Use, Safety Recommendations, and Results in High-Definition Body Contouring Surgery",
    meta: "Alfredo E. Hoyos та ін. / Aesthetic Surgery Journal Open Forum, 2025",
    // DOI взят из самого PDF статьи, лежащего в проекте
    href: "https://doi.org/10.1093/asjof/ojae118",
  },
  {
    img: "/screens/s10-paper2.jpg",
    title: "Покращення контуру задньої поверхні тулуба та сідниць",
    original: "Posterior Torso and Buttocks Contour Enhancement",
    meta: "Edward M. Zimmerman / IntechOpen, 2021",
    // ссылки нет: в PDF главы DOI не указан, выдумывать адрес нельзя
    href: null,
  },
  {
    img: "/screens/s10-paper3.jpg",
    title:
      "Ультразвукова ліпосакція за підтримки гелієвої плазми для контурування тіла: ретроспективне когортне дослідження 639 пацієнтів",
    original:
      "Ultrasound and Helium Plasma-Assisted Liposuction for Body Contouring: A Single-Retrospective Cohort Study of 639 Patients",
    meta: "Domiano Tambasco та ін. / Aesthetic Plastic Surgery, 2024",
    href: "https://doi.org/10.1007/s00266-024-04367-6",
  },
];

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d={dir === "right" ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Studies() {
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const isDragging = useRef(false);

  const go = (next: number) => {
    const el = track.current;
    if (!el) return;
    const n = Math.max(0, Math.min(PAPERS.length - 1, next));
    const card = el.children[n] as HTMLElement;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
    setI(n);
  };

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement;
    const second = el.children[1] as HTMLElement | undefined;
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    setI(Math.round(el.scrollLeft / step));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const el = track.current;
    if (!el) return;
    isDown.current = true;
    isDragging.current = false;
    startX.current = e.clientX;
    startScrollLeft.current = el.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDown.current) return;
    const el = track.current;
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
    const el = track.current;
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
      onScroll();
      setTimeout(() => {
        isDragging.current = false;
      }, 60);
    }
  };

  return (
    <section id="studies" className="section">
      <div className="container-site flex flex-col gap-[clamp(28px,3.5vw,56px)]">
        <div data-rv="stagger" className="section-head [--step:120ms]">
          <h2 className="max-w-[20ch] text-[length:var(--fs-h2)] font-medium leading-[1.02] tracking-[-0.026em] text-white">
            Наукове підтвердження
            <br />
            та&nbsp;клінічні дослідження
          </h2>
          <p className="text-[length:var(--fs-body)] leading-[1.5] text-[var(--text-muted)] lg:text-[length:var(--fs-lead)]">
            Для членів клубу Renuvion відкритий доступ до&nbsp;порталу із&nbsp;понад 90&nbsp;авторитетними науковими
            публікаціями світових хірургів (Alfredo E. Hoyos, Domiano Tambasco, Edward M. Zimmerman та&nbsp;ін.).
          </p>
        </div>

        <div
          ref={track}
          data-lenis-prevent
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onScroll={onScroll}
          data-rv="stagger"
          className="swipe-row cursor-grab select-none active:cursor-grabbing [--step:110ms] lg:gap-[clamp(20px,2.6vw,40px)]"
        >
          {PAPERS.map((p) => (
            <article key={p.title} className="flex w-[78vw] flex-col gap-[clamp(10px,1.3vw,20px)] sm:w-[340px] lg:w-[clamp(340px,37vw,540px)]">
              <div className="relative aspect-[540/300] w-full overflow-hidden bg-white">
                <Image
                  src={p.img}
                  alt={`Перша сторінка статті «${p.original}»`}
                  fill
                  sizes="(min-width: 1024px) 37vw, 78vw"
                  className="object-cover object-top"
                />
              </div>
              {p.href ? (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener"
                  className="u-link w-fit text-[length:var(--fs-body)] leading-[1.3] tracking-[-0.01em] text-white hover:text-[var(--accent)] lg:text-[length:var(--fs-lead)] lg:leading-[1.25]"
                >
                  {p.title}
                </a>
              ) : (
                <p className="text-[length:var(--fs-body)] leading-[1.3] tracking-[-0.01em] text-white lg:text-[length:var(--fs-lead)] lg:leading-[1.25]">
                  {p.title}
                </p>
              )}
              {/* оригинальное название оставлено: по нему статью находят в базах */}
              <p className="text-[length:var(--fs-body)] leading-[1.4] text-[var(--text-faint)]">{p.original}</p>
              <p className="text-[length:var(--fs-body)] leading-[1.5] text-[var(--text-faint)]">{p.meta}</p>
            </article>
          ))}
        </div>

        <div className="flex flex-col gap-[clamp(16px,2vw,32px)] lg:flex-row lg:items-center lg:justify-between">
          <a
            href="#contact"
            data-lead="materials"
            className="btn group inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-[var(--radius-pill)] bg-[var(--accent)] px-6 py-3.5 text-center text-[17px] font-semibold text-[var(--on-accent)] transition-all duration-[400ms] ease-[var(--ease)] hover:bg-white sm:text-[18px] lg:w-auto lg:px-8 lg:text-[length:var(--fs-btn)]"
          >
            <span>Замовити повний пакет клінічних досліджень</span>
            <svg viewBox="0 0 24 24" className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <div className="flex items-center gap-4">
            <span className="text-[15px] tabular-nums font-medium text-white/60">0{i + 1}&nbsp;/&nbsp;03</span>
            <div className="flex flex-1 gap-[8px] lg:flex-none" role="tablist" aria-label="Вибір статті">
              {PAPERS.map((p, n) => (
                <button
                  key={p.title}
                  type="button"
                  role="tab"
                  aria-selected={n === i}
                  aria-label={`Перейти до статті ${n + 1}`}
                  onClick={() => go(n)}
                  className="group relative flex h-6 flex-1 items-center lg:w-16 lg:flex-none"
                >
                  <span
                    className={`h-[3px] w-full rounded-[2px] transition-all duration-300 ${
                      n === i ? "bg-[var(--accent)] shadow-[0_0_10px_rgb(0_163_224/0.6)]" : "bg-white/20 group-hover:bg-white/40"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="hidden gap-3 lg:flex">
              {(["left", "right"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-label={d === "left" ? "Попередня стаття" : "Наступна стаття"}
                  onClick={() => go(i + (d === "left" ? -1 : 1))}
                  disabled={d === "left" ? i === 0 : i === PAPERS.length - 1}
                  className="flex size-12 items-center justify-center rounded-full border border-white/50 text-white transition-colors duration-[500ms] ease-[var(--ease)] hover:bg-white/10 disabled:border-white/18 disabled:text-white/40"
                >
                  <Chevron dir={d} />
                </button>
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
