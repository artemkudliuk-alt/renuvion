"use client";

import { useState, useRef } from "react";

const THESES = [
  {
    tab: "Актуальність",
    text: "Особливо після ліпосакції, швидкого схуднення (зокрема пацієнти на препаратах GLP-1 / Ozempic, агресивні дієти).",
  },
  {
    tab: "Механізм",
    text: "Поєднуючи унікальну силу гелієвої плазми із запатентованою радіочастотною енергією (RF), Renuvion нагріває підшкірні шари безпосередньо під поверхнею, не обпікаючи дерму.",
  },
  {
    tab: "Результат",
    text: "Контрольована доставка енергії сприяє скороченню м’яких підшкірних тканин та активному виробленню колагену, підкреслюючи бажані контури тіла.",
  },
];

export function ProblemSolution() {
  const [active, setActive] = useState(0);
  const swipeContainerRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const isDragging = useRef(false);

  const scrollToCard = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(THESES.length - 1, index));
    setActive(clampedIndex);
    const container = swipeContainerRef.current;
    if (!container) return;
    const cards = container.children;
    const card = cards[clampedIndex] as HTMLElement | undefined;
    if (!card) return;

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const paddingLeft = parseFloat(getComputedStyle(container).paddingLeft) || 20;

    const targetScroll = container.scrollLeft + (cardRect.left - containerRect.left) - paddingLeft;

    container.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: "smooth",
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const container = swipeContainerRef.current;
    if (!container) return;

    isDown.current = true;
    isDragging.current = false;
    startX.current = e.clientX;
    startScrollLeft.current = container.scrollLeft;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDown.current) return;
    const container = swipeContainerRef.current;
    if (!container) return;

    const diff = e.clientX - startX.current;
    if (Math.abs(diff) > 4) {
      if (!isDragging.current) {
        isDragging.current = true;
        container.style.scrollSnapType = "none";
        container.style.scrollBehavior = "auto";
      }
      container.scrollLeft = startScrollLeft.current - diff;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDown.current) return;
    isDown.current = false;
    const container = swipeContainerRef.current;
    if (!container) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    container.style.scrollSnapType = "x mandatory";
    container.style.scrollBehavior = "smooth";

    if (isDragging.current) {
      const children = Array.from(container.children) as HTMLElement[];
      const containerRect = container.getBoundingClientRect();
      const paddingLeft = parseFloat(getComputedStyle(container).paddingLeft) || 20;

      let closestIdx = 0;
      let minDiff = Infinity;
      children.forEach((child, idx) => {
        const childRect = child.getBoundingClientRect();
        const diff = Math.abs(childRect.left - (containerRect.left + paddingLeft));
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });

      scrollToCard(closestIdx);

      setTimeout(() => {
        isDragging.current = false;
      }, 80);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isDragging.current) return;
    const el = e.currentTarget;
    const children = Array.from(el.children) as HTMLElement[];
    if (!children.length) return;

    const containerRect = el.getBoundingClientRect();
    const paddingLeft = parseFloat(getComputedStyle(el).paddingLeft) || 20;

    let closestIdx = 0;
    let minDiff = Infinity;
    children.forEach((child, idx) => {
      const childRect = child.getBoundingClientRect();
      const diff = Math.abs(childRect.left - (containerRect.left + paddingLeft));
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    if (closestIdx !== active) {
      setActive(closestIdx);
    }
  };

  const handleCardClick = (i: number) => {
    if (isDragging.current) return;
    scrollToCard(i);
  };

  return (
    <section className="relative isolate overflow-hidden">
      <div className="container-site grid min-w-0 max-w-full items-stretch gap-[clamp(32px,5vw,72px)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:gap-[clamp(40px,5vw,88px)]">
        {/*
          Фото панели доходит до левого края окна: отрицательный отступ гасит поле контейнера.
          На телефоне это отдельный кадр над текстом, на компьютере — колонка во всю высоту секции.
        */}
        <div data-rv="scene" className="relative -mx-[var(--pad)] h-[clamp(320px,52vh,560px)] lg:-ml-[var(--pad)] lg:mr-0 lg:h-auto lg:min-h-[clamp(560px,72vh,820px)]">
          {/* петля 5 с по кадру s02-device (Kling + склейка), картинка — постер до загрузки */}
          <video
            src="/video/s02-loop.mp4"
            poster="/screens/s02-device.png"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="Панель керування Renuvion крупним планом"
            className="absolute inset-0 size-full object-cover object-center lg:object-[30%_center]"
          />
          {/* левый край мягко уходит в фон, чтобы кадр не упирался в край окна */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-[14%] bg-gradient-to-r from-[var(--bg-deep)] to-transparent"
          />
          {/* правый край растворяется в фон, чтобы стык колонок не читался линией */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-[52%] bg-gradient-to-l from-[var(--bg-deep)] via-[rgb(5_16_38/0.35)] to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-[rgb(5_16_38/0.92)] via-[rgb(5_16_38/0.45)] to-transparent"
          />

          {/* He + RF — крупно поверх фото, у нижнего края */}
          <div data-rv className="absolute inset-x-[var(--pad)] bottom-[clamp(20px,4vw,56px)] flex flex-col gap-[clamp(10px,1.3vw,18px)] [--d:300ms] lg:inset-x-0 lg:left-[var(--pad)] lg:right-auto">
            <p className="text-[length:var(--fs-display)] font-medium leading-[0.9] tracking-[-0.04em] text-[var(--text)]">
              He&nbsp;+&nbsp;RF
            </p>
            <span data-draw className="h-[2px] w-16 bg-[var(--accent)] [--d:260ms]" aria-hidden />
            <p className="max-w-[24ch] text-[length:var(--fs-body)] leading-[1.45] text-[var(--text-muted)]">
              Гелієва плазма і&nbsp;радіочастотна енергія працюють одночасно
            </p>
          </div>
        </div>

        {/* Текстовая колонка */}
        <div data-rv="stagger" className="section flex min-w-0 max-w-full flex-col gap-[clamp(20px,2.6vw,36px)] [--step:110ms] lg:py-[clamp(72px,9vh,140px)]">
          <h2 className="max-w-[18ch] text-[length:var(--fs-h2)] font-medium leading-[1.02] tracking-[-0.026em] text-[var(--text)]">
            Renuvion<sup className="align-super text-[0.5em]">®</sup> вирішує базову естетичну проблему&nbsp;— провисання шкіри.
          </h2>

          <p className="max-w-[46ch] text-[length:var(--fs-lead)] leading-[1.4] text-[var(--text-muted)]">
            Революційний комбінований метод RF&nbsp;+ плазмової підтяжки шкіри для контрольованого і&nbsp;безпечного
            скорочення шкірного лоскуту.
          </p>

          {/* Мобільна версія: свайп-стрічка карток тез (296 px) з індикатором */}
          <div className="flex min-w-0 max-w-full flex-col gap-4 lg:hidden">
            <div
              ref={swipeContainerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onScroll={handleScroll}
              onDragStart={(e) => e.preventDefault()}
              className="swipe-row cursor-grab select-none active:cursor-grabbing"
            >
              {THESES.map((t, i) => (
                <article
                  key={t.tab}
                  onClick={() => handleCardClick(i)}
                  className={`flex w-[296px] shrink-0 cursor-pointer select-none flex-col gap-3 rounded-[var(--radius-card)] p-6 transition-all duration-300 ${
                    i === active
                      ? "border border-[var(--accent)] bg-[#0c2144] shadow-[0_8px_32px_rgb(0_163_224/0.25)]"
                      : "border border-white/6 bg-[var(--bg-elevated)] opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[15px] uppercase tracking-[0.1em] font-medium transition-colors duration-300 ${
                        i === active ? "text-[var(--accent)]" : "text-white/60"
                      }`}
                    >
                      {t.tab}
                    </span>
                    <span className="text-[14px] tabular-nums text-white/50">
                      0{i + 1} / 03
                    </span>
                  </div>
                  <p className="text-[17px] leading-[1.45] text-white/95">
                    {t.text}
                  </p>
                </article>
              ))}
            </div>

            {/* Індикатор свайпу на телефоні */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-[15px] tabular-nums font-medium text-white/60">
                0{active + 1}&nbsp;/&nbsp;03
              </span>
              <div className="flex flex-1 gap-[8px]" role="tablist" aria-label="Вибір тези">
                {THESES.map((t, i) => (
                  <button
                    key={t.tab}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    aria-label={`Перейти до тези: ${t.tab}`}
                    onClick={() => scrollToCard(i)}
                    className="group relative flex h-6 flex-1 items-center"
                  >
                    <span
                      className={`h-[3px] w-full rounded-[2px] transition-all duration-300 ${
                        i === active
                          ? "bg-[var(--accent)] shadow-[0_0_10px_rgb(0_163_224/0.6)]"
                          : "bg-white/20 group-hover:bg-white/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 pl-1">
                <button
                  type="button"
                  aria-label="Попередня теза"
                  onClick={() => scrollToCard(active - 1)}
                  disabled={active === 0}
                  className="flex size-8 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-200 active:bg-white/20 disabled:border-white/10 disabled:text-white/25"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Наступна теза"
                  onClick={() => scrollToCard(active + 1)}
                  disabled={active === THESES.length - 1}
                  className="flex size-8 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-200 active:bg-white/20 disabled:border-white/10 disabled:text-white/25"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Комп'ютер: картка з перемиканням тез (вкладки) */}
          <div className="hidden flex-col gap-[clamp(18px,2.2vw,30px)] rounded-[var(--radius-card)] border border-white/6 bg-[var(--bg-elevated)] p-[clamp(20px,2.4vw,34px)] lg:flex">
            <div className="flex flex-wrap gap-[clamp(16px,1.9vw,28px)]">
              {THESES.map((t, i) => (
                <button
                  key={t.tab}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className="flex flex-col gap-[10px]"
                >
                  <span
                    className={`text-[length:var(--fs-nav)] transition-colors duration-[320ms] ease-[var(--ease)] ${
                      i === active ? "font-medium text-white" : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    {t.tab}
                  </span>
                  {/* полоска едет масштабом, а не перекрашивается */}
                  <span
                    aria-hidden
                    className={`h-[2px] w-full origin-left bg-[var(--accent)] transition-transform duration-[420ms] ease-[var(--ease)] ${
                      i === active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/*
              Все три тезиса лежат в одной ячейке сетки, показывается активный.
              Высота блока = высота самого длинного, поэтому при переключении
              карточка не меняет размер и фото в соседней колонке не прыгает.
            */}
            <div className="grid">
              {THESES.map((t, i) => (
                <p
                  key={t.tab}
                  aria-hidden={i !== active}
                  className={`col-start-1 row-start-1 text-[18px] leading-[1.35] sm:text-[length:var(--fs-h3)] sm:leading-[1.3] text-white/90 transition-opacity duration-[420ms] ease-[var(--ease)] ${
                    i === active ? "anim-swap opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  {t.text}
                </p>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[length:var(--fs-body)] tabular-nums text-white/60">
                0{active + 1}&nbsp;/&nbsp;03
              </span>
              <span className="flex flex-1 gap-[6px]" aria-hidden>
                {THESES.map((t, i) => (
                  <span
                    key={t.tab}
                    className={`h-[2px] flex-1 rounded-[1px] transition-colors duration-[420ms] ease-[var(--ease)] ${
                      i === active ? "bg-[var(--accent)]" : "bg-white/15"
                    }`}
                  />
                ))}
              </span>
            </div>
          </div>

          <p className="max-w-[44ch] text-[length:var(--fs-h3)] leading-[1.25] tracking-[-0.02em] text-[var(--accent)]">
            Renuvion&nbsp;— це хірургічний метод підтягування шкіри, необхідний у&nbsp;сучасній практиці пластичної
            хірургії.
          </p>
        </div>
      </div>
    </section>
  );
}
