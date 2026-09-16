"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = { anchors: { label: string; href: string }[] };

const PHONE = "+380 50 358 41 09";
const PHONE_HREF = "tel:+380503584109";
const MESSENGERS = ["Telegram", "WhatsApp", "Viber"];

export function MobileMenu({ anchors }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.dispatchEvent(new Event("scroll:lock"));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.dispatchEvent(new Event("scroll:unlock"));
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Закрити меню" : "Відкрити меню"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex size-10 flex-col items-center justify-center gap-[5px] rounded-[20px] border border-white/25"
      >
        <span
          className={`h-px w-4 bg-white transition-transform duration-500 ease-[var(--ease)] ${open ? "translate-y-[3px] rotate-45" : ""}`}
        />
        <span
          className={`h-px w-4 bg-white transition-transform duration-500 ease-[var(--ease)] ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
        />
      </button>

      {/* портал в body: иначе меню перекрывается соседними секциями из-за isolate у экрана */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            data-lenis-prevent
            className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-[var(--bg-deep)]/97 p-[var(--pad)] backdrop-blur-2xl"
          >
            {/* Верхняя строка: логотип слева, кнопка закрытия справа */}
            <div className="flex h-12 shrink-0 items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)} aria-label="Renuvion" className="flex items-center">
                <Image
                  src="/svg/renuvion-logo.svg"
                  alt="Renuvion"
                  width={124}
                  height={22}
                  unoptimized
                  priority
                  className="h-auto w-[120px]"
                />
              </Link>
              <button
                type="button"
                aria-label="Закрити меню"
                onClick={() => setOpen(false)}
                className="flex size-10 items-center justify-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:bg-white/10 active:scale-95"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Основная навигация */}
            <nav aria-label="Мобільне меню" className="my-auto flex flex-col gap-5 py-8">
              {anchors.map((a, i) => (
                <a
                  key={a.href}
                  href={a.href}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: `${i * 40}ms` }}
                  className="text-[24px] font-medium leading-tight text-white transition-colors duration-300 hover:text-[var(--accent)]"
                >
                  {a.label}
                </a>
              ))}
              <a
                href="https://apyxmedical.com/patient-home/"
                target="_blank"
                rel="noopener"
                onClick={() => setOpen(false)}
                className="pt-1 text-[18px] font-medium text-white/60 transition-colors hover:text-white"
              >
                Для пацієнта ↗
              </a>
            </nav>

            {/* Нижняя группа: телефон, мессенджеры и кнопка «Замовити тест-драйв» */}
            <div className="flex shrink-0 flex-col gap-4 border-t border-white/10 pt-5">
              <div className="flex flex-col gap-3">
                <a
                  href={PHONE_HREF}
                  className="flex items-center gap-3 text-[19px] font-medium text-white transition-colors duration-300 hover:text-[var(--accent)]"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5">
                    <Image src="/svg/icon-phone.svg" alt="" width={16} height={16} unoptimized aria-hidden />
                  </span>
                  <span>{PHONE}</span>
                </a>

                <a
                  href="mailto:lamb@lanmedica.com.ua"
                  className="flex items-center gap-3 text-[16px] font-normal text-white/85 transition-colors duration-300 hover:text-[var(--accent)]"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[var(--accent)]">
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>lamb@lanmedica.com.ua</span>
                </a>

                <address className="not-italic flex items-start gap-3 text-[14px] leading-snug text-white/60">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[var(--accent)]">
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" strokeLinejoin="round" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>
                  <span>вул. Менделєєва, буд.&nbsp;12, оф.&nbsp;94/1, м.&nbsp;Київ, 01103</span>
                </address>

                <div className="flex items-center gap-2">
                  {MESSENGERS.map((m) => (
                    <a
                      key={m}
                      href="#contact"
                      onClick={() => setOpen(false)}
                      className="flex min-h-10 items-center rounded-full border border-white/20 px-4 text-[15px] font-medium text-white/85 transition-colors duration-300 hover:bg-white/10 hover:text-white"
                    >
                      {m}
                    </a>
                  ))}
                </div>
              </div>

              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="btn inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-white px-6 py-3 text-[18px] font-semibold text-[var(--on-accent)] shadow-[0_8px_28px_rgb(0_163_224/0.4)] transition-all duration-300 active:scale-[0.98]"
              >
                Замовити тест-драйв
                <Image src="/svg/icon-arrow.svg" alt="" width={18} height={18} unoptimized aria-hidden />
              </a>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
