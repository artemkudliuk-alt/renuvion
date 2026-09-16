import Image from "next/image";
import { ANCHORS } from "./site-header";
import { FooterOutline } from "./footer-outline";

const DOCS = [
  { label: "Політика конфіденційності", href: "#" },
  { label: "Угода користувача", href: "#" },
  { label: "Для пацієнтів", href: "#" },
];

const MESSENGERS = ["Telegram", "WhatsApp", "Viber"];

const colLabel = "text-[clamp(14px,1vw,15px)] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]";
const colLink =
  "u-link w-fit text-[length:var(--fs-body)] leading-[1.4] text-white/80 hover:text-white lg:text-[length:var(--fs-nav)]";

export function Footer() {
  return (
    <footer className="relative pb-[clamp(24px,3vw,40px)] pt-[clamp(32px,4vw,64px)]">
      <div className="container-site">
        <div data-draw className="h-px bg-white/10" aria-hidden />

        <div data-rv="stagger" className="grid grid-cols-2 gap-x-4 gap-y-[clamp(28px,3.4vw,56px)] pt-[clamp(28px,3.4vw,56px)] [--step:100ms] sm:gap-x-[clamp(28px,3.4vw,56px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="col-span-2 flex flex-col items-start gap-4 sm:col-span-1">
            <Image
              src="/svg/renuvion-logo.svg"
              alt="Renuvion"
              width={180}
              height={32}
              unoptimized
              className="h-auto w-[clamp(140px,12.5vw,180px)]"
            />
            <p className="text-[length:var(--fs-body)] leading-[1.4] text-white/55">by Apyx Medical</p>
            <p className="text-[length:var(--fs-body)] leading-[1.4] text-white/72 lg:text-[length:var(--fs-nav)]">
              Технологія гелієвої плазми + RF
              <br />
              для контурування тіла
            </p>
            <a
              href="#contact"
              className="btn mt-1 inline-flex min-h-11 items-center gap-3 rounded-[var(--radius-pill)] bg-[var(--accent)] px-[clamp(20px,2.2vw,32px)] py-[clamp(13px,1.25vw,18px)] text-[length:var(--fs-body)] font-medium text-[var(--on-accent)] transition-colors duration-[500ms] ease-[var(--ease)] hover:bg-white"
            >
              Замовити тест-драйв
              <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <nav aria-label="Навігація у підвалі" className="flex flex-col gap-[14px]">
            <p className={colLabel}>Навігація</p>
            {ANCHORS.map((a) => (
              <a key={a.href} href={a.href} className={colLink}>
                {a.label}
              </a>
            ))}
          </nav>

          <div className="order-last col-span-2 flex flex-col gap-[14px] sm:order-none sm:col-span-1">
            <p className={colLabel}>Контакти</p>
            <a
              href="tel:+380503584109"
              className="flex items-center gap-3 text-[length:var(--fs-body)] leading-[1.4] text-white transition-colors duration-[320ms] hover:text-[var(--accent)] lg:text-[length:var(--fs-nav)]"
            >
              <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
              </svg>
              +380&nbsp;50&nbsp;358&nbsp;41&nbsp;09
            </a>
            <a
              href="mailto:lamb@lanmedica.com.ua"
              className="flex items-center gap-3 text-[length:var(--fs-body)] leading-[1.4] text-white/90 transition-colors duration-[320ms] hover:text-[var(--accent)] lg:text-[length:var(--fs-nav)]"
            >
              <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" strokeLinejoin="round" />
              </svg>
              lamb@lanmedica.com.ua
            </a>
            <address className="not-italic flex items-start gap-3 text-[length:var(--fs-body)] leading-[1.4] text-white/75 lg:text-[length:var(--fs-nav)]">
              <svg viewBox="0 0 24 24" className="mt-[3px] size-5 shrink-0 text-[var(--accent)]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span>
                вул. Менделєєва, буд.&nbsp;12, оф.&nbsp;94/1
                <br />
                м.&nbsp;Київ, 01103
              </span>
            </address>
            <div className="flex flex-nowrap gap-[clamp(4px,0.5vw,8px)]">
              {MESSENGERS.map((m) => (
                <a
                  key={m}
                  href="#"
                  className="flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-[var(--radius-pill)] border border-white/24 px-[clamp(10px,1vw,16px)] text-[length:var(--fs-body)] text-white/90 transition-colors duration-[500ms] ease-[var(--ease)] hover:bg-white/10"
                >
                  {m}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[14px]">
            <p className={colLabel}>Документи</p>
            {DOCS.map((d) => (
              <a key={d.label} href={d.href} className={colLink}>
                {d.label}
              </a>
            ))}
            {/* подчёркивание только под текстом: у всей ссылки оно ложилось и под иконку */}
            <a
              href="#"
              aria-label="Сертифікат відповідності (PDF)"
              className="group flex w-fit items-center gap-[10px] text-[length:var(--fs-body)] leading-[1.4] text-white/80 sm:whitespace-nowrap transition-colors duration-[320ms] hover:text-white lg:text-[length:var(--fs-nav)]"
            >
              {/* значок PDF: лист с загнутым углом и плашкой формата */}
              <svg viewBox="0 0 24 28" className="h-7 w-6 shrink-0 transition-transform duration-[520ms] ease-[var(--ease)] group-hover:-translate-y-0.5" aria-hidden>
                <path d="M4 1.5h11l6 6v17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-21a2 2 0 0 1 2-2Z" fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M15 1.5v6h6" fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinejoin="round" />
                <rect x="0.5" y="13" width="17" height="8.5" rx="1.5" fill="var(--accent)" />
                <text x="9" y="19.6" textAnchor="middle" fontSize="6.4" fontWeight="700" fill="var(--bg-deep)" fontFamily="inherit" letterSpacing=".2">
                  PDF
                </text>
              </svg>
              <span className="u-link">Сертифікат відповідності</span>
            </a>
          </div>
        </div>

        {/* Контурный логотип — финальная точка страницы */}
        {/* контур из того же вектора, что и знак: у прежнего файла стояло
            preserveAspectRatio="none" и линии выходили разной толщины */}
        <FooterOutline />

        <div className="mt-[clamp(20px,2.4vw,36px)] flex flex-col gap-2 text-[length:var(--fs-body)] leading-[1.4] text-white/50 lg:flex-row lg:justify-between">
          <p>© 2026 Renuvion Ukraine. Всі права захищені.</p>
          <p>Renuvion® — зареєстрована торгова марка Apyx Medical Corporation</p>
        </div>
      </div>
    </footer>
  );
}
