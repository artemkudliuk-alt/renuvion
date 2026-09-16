import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "./mobile-menu";

export const ANCHORS = [
  { label: "Технологія", href: "#technology" },
  { label: "Застосування", href: "#applications" },
  { label: "Для бізнесу", href: "#business" },
  { label: "Дослідження", href: "#studies" },
  { label: "До і Після", href: "#before-after" },
];

const PHONE = "+380 50 358 41 09";
const PHONE_HREF = "tel:+380503584109";

/** Верхняя служебная полоса — только на компьютере */
function UtilityBar() {
  return (
    <div className="hidden border-b border-[var(--hairline)] lg:block">
      <div className="container-site relative flex h-10 items-center justify-between">
        <a
          href="https://apyxmedical.com/patient-home/"
          target="_blank"
          rel="noopener"
          className="u-link upto-device text-[length:var(--fs-nav)] text-[var(--text-faint)] hover:text-[var(--text)]"
        >
          Для пацієнта
        </a>

        <div className="at-device-center flex items-center gap-[18px]">
          <a
            href={PHONE_HREF}
            className="flex items-center gap-2 text-[length:var(--fs-small)] text-white/85 transition-colors duration-[320ms] ease-[var(--ease)] hover:text-white"
          >
            <Image src="/svg/icon-phone.svg" alt="" width={16} height={16} unoptimized aria-hidden />
            <span className="whitespace-nowrap">{PHONE.replace(/ /g, " ")}</span>
          </a>
          <span className="h-[14px] w-px bg-white/20" aria-hidden />
          <a href="#contact" aria-label="Viber" className="opacity-80 transition-opacity duration-[320ms] hover:opacity-100">
            <Image src="/svg/icon-viber.svg" alt="" width={18} height={18} unoptimized aria-hidden />
          </a>
          <a href="#contact" aria-label="Telegram" className="opacity-80 transition-opacity duration-[320ms] hover:opacity-100">
            <Image src="/svg/icon-telegram.svg" alt="" width={18} height={18} unoptimized aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * floating — закреплённая копия для прокрутки (scroll-chrome.tsx): без служебной полосы,
 * кнопка не центрируется по аппарату (его под шапкой уже нет), а стоит справа.
 */
export function SiteHeader({ floating = false }: { floating?: boolean }) {
  return (
    <header className={floating ? "" : "relative z-20"}>
      {!floating && <UtilityBar />}

      <div className={`container-site relative flex items-center justify-between gap-6 ${floating ? "py-3" : "py-[18px] lg:py-4"}`}>
        <div className={`${floating ? "" : "upto-device "}flex min-w-0 items-center gap-[clamp(16px,2.5vw,44px)]`}>
          <Link href="/" className="shrink-0" aria-label="Renuvion, by Apyx Medical">
            <Image
              src="/svg/renuvion-logo.svg"
              alt="Renuvion"
              width={140}
              height={25}
              unoptimized
              priority={!floating}
              className="h-auto w-[clamp(116px,9.7vw,140px)]"
            />
            <span className={`mt-1 hidden text-[length:var(--fs-body)] text-[var(--text-faint)] ${floating ? "" : "lg:block"}`}>
              by Apyx Medical
            </span>
          </Link>

          <nav aria-label="Основна навігація" className="hidden min-w-0 gap-[clamp(10px,1.2vw,24px)] lg:flex">
            {ANCHORS.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="u-link whitespace-nowrap text-[length:var(--fs-nav)] text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                {a.label}
              </a>
            ))}
          </nav>
        </div>

        {floating ? (
          // закреплённая шапка: телефон и кнопка справа, кнопка на 15% компактнее
          <div className="ml-auto hidden shrink-0 items-center gap-[clamp(16px,2vw,32px)] lg:flex">
            <a
              href={PHONE_HREF}
              // уже 1280 номер налезает на меню — там остаётся только кнопка
              className="hidden items-center gap-2 whitespace-nowrap text-[length:var(--fs-nav)] text-white/85 xl:flex transition-colors duration-[320ms] ease-[var(--ease)] hover:text-white"
            >
              <Image src="/svg/icon-phone.svg" alt="" width={16} height={16} unoptimized aria-hidden />
              {PHONE.replace(/ /g, " ")}
            </a>
            <a
              href="#contact"
              className="btn inline-flex items-center gap-[10px] whitespace-nowrap rounded-[var(--radius-pill)] bg-white px-[clamp(19px,1.87vw,27px)] py-[clamp(10px,1.06vw,15px)] text-[calc(var(--fs-nav)*0.85)] font-medium text-[var(--on-accent)] shadow-[0_8px_28px_rgb(0_163_224/0.4)] hover:shadow-[0_12px_40px_rgb(0_163_224/0.65)]"
            >
              Замовити тест-драйв
              <Image src="/svg/icon-arrow.svg" alt="" width={17} height={17} unoptimized aria-hidden />
            </a>
          </div>
        ) : (
          <a
            href="#contact"
            className="btn at-device-center hidden shrink-0 items-center gap-3 whitespace-nowrap rounded-[var(--radius-pill)] bg-white px-[clamp(22px,2.2vw,32px)] py-[clamp(12px,1.25vw,18px)] text-[length:var(--fs-nav)] font-medium text-[var(--on-accent)] shadow-[0_8px_32px_rgb(0_163_224/0.45)] hover:shadow-[0_14px_48px_rgb(0_163_224/0.7)] lg:inline-flex"
          >
            Замовити тест-драйв
            <Image src="/svg/icon-arrow.svg" alt="" width={20} height={20} unoptimized aria-hidden />
          </a>
        )}

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={PHONE_HREF}
            aria-label="Зателефонувати"
            className="flex size-10 items-center justify-center rounded-[20px] border border-white/25"
          >
            <Image src="/svg/icon-phone.svg" alt="" width={20} height={20} unoptimized aria-hidden />
          </a>
          <MobileMenu anchors={ANCHORS} />
        </div>
      </div>
    </header>
  );
}
