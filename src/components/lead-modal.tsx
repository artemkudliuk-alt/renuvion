"use client";

import { useEffect, useRef, useState } from "react";
import { GOALS, LeadForm } from "./lead-form";

/*
 * Всплывающие окна из ТЗ (раздел 3):
 *   price     — «Запит ціни / КП»
 *   materials — «Завантаження матеріалів»: презентація и клинические материалы в Viber / Telegram / Email
 * Любая ссылка с data-lead="price|materials" открывает окно; её href="#contact" остаётся запасным путём без JS.
 */

type Kind = "price" | "materials";

const COPY: Record<Kind, { title: string; sub: string; submit: string; goal: string }> = {
  price: {
    title: "Отримати ціну та комерційну пропозицію",
    sub: "Надішлемо актуальну ціну Renuvion і розрахунок для вашої клініки.",
    submit: "Отримати пропозицію",
    goal: GOALS[0],
  },
  materials: {
    title: "Отримати презентацію та клінічні матеріали",
    sub: "PDF-презентацію і дослідження надішлемо туди, де вам зручно.",
    submit: "Отримати матеріали",
    goal: GOALS[2],
  },
};

export function LeadModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<Kind>("price");
  // новый ключ при каждом открытии — форма начинается с чистого листа
  const [session, setSession] = useState(0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as Element).closest<HTMLElement>("[data-lead]");
      if (!trigger) return;
      e.preventDefault();
      setKind(trigger.dataset.lead === "materials" ? "materials" : "price");
      setSession((n) => n + 1);
      ref.current?.showModal();
      document.dispatchEvent(new Event("scroll:lock"));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = () => ref.current?.close();
  const copy = COPY[kind];

  return (
    <dialog
      ref={ref}
      aria-labelledby="lead-modal-title"
      onClose={() => document.dispatchEvent(new Event("scroll:unlock"))}
      // клик по затемнению (сам dialog, а не его содержимое) закрывает окно
      onClick={(e) => e.target === e.currentTarget && close()}
      data-lenis-prevent
      className="lead-modal m-auto max-h-[calc(100svh-24px)] w-[min(560px,calc(100vw-24px))] overflow-y-auto overscroll-contain rounded-[var(--radius-card)] bg-[var(--bg-elevated)] p-0 text-[var(--text)]"
    >
      <div className="relative flex flex-col gap-[clamp(18px,2vw,28px)] p-[clamp(20px,3vw,40px)]">
        <button
          type="button"
          onClick={close}
          aria-label="Закрити"
          className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-full text-white/70 transition-colors duration-[320ms] hover:bg-white/8 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex flex-col gap-2 pr-10">
          <h2 id="lead-modal-title" className="text-[length:var(--fs-h3)] font-medium leading-[1.1] tracking-[-0.02em] text-white">
            {copy.title}
          </h2>
          <p className="text-[length:var(--fs-body)] leading-[1.5] text-[var(--text-muted)]">{copy.sub}</p>
        </div>

        <LeadForm key={`${kind}-${session}`} kind={kind} goal={copy.goal} submitLabel={copy.submit} id={`modal-${kind}`} />
      </div>
    </dialog>
  );
}
