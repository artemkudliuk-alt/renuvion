"use client";

import { useState } from "react";
import Image from "next/image";

const card = "rounded-[var(--radius-card)] bg-[var(--bg-elevated)] p-[clamp(20px,2.4vw,40px)]";
const body = "text-[length:var(--fs-body)] leading-[1.55] lg:text-[length:var(--fs-lead)] lg:leading-[1.45]";

function IconMinus() {
  return (
    <svg viewBox="0 0 24 24" className="size-[22px] shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="1.5" />
      <path d="M8 12h8" stroke="#fff" strokeOpacity=".5" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" className="size-[22px] shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#34D399" fillOpacity=".14" stroke="#34D399" strokeWidth="1.5" />
      <path d="m7.5 12.4 3 3 6-6.4" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** значок в круглой подложке — для карточек «Навчання» и «Вибір кращих» */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-[clamp(40px,3.6vw,52px)] items-center justify-center rounded-full border border-[rgb(0_163_224/0.4)] bg-[rgb(0_163_224/0.1)] text-[var(--accent)]">
      {children}
    </span>
  );
}

function Bipolar() {
  return (
    <>
      <p className="flex items-center gap-[10px] text-[clamp(15px,1.2vw,16px)] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
        <IconMinus />
        Біполярні RF-системи
      </p>
      <p className={`${body} text-white/90`}>У&nbsp;біполярних RF-системах радіочастотна енергія проходить між:</p>
      <p className={`${body} text-[var(--text-muted)]`}>
        — внутрішнім електродом на&nbsp;канюлі
        <br />
        та
        <br />— зовнішнім електродом на&nbsp;поверхні шкіри.
      </p>
      <p className={`${body} text-white/90`}>Між ними формується:</p>
      <p className={`${body} text-[var(--text-muted)]`}>
        — термічна коагуляція тканини;
        <br />— скорочення сполучнотканинних структур;
        <br />— передача тепла у&nbsp;напрямку між внутрішнім і&nbsp;зовнішнім електродами.
      </p>
      <p className={`${body} text-white/90`}>
        Цей принцип передбачає поступове нагрівання тканин у&nbsp;зоні проходження RF-енергії.
      </p>
    </>
  );
}

function Renuvion() {
  return (
    <>
      <p className="flex items-center gap-[10px] text-[clamp(15px,1.2vw,16px)] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
        <IconCheck />
        Renuvion
      </p>
      <p className="text-[length:var(--fs-h3)] font-medium leading-[1.15] text-white">
        Гелій + радіочастотна енергія
        <br />
        <span className="text-[var(--accent)]">= гелієва плазма + RF</span>
      </p>
      <p className={`${body} text-[var(--text-muted)]`}>
        RF-енергія іонізує потік гелію, створюючи сфокусований плазмово&#8209;RF потік.
      </p>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px]">
        <Image
          src="/screens/s07b-mechanism.jpg"
          alt="Схема дії плазмово-RF потоку в шарах тканини"
          fill
          sizes="(min-width: 1024px) 44vw, 100vw"
          className="object-cover"
        />
      </div>
    </>
  );
}

const EXTRAS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M12 4 2 9l10 5 10-5-10-5Z" strokeLinejoin="round" />
        <path d="M6 11.5V17c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Навчання",
    text: "Вартість апарату включає навчання авторизованим клінічним тренером.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <circle cx="12" cy="9" r="5.5" />
        <path d="m8.5 14-1.5 6 5-2.5 5 2.5-1.5-6" strokeLinejoin="round" />
      </svg>
    ),
    title: "Вибір кращих",
    text: "Власники Renuvion вступають в елітний клуб, долучаються до середовища преміальних хірургів всесвітнього рівня. Apyx Medical запроваджує освітні заходи, доступ до вебінарів, клінічних і навчальних матеріалів.",
  },
];

