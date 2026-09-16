"use client";

import { useRef, useState } from "react";
import Image from "next/image";

const SURGEONS = [
  { name: "Д-р Альфредо Ойос", note: "Колумбія — піонер High Definition скульптурування тіла", img: "/screens/s11-hoyos.jpg" },
  { name: "Д-р Жорді Мір Батлле", note: "Іспанія", img: "/screens/s11-mir.jpg" },
  {
    name: "Д-р Едвард М. Ціммерман",
    note: "США — президент American Board of Laser Surgery",
    img: "/screens/s11-zimmerman.jpg",
  },
  { name: "Д-р Сергій Дербак", note: "Україна — пластичний реконструктивний хірург", img: "/screens/s11-derbak.jpg" },
  { name: "Д-р Олександр Бебих", note: "Україна", img: "/screens/s11-bebykh.jpg" },
  { name: "Д-р Ганна Бродська", note: "Україна", img: "/screens/s11-brodska.jpg" },
  { name: "Д-р Віктор Чепесюк", note: "Україна", img: "/screens/s11-chepesiuk.jpg" },
];

const BULLETS = [
  "Авторизоване навчання з клінічним тренером Apyx Medical (включено у вартість).",
  "Доступ до закритих вебінарів, майстер-класів та Live Surgery.",
];

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d={dir === "right" ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Club() {
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.4);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? Math.min(1, (el.clientWidth + el.scrollLeft) / el.scrollWidth) : 1);
  };

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement;
    const second = el.children[1] as HTMLElement | undefined;
    el.scrollBy({ left: dir * (second ? second.offsetLeft - first.offsetLeft : first.offsetWidth), behavior: "smooth" });
  };

  return (
    <section id="club" className="section">
      <div className="container-site flex flex-col gap-[clamp(28px,3.5vw,56px)]">
        <div data-rv="stagger" className="section-head [--step:120ms]">
          <div className="flex flex-col gap-[clamp(20px,2.6vw,40px)]">
            <h2 className="max-w-[16ch] text-[length:var(--fs-h2)] font-medium leading-[1.02] tracking-[-0.026em] text-white">
              Вибір кращих:
              <br />
              Клуб Renuvion
            </h2>

            {/* стопка аватаров — кто уже в клубе */}
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-[clamp(14px,1.6vw,22px)]">
              <div data-rv="stagger" className="flex [--step:80ms]">
                {SURGEONS.slice(0, 5).map((s, n) => (
                  <span
                    key={s.name}
                    className="relative aspect-square w-[clamp(38px,6.3vw,90px)] shrink-0 overflow-hidden rounded-full border-2 sm:border-[3px] border-[var(--bg-deep)]"
                    style={{ marginLeft: n ? "clamp(-15px, -1vw, -10px)" : 0 }}
                  >
                    <Image src={s.img} alt="" fill sizes="(min-width: 1024px) 7vw, 22vw" className="object-cover object-[50%_18%]" />
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-[2px]">
                <p className="text-[length:var(--fs-body)] font-medium text-white">Хірурги, які вже в&nbsp;клубі</p>
                <p className="text-[length:var(--fs-body)] text-white/60">Колумбія, Іспанія, США, Україна</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="pb-[clamp(16px,2vw,28px)] text-[length:var(--fs-body)] leading-[1.5] text-white lg:text-[length:var(--fs-lead)] lg:leading-[1.45]">
              Купуючи апарат, ви&nbsp;стаєте частиною закритого співтовариства провідних пластичних хірургів світу.
            </p>
            {BULLETS.map((b) => (
              <p
                key={b}
                className="border-t border-[var(--hairline)] py-[clamp(12px,1.6vw,22px)] text-[length:var(--fs-body)] leading-[1.5] text-[var(--text-muted)] lg:text-[length:var(--fs-lead)] lg:leading-[1.45]"
              >
                {b}
              </p>
            ))}
          </div>
        </div>

        <p className="text-[length:var(--fs-h3)] leading-[1.08] tracking-[-0.02em] text-white">
          Хірурги, які обирають Renuvion
        </p>
      </div>

      {/* Лента портретов — во всю ширину окна, чтобы карточки уходили за край */}
      <div
        ref={track}
        onScroll={onScroll}
        data-rv="stagger"
        className="swipe-row mt-[clamp(16px,2vw,28px)] [margin-inline:0] [--step:90ms] lg:gap-[clamp(16px,1.7vw,24px)]"
      >
        {SURGEONS.map((s) => (
          <article key={s.name} className="group flex w-[72vw] flex-col gap-[clamp(10px,1.2vw,18px)] sm:w-[260px] lg:w-[clamp(240px,19vw,280px)]">
            <div className="relative aspect-[280/360] w-full overflow-hidden">
              <Image
                src={s.img}
                alt={s.name}
                fill
                sizes="(min-width: 1024px) 19vw, 72vw"
                className="object-cover transition-transform duration-[900ms] ease-[var(--ease)] group-hover:scale-[1.04]"
              />
            </div>
            <p className="text-[length:var(--fs-h3)] leading-[1.08] tracking-[-0.02em] text-white">{s.name}</p>
            <p className="text-[length:var(--fs-body)] leading-[1.5] text-[var(--text-faint)]">{s.note}</p>
          </article>
        ))}
      </div>

      <div className="container-site mt-[clamp(20px,2.6vw,40px)] flex items-center gap-[clamp(16px,2.2vw,32px)]">
        <div className="relative h-[2px] flex-1 bg-white/12" aria-hidden>
          <span
            className="absolute left-0 top-0 h-full bg-[var(--accent)] transition-[width] duration-[500ms] ease-[var(--ease)]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="hidden gap-3 lg:flex">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-label={d < 0 ? "Попередні хірурги" : "Наступні хірурги"}
              onClick={() => step(d)}
              className="flex size-12 items-center justify-center rounded-full border border-white/50 text-white transition-colors duration-[500ms] ease-[var(--ease)] hover:bg-white/10"
            >
              <Chevron dir={d < 0 ? "left" : "right"} />
            </button>
          ))}
        </span>
      </div>
    </section>
  );
}
