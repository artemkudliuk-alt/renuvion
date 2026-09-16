"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type View = "front" | "back";

type Zone = {
  id: string;
  view: View;
  /** строки рейтинга, которые загораются вместе с зоной */
  rows: string[];
  /** область под курсор — доли кадра фигуры */
  hotspot: { left: string; top: string; width: string; height: string };
  /** светящаяся накладка поверх фигуры */
  overlay: { src: string; left: string; top: string; width: string; height: string };
  /** точка-указатель на фигуре */
  marker: { left: string; top: string };
};

const ZONES: Zone[] = [
  {
    id: "neck",
    view: "front",
    rows: ["Шия / Підборіддя"],
    hotspot: { left: "44%", top: "10.5%", width: "11.5%", height: "6.8%" },
    overlay: { src: "/body/front-neck.png", left: "40.4%", top: "10.8%", width: "19.3%", height: "8.3%" },
    marker: { left: "50%", top: "14%" },
  },
  {
    id: "arms",
    view: "front",
    rows: ["Руки (плече-лікоть)"],
    hotspot: { left: "29.8%", top: "19.6%", width: "40.4%", height: "17.4%" },
    overlay: { src: "/body/front-arms.png", left: "24.3%", top: "17.1%", width: "51.1%", height: "37.2%" },
    marker: { left: "30%", top: "30%" },
  },
  {
    id: "chest",
    view: "front",
    rows: ["Груди (чоловічі / гінекомастія)", "Груди (жіночі)"],
    hotspot: { left: "40.6%", top: "19.1%", width: "18.3%", height: "8%" },
    overlay: { src: "/body/front-chest.png", left: "36.1%", top: "16.9%", width: "29%", height: "15.1%" },
    marker: { left: "50%", top: "23%" },
  },
  {
    id: "belly",
    view: "front",
    rows: ["Живіт"],
    hotspot: { left: "41%", top: "27.8%", width: "17.5%", height: "9.1%" },
    overlay: { src: "/body/front-belly.png", left: "36.5%", top: "27.5%", width: "29%", height: "12.3%" },
    marker: { left: "50%", top: "32%" },
  },
  {
    id: "thighs",
    view: "front",
    rows: ["Стегна"],
    hotspot: { left: "37%", top: "43%", width: "26%", height: "14%" },
    overlay: { src: "/body/front-thighs.png", left: "32.7%", top: "41.0%", width: "34.1%", height: "16.6%" },
    marker: { left: "50%", top: "48%" },
  },
  {
    id: "knees",
    view: "front",
    rows: ["Коліна"],
    hotspot: { left: "41.3%", top: "60.9%", width: "16.7%", height: "5.1%" },
    overlay: { src: "/body/front-knees.png", left: "37.9%", top: "57.3%", width: "23.7%", height: "12.8%" },
    marker: { left: "50%", top: "63%" },
  },
  {
    id: "back",
    view: "back",
    rows: ["Спина"],
    hotspot: { left: "36%", top: "16%", width: "28%", height: "20%" },
    overlay: { src: "/body/back-back.png", left: "35.8%", top: "15.6%", width: "28.3%", height: "20%" },
    marker: { left: "50%", top: "25%" },
  },
  {
    id: "glutes",
    view: "back",
    rows: ["Сідниці"],
    hotspot: { left: "37.5%", top: "34.5%", width: "25%", height: "14%" },
    overlay: { src: "/body/back-glutes.png", left: "33.6%", top: "32.4%", width: "32.6%", height: "18.0%" },
    marker: { left: "50%", top: "40%" },
  },
];

const ROWS: { label: string; value: number }[] = [
  { label: "Шия / Підборіддя", value: 92 },
  { label: "Руки (плече-лікоть)", value: 90 },
  { label: "Живіт", value: 89 },
  { label: "Стегна", value: 78 },
  { label: "Спина", value: 73 },
  { label: "Коліна", value: 55 },
  { label: "Груди (чоловічі / гінекомастія)", value: 43 },
  { label: "Сідниці", value: 35 },
  { label: "Груди (жіночі)", value: 27 },
];