export function HowItWorks() {
  const [tab, setTab] = useState<"rf" | "renuvion">("renuvion");

  return (
    <section className="section">
      <div className="container-site flex flex-col gap-[clamp(24px,3vw,48px)]">
        <h2 data-rv className="max-w-[18ch] text-[length:var(--fs-h2)] font-medium leading-[1.02] tracking-[-0.026em] text-white">
          Renuvion використовує
          <br />
          інший механізм
        </h2>

        {/* Узкий экран: переключатель вместо двух колонок */}
        <div className="lg:hidden">
          <div className="flex gap-1 rounded-[var(--radius-pill)] bg-white/6 p-1">
            {(
              [
                ["rf", "Біполярний RF"],
                ["renuvion", "Renuvion"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-pressed={tab === id}
                className={`min-h-11 flex-1 rounded-[var(--radius-pill)] text-[length:var(--fs-body)] font-medium transition-colors duration-[420ms] ease-[var(--ease)] ${
                  tab === id ? "bg-[var(--accent)] text-[var(--on-accent)]" : "text-white/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div key={tab} className={`${card} anim-swap mt-4 flex flex-col gap-[14px]`}>
            {tab === "rf" ? <Bipolar /> : <Renuvion />}
          </div>
        </div>

        {/* Компьютер: две карточки рядом */}
        <div className="hidden gap-[clamp(16px,1.7vw,24px)] lg:grid lg:grid-cols-2">
          <div data-rv="left" className={`${card} flex flex-col gap-[14px]`}>
            <Bipolar />
          </div>
          <div data-rv="right" className={`${card} flex flex-col gap-[clamp(14px,1.4vw,20px)] [--d:120ms]`}>
            <Renuvion />
          </div>
        </div>

        {/* Ключевая особенность */}
        <div className={`${card} flex flex-col gap-[clamp(20px,2.4vw,40px)] lg:flex-row lg:gap-[clamp(32px,4.4vw,64px)]`}>
          <div className="flex flex-col gap-[clamp(16px,2vw,32px)] lg:w-[34%] lg:shrink-0">
            <p className="text-[length:var(--fs-h3)] font-medium leading-none text-white">
              Ключова особливість Renuvion
            </p>
            <div className="flex flex-col gap-[6px]">
              <p data-count className="text-[length:var(--fs-num)] font-medium leading-none tracking-[-0.02em] text-[var(--accent)]">
                85&nbsp;°C
              </p>
              <p className="text-[length:var(--fs-body)] text-white/65">тканина нагрівається за&nbsp;долю секунди</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-[clamp(12px,1.4vw,20px)]">
            <p className={`${body} text-[var(--text-muted)]`}>
              Renuvion поєднує RF-енергію та&nbsp;гелій. RF іонізує гелій і&nbsp;створює плазмовий потік, який швидко
              передає енергію тканині.
            </p>
            <p className={`${body} text-[var(--text-muted)]`}>
              Тканина нагрівається до&nbsp;85&nbsp;°C протягом долі секунди, після чого швидко охолоджується. Це підвищує
              ефективність ліфтингу і&nbsp;виключає зовнішній опік шкіри.
            </p>
            <p className="text-[length:var(--fs-lead)] font-medium leading-[1.35] text-[var(--accent)]">
              Для хірурга це означає безпечний контрольований результат
            </p>
          </div>
        </div>

        {/* Обучение и клуб */}
        <div data-rv="stagger" className="grid gap-[clamp(16px,1.7vw,24px)] [--step:120ms] lg:grid-cols-2">
          {EXTRAS.map((e) => (
            <div key={e.title} className={`${card} flex flex-col gap-[clamp(14px,1.6vw,22px)]`}>
              {/* на телефоне значок и заголовок в одну строку — карточка короче */}
              <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-[clamp(14px,1.6vw,22px)]">
                <Badge>{e.icon}</Badge>
                <p className="text-[length:var(--fs-h3)] font-medium leading-[1.2] text-white">{e.title}</p>
              </div>
              <p className={`${body} text-[var(--text-muted)]`}>{e.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
