"use client";

import { useState } from "react";

type Key = "ops" | "check" | "cost" | "months";

const SLIDERS: { key: Key; label: string; min: number; max: number; step: number; money: boolean }[] = [
  { key: "ops", label: "Кількість операцій на місяць", min: 1, max: 30, step: 1, money: false },
  { key: "check", label: "Середній додатковий чек за додавання Renuvion", min: 500, max: 5000, step: 100, money: true },
  { key: "cost", label: "Витрати на одноразові насадки / газ на процедуру", min: 0, max: 1500, step: 50, money: true },
  { key: "months", label: "Кількість робочих місяців на рік", min: 1, max: 12, step: 1, money: false },
];

const fmt = (n: number, money: boolean) => {
  const s = Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return money ? `$${s}` : s;
};

export function Calculator() {
  const [v, setV] = useState<Record<Key, number>>({ ops: 5, check: 2000, cost: 500, months: 11 });

  const perProc = Math.max(0, v.check - v.cost);
  const perMonth = perProc * v.ops;
  const perYear = perMonth * v.months;

  return (
    <section id="business" className="section">
      <div className="container-site flex flex-col gap-[clamp(28px,3.5vw,56px)]">
        <div data-rv="stagger" className="section-head [--step:120ms]">
          <h2 className="max-w-[22ch] text-[length:var(--fs-h2)] font-medium leading-[1.02] tracking-[-0.026em] text-white">
            Розрахуйте потенційну економіку
            <br className="hidden sm:inline" />{" "}
            Renuvion для вашої клініки
          </h2>
          <p className="text-[length:var(--fs-body)] leading-[1.5] text-[var(--text-muted)] lg:text-[length:var(--fs-lead)]">
            Renuvion природним чином інтегрується в&nbsp;пластичні операції та&nbsp;значно підвищує середній чек.
          </p>
        </div>

        <div className="grid gap-[clamp(20px,3vw,48px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)] lg:items-start">
          {/* Ползунки */}
          <div data-rv="stagger" className="flex flex-col gap-4 rounded-[var(--radius-card)] sm:gap-[clamp(18px,2.6vw,40px)] border border-white/8 [--step:90ms] bg-[var(--bg-elevated)] p-[clamp(18px,2.2vw,32px)] lg:border-0 lg:bg-transparent lg:p-0">
            {SLIDERS.map((s) => {
              const pct = ((v[s.key] - s.min) / (s.max - s.min)) * 100;
              return (
                <label key={s.key} className="flex flex-col gap-[clamp(6px,1vw,16px)]">
                  <span className="flex items-end justify-between gap-6">
                    <span className="text-[length:var(--fs-body)] leading-[1.45] text-[var(--text-muted)] lg:text-[length:var(--fs-lead)]">
                      {s.label}
                    </span>
                    <span className="shrink-0 text-[length:var(--fs-h3)] leading-[1.05] tracking-[-0.02em] tabular-nums text-white">
                      {fmt(v[s.key], s.money)}
                    </span>
                  </span>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={v[s.key]}
                    onChange={(e) => setV((p) => ({ ...p, [s.key]: Number(e.target.value) }))}
                    className="calc-range h-6 w-full"
                    style={{ "--pct": `${pct}%` } as React.CSSProperties}
                  />
                  <span className="hidden justify-between text-[length:var(--fs-body)] leading-[1.5] tabular-nums text-[var(--text-faint)] sm:flex">
                    <span>{fmt(s.min, s.money)}</span>
                    <span>{fmt(s.max, s.money)}</span>
                  </span>
                </label>
              );
            })}
          </div>

          {/* Итог */}
          <div data-rv="right" className="flex flex-col gap-[clamp(14px,1.8vw,28px)] rounded-[var(--radius-card)] bg-[var(--bg-elevated)] p-[clamp(20px,2.6vw,44px)] [--d:140ms]">
            {[
              { label: "Прибуток з 1 процедури", value: perProc },
              { label: "Додатковий прибуток на місяць", value: perMonth },
            ].map((r) => (
              <div key={r.label} className="flex items-end justify-between gap-4">
                <span className="text-[length:var(--fs-body)] leading-[1.5] text-[var(--text-muted)] lg:text-[length:var(--fs-lead)]">
                  {r.label}
                </span>
                <span className="shrink-0 text-[length:var(--fs-h3)] leading-[1.05] tracking-[-0.02em] tabular-nums text-white">
                  {fmt(r.value, true)}
                </span>
              </div>
            ))}

            <div className="h-px bg-[var(--hairline)]" aria-hidden />

            <p className="text-[length:var(--fs-body)] leading-[1.5] text-white lg:text-[length:var(--fs-lead)]">
              Потенційний чистий річний дохід
            </p>
            <p
              className="text-[clamp(40px,7.2vw,104px)] font-medium leading-[0.88] tracking-[-0.032em] tabular-nums text-[var(--accent)]"
              aria-live="polite"
            >
              {fmt(perYear, true)}
            </p>
            <p className="text-[length:var(--fs-body)] leading-[1.55] text-[var(--text-faint)]">
              Розрахунок є орієнтовним та&nbsp;формується на&nbsp;основі середньоринкових показників клінік-партнерів.
            </p>

            <a
              href="#contact"
              data-lead="price"
              className="btn mt-1 inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-[var(--radius-pill)] bg-[var(--accent)] px-[clamp(20px,2.2vw,32px)] py-[clamp(13px,1.25vw,18px)] text-center text-[length:var(--fs-body)] font-medium text-[var(--on-accent)] transition-colors duration-[500ms] ease-[var(--ease)] hover:bg-white lg:w-fit"
            >
              Отримати персональний фінансовий розрахунок
              <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
