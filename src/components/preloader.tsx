"use client";

import { useEffect, useRef, useState } from "react";
import { LOGO_PATHS } from "./footer-outline";

/*
 * Прелоадер.
 * 1. Контур логотипа прорисовывается штрихом.
 * 2. Буквы заливаются снизу вверх по мере загрузки: шрифты, картинки, видимые фоновые видео.
 *    Полный ролик (39 МБ) не ждём — он грузится только по нажатию.
 * 3. Пролёт: буквы становятся окнами (маска в сплошном фоне), сквозь них видна страница,
 *    и логотип стремительно растёт к точке внутри самой толстой буквы — камера пролетает насквозь.
 *
 * Оверлей виден только под классом html.is-loading (ставит скрипт в <head>, при reduced-motion — нет).
 * По окончании: класс снят, событие preloader:done — site-motion.tsx запускает появления и прокрутку.
 */

// первые 12 контуров — сам логотип; дальше подпись, которую в подвале обрезает рамка
const PATHS = LOGO_PATHS.slice(0, 12);
const VIEWBOX = { x: 10, y: 8, w: 376, h: 66 };
// Точка пролёта: ближайшая к центру логотипа (197.7, 40) точка внутри буквы «u» и её «радиус»
// в единицах логотипа (замерено по isPointInFill). Сам центр приходится на промежуток между буквами —
// зум туда закрыл бы экран фоном, поэтому на пролёте эта точка ещё и съезжает в центр экрана.
const FOCUS = { x: 183.2, y: 40, r: 3 };

const MIN_MS = 1900; // прорисовка должна успеть закончиться, даже если всё уже в кэше
const MAX_MS = 9000; // медленная сеть: дальше не держим
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function trackAssets(onProgress: (p: number) => void) {
  const tasks: Promise<unknown>[] = [
    document.fonts?.ready ?? Promise.resolve(),
    document.readyState === "complete" ? Promise.resolve() : new Promise((r) => window.addEventListener("load", r, { once: true })),
  ];
  document.querySelectorAll<HTMLVideoElement>("video[autoplay]").forEach((v) => {
    if (!v.getClientRects().length) return; // дубль другой раскладки
    tasks.push(
      v.readyState >= 3
        ? Promise.resolve()
        : new Promise((r) => {
            v.addEventListener("canplaythrough", r, { once: true });
            v.addEventListener("error", r, { once: true });
          }),
    );
  });
  let done = 0;
  onProgress(0);
  tasks.forEach((t) => t.then(() => onProgress(++done / tasks.length)));
}

