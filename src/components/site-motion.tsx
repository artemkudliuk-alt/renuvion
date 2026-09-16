"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/*
 * Движение всей страницы одним модулем. Экраны только размечаются атрибутами:
 *
 *   data-rv                  появление снизу с блюром (M1)
 *   data-rv="left|right"     выезд сбоку
 *   data-rv="scene"          кадр подъезжает масштабом — для крупных фото
 *   data-rv="stagger"        лесенка: дети появляются по очереди (M2)
 *   data-rv="stagger-left"   та же лесенка, но дети выезжают слева
 *   data-count               досчёт всех чисел внутри (M3)
 *   data-draw                линия растёт по горизонтали; "y" — сверху вниз (M4)
 *   data-draw-svg            контур SVG прочерчивается штрихом
 *   [--d:200ms]              своя задержка, [--step:80ms] — шаг лесенки
 *
 * Появление одноразовое: при обратной прокрутке ничего не проигрывается снова.
 */

const EASE = (t: number) => 1 - Math.pow(1 - t, 3);
const NUM = /\d+(?:[   ]\d{3})*/g;

/** текстовые узлы с числами: исходный текст держим, числа подставляем по кадрам */
function collectNumbers(el: Element) {
  const out: { node: Text; text: string }[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.nodeValue ?? "";
    if (/\d/.test(text)) out.push({ node: n as Text, text });
  }
  return out;
}

function renderNumbers(targets: { node: Text; text: string }[], k: number) {
  for (const { node, text } of targets) {
    node.nodeValue = text.replace(NUM, (m) => {
      const sep = m.match(/[   ]/)?.[0];
      const value = Math.round(Number(m.replace(/\D/g, "")) * k);
      const s = String(value);
      return sep ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s;
    });
  }
}

export function SiteMotion() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = "on";

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || !root.classList.contains("rv")) {
      root.classList.remove("rv");
      return;
    }

    // M7 — инерция скролла
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 });
    lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    // кнопка «наверх» (scroll-chrome.tsx): отмена события = прокрутку взяли на себя
    const toTop = (e: Event) => {
      e.preventDefault();
      lenis.scrollTo(0, { duration: 1.4 });
    };
    document.addEventListener("scroll:top", toTop);
    // всплывающие окна и меню останавливают инерцию, иначе колесо крутит страницу под ними
    const lock = () => lenis.stop();
    const unlock = () => lenis.start();
    document.addEventListener("scroll:lock", lock);
    document.addEventListener("scroll:unlock", unlock);

    // лесенка: порядковый номер ребёнка задаёт его задержку
    document.querySelectorAll('[data-rv^="stagger"]').forEach((p) =>
      Array.from(p.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(i))),
    );

    // контуры SVG: длина штриха своя у каждого пути
    document.querySelectorAll("[data-draw-svg] path").forEach((p) => {
      const len = (p as SVGPathElement).getTotalLength?.() ?? 0;
      if (!len) return;
      const el = p as SVGPathElement;
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
    });

    // Узлы с числами берём в момент появления, а не заранее: между обнулением
    // и стартом React может пересоздать текстовый узел, и обновлялась бы
    // отсоединённая ссылка — на экране оставался ноль.
    const runCounter = (el: HTMLElement) => {
      // второй запуск взял бы за исходник уже обнулённый текст и досчитал бы до нуля
      if (el.dataset.counted) return;
      el.dataset.counted = "1";
      const targets = collectNumbers(el);
      if (!targets.length) return;
      const delay = parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0;
      const start = performance.now() + delay;
      let done = false;
      const tick = (now: number) => {
        const p = Math.min(1, Math.max(0, (now - start) / 1200));
        renderNumbers(targets, EASE(p));
        if (p < 1) requestAnimationFrame(tick);
        else done = true;
      };
      renderNumbers(targets, 0);
      requestAnimationFrame(tick);
      // страховка: если кадры не пришли (вкладка была свёрнута), возвращаем текст
      window.setTimeout(() => {
        if (!done) renderNumbers(targets, 1);
      }, 1200 + delay + 800);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          el.classList.add("is-in");

          if (el.hasAttribute("data-count")) runCounter(el);

          // после проигрывания снимаем атрибут: дальше у элемента работают
          // собственные переходы — ховеры, смена вкладок и прочее
          if (el.hasAttribute("data-rv") || el.hasAttribute("data-draw")) {
            window.setTimeout(() => {
              el.removeAttribute("data-rv");
              el.removeAttribute("data-draw");
            }, 2600);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    let observing = false;
    const observeAll = () => {
      if (observing) return;
      observing = true;
      document
        .querySelectorAll("[data-rv],[data-draw],[data-draw-svg],[data-count]")
        .forEach((el) => io.observe(el));
    };

    // Прелоадер (preloader.tsx): появления стартуют, когда в буквах открываются окна,
    // прокрутка — после пролёта. Страховка на случай, если прелоадер не отчитался.
    let fallback = 0;
    const afterPreloader = () => {
      observeAll();
      lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
      lenis.start();
    };
    if (root.classList.contains("is-loading")) {
      lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
      lenis.stop();
      document.addEventListener("preloader:reveal", observeAll, { once: true });
      document.addEventListener("preloader:done", afterPreloader, { once: true });
      fallback = window.setTimeout(afterPreloader, 15000);
    } else {
      observeAll();
      lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }

    return () => {
      // подписки снимаются обязательно: иначе после повторного монтирования (StrictMode)
      // старая копия тоже запускала наблюдение и счётчики стартовали дважды
      window.clearTimeout(fallback);
      document.removeEventListener("preloader:reveal", observeAll);
      document.removeEventListener("preloader:done", afterPreloader);
      io.disconnect();
      document.removeEventListener("scroll:top", toTop);
      document.removeEventListener("scroll:lock", lock);
      document.removeEventListener("scroll:unlock", unlock);
      lenis.destroy();
    };
  }, []);

  return null;
}