export function Applications() {
  const [view, setView] = useState<View>("front");
  const [activeId, setActiveId] = useState<string | null>("neck");
  const [turning, setTurning] = useState<View | null>(null);
  const [touched, setTouched] = useState(false);

  const active = ZONES.find((z) => z.id === activeId && z.view === view) ?? null;
  const activeRows = active?.rows ?? [];
  const activeLabel = activeRows[0] ?? null;
  const activeValue = ROWS.find((r) => r.label === activeLabel)?.value ?? null;

  const pick = (id: string) => {
    setActiveId(id);
    setTouched(true);
  };

  /*
   * Переключение вида — не подмена картинки, а разворот фигуры. Ролик играет
   * только в этот момент, дальше снова лежит статичный кадр: последний кадр
   * ролика и есть эта картинка, поэтому стыка не видно.
   *
   * Оба ролика крутят фигуру в одну сторону, вместе они складываются в полный
   * оборот — куда бы ни переключался зритель, движение всегда одно и то же.
   */
  const turns = useRef<Partial<Record<View, HTMLVideoElement | null>>>({});

  const finish = (next: View) => {
    setTurning(null);
    setView(next);
    setActiveId(next === "front" ? "neck" : "back");
  };

  const switchView = (next: View) => {
    if (next === view || turning) return;
    setActiveId(null);
    const clip = turns.current[next];
    // ролик не подгрузился — переключаемся сразу, без разворота
    if (!clip) return finish(next);
    setTurning(next);
    clip.currentTime = 0;
    clip.play().catch(() => finish(next));
  };

  return (
    <section id="applications" className="section">
      <div className="container-site flex flex-col gap-[clamp(28px,3.5vw,56px)]">
        <div data-rv="stagger" className="section-head [--step:120ms]">
          <h2 className="max-w-[16ch] text-[length:var(--fs-h2)] font-medium leading-[1.02] tracking-[-0.026em] text-[var(--text)]">
            Області застосування
            <br />
            Renuvion
          </h2>
          <p className="text-[length:var(--fs-body)] leading-[1.5] text-[var(--text-muted)] lg:text-[length:var(--fs-lead)]">
            На яких ділянках Renuvion найбільш популярний для підтягування шкіри?
          </p>
        </div>

        <div className="grid gap-[clamp(28px,4vw,64px)] lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] lg:items-start">
          {/*
            Карта тела. Два слоя: ровная фигура и светящаяся накладка активной зоны.
            При наведении базовый слой притухает, накладка проявляется — зона «загорается».
          */}
          <div data-rv="scene" className="relative mx-auto aspect-[520/760] w-full max-w-[380px] overflow-hidden rounded-[var(--radius-card)] border border-[var(--hairline)] lg:max-w-none">
            {/*
              Оба вида лежат в DOM и переключаются прозрачностью. Если менять src,
              браузер грузит второй файл заново и кадр дёргается при первом переключении.
            */}
            {(["front", "back"] as View[]).map((v) => (
              <Image
                key={v}
                src={v === "front" ? "/body/body-front.jpg" : "/body/body-back.jpg"}
                alt={v === view ? "Фігура людини з областями застосування Renuvion" : ""}
                aria-hidden={v !== view}
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover transition-[opacity,filter] duration-[500ms] ease-[var(--ease)]"
                style={{ opacity: v === view ? 1 : 0, filter: active ? "brightness(0.82)" : "none" }}
              />
            ))}

            {/* ролики разворота: тот, чей вид выбирают, всплывает поверх кадра */}
            {(["back", "front"] as View[]).map((target) => (
              <video
                key={target}
                ref={(el) => {
                  turns.current[target] = el;
                }}
                src={target === "back" ? "/body/turn-to-back.mp4" : "/body/turn-to-front.mp4"}
                muted
                playsInline
                preload="auto"
                aria-hidden
                onEnded={() => finish(target)}
                className="pointer-events-none absolute inset-0 size-full object-cover"
                style={{ opacity: turning === target ? 1 : 0, zIndex: turning === target ? 2 : 0 }}
              />
            ))}

            {active && (
              <span className="pointer-events-none absolute" style={{ ...active.overlay, position: "absolute" }}>
                <Image src={active.overlay.src} alt="" fill unoptimized sizes="(min-width: 1024px) 34vw, 100vw" className="object-contain" />
              </span>
            )}

            {/* области наведения */}
            {!turning && ZONES.filter((z) => z.view === view).map((z) => (
              <button
                key={z.id}
                type="button"
                aria-label={z.rows[0]}
                aria-pressed={z.id === activeId}
                className="absolute cursor-pointer"
                style={z.hotspot}
                onMouseEnter={() => pick(z.id)}
                onFocus={() => pick(z.id)}
                onClick={() => pick(z.id)}
              />
            ))}

            {/* подпись активной зоны: точка, поводок и плашка */}
            {active && activeValue !== null && (
              <span
                className="pointer-events-none absolute hidden items-center gap-2 lg:flex"
                style={{ left: active.marker.left, top: active.marker.top }}
              >
                <span className="relative flex size-2 shrink-0 items-center justify-center">
                  <span className="pulse-ring absolute inset-[-9px] rounded-full border border-white/40" />
                  <span className="size-2 rounded-full bg-white" />
                </span>
                <span className="h-px w-6 shrink-0 bg-white/55" aria-hidden />
                {/* подложка обязательна: подпись ложится на светящуюся зону и без неё теряется */}
                <span className="flex flex-col whitespace-nowrap rounded-[8px] bg-[rgb(5_16_38/0.82)] px-[10px] py-[6px]">
                  <span className="text-[length:var(--fs-body)] font-medium leading-tight text-white">{activeLabel}</span>
                  <span className="text-[15px] font-semibold leading-tight text-[var(--accent)]">Популярність {activeValue}%</span>
                </span>
              </span>
            )}

            {/* на узкой карте плашка уходит в угол, иначе закрывает саму зону */}
            {active && activeValue !== null && (
              <span className="pointer-events-none absolute left-3 top-3 flex flex-col whitespace-nowrap rounded-[8px] bg-[rgb(5_16_38/0.82)] px-[10px] py-[6px] lg:hidden">
                <span className="text-[length:var(--fs-body)] font-medium leading-tight text-white">{activeLabel}</span>
                <span className="text-[15px] font-semibold leading-tight text-[var(--accent)]">{activeValue}%</span>
              </span>
            )}

            {/* подсказка гаснет после первого касания зоны */}
            <span
              className={`pointer-events-none absolute left-4 top-4 hidden items-center gap-2 rounded-[var(--radius-pill)] border border-white/14 bg-[rgb(5_18_41/0.72)] py-2 pl-[14px] pr-4 transition-opacity duration-[620ms] ease-[var(--ease)] lg:flex ${
                touched ? "opacity-0" : "opacity-100"
              }`}
            >
              <span className="size-2 rounded-full bg-[var(--accent)]" aria-hidden />
              <span className="text-[length:var(--fs-body)] text-white/85">Наведіть на частину тіла</span>
            </span>

            <span className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-[6px] rounded-[var(--radius-pill)] border border-white/16 bg-[rgb(5_16_38/0.85)] p-1">
              {(["front", "back"] as View[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => switchView(v)}
                  aria-pressed={view === v}
                  disabled={turning !== null}
                  className={`rounded-[var(--radius-pill)] px-[18px] py-2 text-[length:var(--fs-body)] transition-colors duration-[420ms] ease-[var(--ease)] ${
                    view === v ? "bg-[var(--accent)] text-[var(--on-accent)]" : "text-white/70 hover:text-white"
                  }`}
                >
                  {v === "front" ? "Спереду" : "Ззаду"}
                </button>
              ))}
            </span>
          </div>

          {/* Рейтинг зон */}
          <div data-rv="stagger" className="flex flex-col [--step:55ms]">
            <p className="mb-3 text-[length:var(--fs-body)] text-white/70 lg:hidden">Натисніть на частину тіла</p>
            {ROWS.map((row) => {
              const on = activeRows.includes(row.label);
              return (
                <div key={row.label} className="flex flex-col gap-[10px] py-[clamp(10px,1.2vw,16px)]">
                  <div className="flex items-start justify-between gap-4 text-[length:var(--fs-body)] leading-[1.5] lg:text-[length:var(--fs-lead)]">
                    <p className={on ? "text-[var(--text)]" : "text-[var(--text-muted)]"}>{row.label}</p>
                    <p className={`tabular-nums ${on ? "text-[var(--accent)]" : "text-[var(--text-muted)] opacity-60"}`}>
                      {on ? `${row.value}%` : "0%"}
                    </p>
                  </div>
                  <div className={`relative w-full rounded-[2px] bg-[var(--hairline)] ${on ? "h-1" : "h-[3px]"}`}>
                    <span
                      className="absolute left-0 top-0 h-full rounded-[2px] bg-[var(--accent)] transition-[width] duration-[620ms] ease-[var(--ease)]"
                      style={{ width: on ? `${row.value}%` : "0%" }}
                    />
                  </div>
                </div>
              );
            })}
            <p className="mt-4 text-[length:var(--fs-body)] leading-[1.55] text-[var(--text-faint)]">
              Додаткові зони: область обличчя, брилі, пахвові ділянки, лобок.
            </p>
          </div>
        </div>
      </div>

      {/* Баннер во всю ширину */}
      <div className="mt-[clamp(28px,4vw,64px)] bg-[var(--bg-elevated)] py-[clamp(24px,3vw,44px)]">
        <div className="container-site">
          <p data-rv className="max-w-[72ch] text-[length:var(--fs-body)] leading-[1.45] tracking-[-0.02em] text-[var(--text)] lg:text-[length:var(--fs-h3)] lg:leading-[1.15]">
            Навіть коли Renuvion не використовується безпосередньо для скорочення шкіри, система функціонує як
            універсальний електрохірургічний апарат із повноцінними монополярними та біполярними режимами, повністю
            задовольняючи щоденні потреби хірургічної практики.
          </p>
        </div>
      </div>
    </section>
  );
}