export function Preloader() {
  const [gone, setGone] = useState(false);
  const logo = useRef<SVGSVGElement>(null);
  const hole = useRef<SVGSVGElement>(null);
  const zoom = useRef<SVGGElement>(null);
  const fillRect = useRef<SVGRectElement>(null);
  const fillGroup = useRef<SVGGElement>(null);
  const holeGroup = useRef<SVGGElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const root = document.documentElement;
    const finish = () => {
      window.scrollTo(0, 0);
      root.classList.remove("is-loading");
      document.dispatchEvent(new Event("preloader:done"));
      setGone(true);
    };
    if (!root.classList.contains("is-loading")) {
      finish();
      return;
    }

    // размер: на телефоне почти во всю ширину, на компьютере крупно, но с воздухом
    const place = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const width = Math.min(w < 768 ? w * 0.88 : w * 0.64, 1180);
      const height = (width * VIEWBOX.h) / VIEWBOX.w;
      for (const svg of [logo.current, hole.current]) {
        svg?.setAttribute("x", String((w - width) / 2));
        svg?.setAttribute("y", String((h - height) / 2));
        svg?.setAttribute("width", String(width));
        svg?.setAttribute("height", String(height));
      }
      return { w, h, scale: width / VIEWBOX.w };
    };
    place();
    window.addEventListener("resize", place);

    // 1. прорисовка
    const strokes = [...(logo.current?.querySelectorAll<SVGPathElement>("[data-stroke] path") ?? [])];
    strokes.forEach((p, i) => {
      p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: 1500,
        delay: i * 45,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
        fill: "both",
      });
    });

    // 2. заливка догоняет загрузку, но не обгоняет прорисовку
    const start = performance.now();
    let loaded = 0;
    let shown = 0;
    let raf = 0;
    let last = start;
    let exiting = false;
    trackAssets((p) => (loaded = p));

    const tick = (now: number) => {
      const t = now - start;
      const cap = Math.min(1, Math.max(0, (t - 500) / (MIN_MS - 500)));
      const target = t > MAX_MS ? 1 : Math.min(loaded, cap);
      // догоняние по времени, а не по кадрам: при просевшей частоте кадров заливка не тормозит
      shown += (target - shown) * (1 - Math.exp(-(now - last) / 180));
      last = now;
      if (target === 1 && 1 - shown < 0.004) shown = 1;
      const y = VIEWBOX.y + VIEWBOX.h * (1 - shown);
      fillRect.current?.setAttribute("y", String(y));
      if (shown === 1 && !exiting) {
        exiting = true;
        exit();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // 3. пролёт сквозь букву
    const exit = () => {
      const { w, h, scale } = place();
      // у копии в маске координат нет (она не отрисовывается) — видимая копия стоит там же
      const ctm = logo.current?.getCTM();
      const focus = ctm ? new DOMPoint(FOCUS.x, FOCUS.y).matrixTransform(ctm) : new DOMPoint(w / 2, h / 2);
      // буква должна накрыть весь экран: её радиус в пикселях растёт до диагонали окна
      const S = (Math.hypot(w, h) / (FOCUS.r * scale)) * 1.6;
      const g = zoom.current;
      if (!g) return finish();
      g.style.transformOrigin = `${focus.x}px ${focus.y}px`;

      // буквы превращаются в окна: белая заливка гаснет, в маске проступают дыры
      fillGroup.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, delay: 120, easing: EASE, fill: "forwards" });
      logo.current?.querySelector("[data-stroke]")?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" });
      holeGroup.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, delay: 120, easing: EASE, fill: "forwards" });

      document.querySelector("main")?.animate([{ scale: 1.14 }, { scale: 1 }], { duration: 1700, delay: 260, easing: EASE, fill: "backwards" });
      // точка внутри буквы съезжает в центр экрана, пока растёт: пролёт идёт ровно в центр
      const dx = w / 2 - focus.x;
      const dy = h / 2 - focus.y;
      const fly = g.animate([{ transform: "translate(0, 0) scale(1)" }, { transform: `translate(${dx}px, ${dy}px) scale(${S})` }], {
        duration: 1300,
        delay: 380,
        easing: "cubic-bezier(0.7, 0, 0.84, 0)",
        fill: "forwards",
      });
      fly.onfinish = finish;
      window.setTimeout(() => document.dispatchEvent(new Event("preloader:reveal")), 420);
    };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", place);
    };
  }, []);

  if (gone) return null;

  const letters = PATHS.map((d) => <path key={d} d={d} />);
  const vb = `${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`;

  return (
    <div aria-hidden className="preloader fixed inset-0 z-[100]">
      <svg className="absolute inset-0 size-full">
        <defs>
          <mask id="preloader-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect width="100%" height="100%" fill="#fff" />
            <g ref={zoom}>
              <svg ref={hole} viewBox={vb} x="6%" y="40%" width="88%" height="20%" overflow="visible">
                <g ref={holeGroup} fill="#000" opacity="0">
                  {letters}
                </g>
              </svg>
            </g>
          </mask>
          <clipPath id="preloader-fill">
            <rect ref={fillRect} x={VIEWBOX.x} y={VIEWBOX.y + VIEWBOX.h} width={VIEWBOX.w} height={VIEWBOX.h} />
          </clipPath>
        </defs>

        <rect width="100%" height="100%" fill="var(--bg-deep)" mask="url(#preloader-mask)" />

        <svg ref={logo} viewBox={vb} x="6%" y="40%" width="88%" height="20%" overflow="visible">
          <g ref={fillGroup} fill="#fff" clipPath="url(#preloader-fill)">
            {letters}
          </g>
          {/* pathLength=1: штрих спрятан уже в разметке, до запуска анимации контур не мелькает */}
          <g data-stroke fill="none" stroke="rgb(255 255 255 / 0.85)" strokeWidth="0.45" strokeLinejoin="round">
            {PATHS.map((d) => (
              <path key={d} d={d} pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
            ))}
          </g>
        </svg>
      </svg>

    </div>
  );
}
