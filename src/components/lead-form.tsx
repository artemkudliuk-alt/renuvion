"use client";

import { useState } from "react";

/*
 * Общая форма заявки: блок «Контакти» и два всплывающих окна из ТЗ (раздел 3).
 * Все отправки идут через sendLead — туда потом подключается Telegram-бот или CRM
 * (ТЗ, раздел 5.7: цель, город, имя, телефон и UTM-метки).
 */

export type LeadKind = "contact" | "price" | "materials";

type Field = "name" | "clinic" | "city" | "phone" | "email";

const FIELD: Record<Field, { label: string; placeholder: string; error: string; type: string }> = {
  name: { label: "Ім'я та прізвище *", placeholder: "Олена Коваль", error: "Вкажіть ім'я", type: "text" },
  clinic: { label: "Назва клініки / спеціалізація *", placeholder: "", error: "Вкажіть клініку або спеціалізацію", type: "text" },
  city: { label: "Місто *", placeholder: "", error: "Вкажіть місто, щоб ми підібрали найближчу демонстрацію", type: "text" },
  phone: { label: "Номер телефону *", placeholder: "+380 (__) ___-__-__", error: "Вкажіть номер телефону повністю", type: "tel" },
  email: { label: "Email *", placeholder: "name@clinic.ua", error: "Вкажіть коректний email", type: "email" },
};

const FIELDS: Record<LeadKind, Field[]> = {
  contact: ["name", "clinic", "city", "phone"],
  price: ["name", "clinic", "city", "phone"],
  materials: ["name", "phone"],
};

export const GOALS = [
  "Цікавить придбання та ціна апарату",
  "Хочу відвідати Live Surgery / Демонстрацію",
  "Потрібні клінічні матеріали та розрахунок окупності",
];

const CHANNELS = ["Viber", "Telegram", "Email"] as const;
type Channel = (typeof CHANNELS)[number];

/** маска +380 (XX) XXX-XX-XX: префикс страны фиксирован, дальше только цифры */
export function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("380")) d = d.slice(3);
  else if (d.startsWith("0")) d = d.slice(1);
  d = d.slice(0, 9);
  if (!d) return "";
  const p = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)];
  let out = `+380 (${p[0]}`;
  if (d.length >= 2) out += ")";
  if (p[1]) out += ` ${p[1]}`;
  if (p[2]) out += `-${p[2]}`;
  if (p[3]) out += `-${p[3]}`;
  return out;
}

const isValid = (f: Field, v: string) =>
  f === "phone"
    ? v.replace(/\D/g, "").length === 12
    : f === "email"
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
      : v.trim().length >= 2;

function utm() {
  const q = new URLSearchParams(window.location.search);
  return Object.fromEntries([...q].filter(([k]) => k.startsWith("utm_")));
}

async function sendLead(payload: Record<string, unknown>) {
  // ponytail: получателя ещё нет (ждём токен Telegram-бота или выбор CRM) — пока заявка только логируется.
  // Подключение: POST на /api/lead с этим payload.
  console.info("lead", payload);
}

const input =
  "h-[clamp(48px,3.9vw,56px)] w-full rounded-[var(--radius-field)] bg-white/4 px-[18px] text-[length:var(--fs-lead)] text-white outline-none transition-colors duration-[320ms] ease-[var(--ease)] placeholder:text-[var(--text-faint)] focus:border-[var(--accent)]";

function Radio({ name, checked, onChange, children }: { name: string; checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="mt-[5px] flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-white/40 transition-colors duration-[320ms] peer-checked:border-[var(--accent)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-[var(--accent)]">
        {checked && <span className="anim-pop size-[10px] rounded-full bg-[var(--accent)]" />}
      </span>
      <span className={`text-[length:var(--fs-body)] leading-[1.5] lg:text-[length:var(--fs-lead)] ${checked ? "text-white" : "text-[var(--text-muted)]"}`}>
        {children}
      </span>
    </label>
  );
}

type Props = {
  kind: LeadKind;
  /** цель заявки для окон без выбора цели (передаётся в CRM) */
  goal?: string;
  submitLabel?: string;
  /** id формы: несколько форм на странице не должны делить имена радиокнопок */
  id: string;
};

export function LeadForm({ kind, goal: fixedGoal, submitLabel = "Надіслати запит", id }: Props) {
  const [values, setValues] = useState<Record<Field, string>>({ name: "", clinic: "", city: "", phone: "", email: "" });
  const [touched, setTouched] = useState(false);
  const [goal, setGoal] = useState(GOALS[0]);
  const [channel, setChannel] = useState<Channel>("Viber");
  const [sent, setSent] = useState(false);

  const fields: Field[] = kind === "materials" && channel === "Email" ? [...FIELDS[kind], "email"] : FIELDS[kind];
  const bad = (f: Field) => touched && !isValid(f, values[f]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!fields.every((f) => isValid(f, values[f]))) return;
    await sendLead({
      form: kind,
      goal: fixedGoal ?? goal,
      ...Object.fromEntries(fields.map((f) => [f, values[f].trim()])),
      ...(kind === "materials" && { channel }),
      utm: utm(),
      page: window.location.href,
    });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="anim-swap flex min-h-[clamp(280px,36vh,420px)] flex-col items-start justify-center gap-4">
        <p className="text-[length:var(--fs-h3)] font-medium text-white">Дякуємо!</p>
        <p className="text-[length:var(--fs-body)] leading-[1.55] text-[var(--text-muted)] lg:text-[length:var(--fs-lead)]">
          {kind === "materials"
            ? `Матеріали надішлемо у ${channel === "Email" ? "вказану пошту" : channel} найближчим часом.`
            : "Запит надіслано. Ми зв’яжемося з вами найближчим часом."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-[clamp(16px,1.8vw,24px)]">
      {fields.map((f) => (
        <label key={f} className="anim-swap flex flex-col gap-2">
          <span className={`text-[length:var(--fs-body)] leading-[1.5] ${bad(f) ? "text-white" : "text-[var(--text-faint)]"}`}>
            {FIELD[f].label}
          </span>
          <input
            type={FIELD[f].type}
            name={f}
            autoComplete={f === "phone" ? "tel" : f === "name" ? "name" : f === "email" ? "email" : f === "city" ? "address-level2" : "organization"}
            inputMode={f === "phone" ? "tel" : undefined}
            value={values[f]}
            placeholder={FIELD[f].placeholder}
            onChange={(e) => {
              let next = e.target.value;
              if (f === "phone") {
                const prev = values.phone;
                next = formatPhone(next);
                // стёрли скобку или дефис — маска вернула бы их обратно, поэтому убираем последнюю цифру
                if (e.target.value.length < prev.length && next === prev) next = formatPhone(prev.replace(/\D/g, "").slice(0, -1));
              }
              setValues((v) => ({ ...v, [f]: next }));
            }}
            aria-invalid={bad(f)}
            className={`${input} ${bad(f) ? "anim-shake border-[1.5px] border-[var(--accent)]" : "border border-white/16"}`}
          />
          {bad(f) && <span className="text-[length:var(--fs-body)] leading-[1.5] text-[var(--accent)]">{FIELD[f].error}</span>}
        </label>
      ))}

      {kind === "contact" && (
        <fieldset className="flex flex-col gap-[14px]">
          <legend className="mb-[14px] text-[length:var(--fs-body)] leading-[1.5] text-[var(--text-faint)]">Мета звернення</legend>
          {GOALS.map((g) => (
            <Radio key={g} name={`${id}-goal`} checked={goal === g} onChange={() => setGoal(g)}>
              {g}
            </Radio>
          ))}
        </fieldset>
      )}

      {kind === "materials" && (
        <fieldset className="flex flex-col gap-[14px]">
          <legend className="mb-[14px] text-[length:var(--fs-body)] leading-[1.5] text-[var(--text-faint)]">Куди надіслати матеріали</legend>
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {CHANNELS.map((c) => (
              <Radio key={c} name={`${id}-channel`} checked={channel === c} onChange={() => setChannel(c)}>
                {c}
              </Radio>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex flex-col gap-[14px]">
        <button
          type="submit"
          className="btn flex min-h-11 w-full items-center justify-center gap-3 rounded-[var(--radius-pill)] bg-[var(--accent)] px-[clamp(32px,3.5vw,56px)] py-[clamp(14px,1.25vw,18px)] text-[length:var(--fs-btn)] font-medium text-[var(--on-accent)] transition-colors duration-[500ms] ease-[var(--ease)] hover:bg-white"
        >
          {submitLabel}
          <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="text-[length:var(--fs-body)] leading-[1.55] text-[var(--text-faint)]">
          Натискаючи кнопку, ви&nbsp;погоджуєтеся з&nbsp;політикою конфіденційності. Ваші дані захищені.
        </p>
      </div>
    </form>
  );
}
