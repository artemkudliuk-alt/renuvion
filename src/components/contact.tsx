import { LeadForm } from "./lead-form";

const GET = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" strokeLinejoin="round" />
        <path d="M14 3v5h5" strokeLinejoin="round" />
      </svg>
    ),
    title: "PDF-презентація",
    sub: "у Viber або Telegram",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M8 7h8M8 11h3M8 15h3M14 11h2M14 15h2" strokeLinecap="round" />
      </svg>
    ),
    title: "Персональний розрахунок окупності",
    sub: "для вашої клініки",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round" />
      </svg>
    ),
    title: "Демонстрація або Live Surgery",
    sub: "запрошення від офіційного дистриб’ютора",
  },
];

const MESSENGERS = ["Telegram", "WhatsApp", "Viber"];

export function Contact() {
  return (
    <section id="contact" className="section relative overflow-hidden">
      <div className="container-site grid gap-[clamp(28px,4vw,64px)] lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)] lg:items-start">
        <div data-rv="stagger" className="flex flex-col gap-[clamp(20px,2.6vw,40px)] [--step:110ms]">
          <h2 className="max-w-[20ch] text-[length:var(--fs-h2)] font-medium leading-[1.02] tracking-[-0.026em] text-white">
            Запросіть демонстрацію Renuvion або отримайте комерційну пропозицію
          </h2>

          <ul className="flex flex-col gap-[clamp(14px,1.6vw,22px)]">
            {GET.map((g) => (
              <li key={g.title} className="flex items-start gap-[clamp(12px,1.3vw,18px)]">
                <span className="flex size-[clamp(36px,3vw,44px)] shrink-0 items-center justify-center rounded-full border border-[rgb(0_163_224/0.4)] bg-[rgb(0_163_224/0.1)] text-[var(--accent)]">
                  {g.icon}
                </span>
                <span className="flex flex-col gap-1 leading-[1.4]">
                  <span className="text-[length:var(--fs-body)] font-medium text-white lg:text-[length:var(--fs-lead)]">
                    {g.title}
                  </span>
                  <span className="text-[length:var(--fs-body)] text-white/62">{g.sub}</span>
                </span>
              </li>
            ))}
          </ul>

          <a
            href="tel:+380503584109"
            className="text-[length:var(--fs-h3)] leading-[1.05] tracking-[-0.02em] text-white transition-colors duration-[320ms] hover:text-[var(--accent)]"
          >
            +380&nbsp;50&nbsp;358&nbsp;41&nbsp;09
          </a>

          <div className="flex flex-wrap gap-[10px]">
            {MESSENGERS.map((m) => (
              <a
                key={m}
                href="#"
                className="flex min-h-11 items-center rounded-[var(--radius-pill)] border border-white/24 px-[clamp(14px,1.4vw,20px)] text-[length:var(--fs-body)] text-white/90 transition-colors duration-[500ms] ease-[var(--ease)] hover:bg-white/10"
              >
                {m}
              </a>
            ))}
          </div>

          {/* Фото аппарата — только на большом экране, уходит за левый край */}
          <div className="relative -ml-[calc(var(--pad)-25px)] mt-auto hidden overflow-hidden aspect-[620/316] w-[calc(100%+var(--pad))] lg:block">
            {/* петля 5 с по кадру s13-device, картинка — постер до загрузки */}
            <video
              src="/video/s13-loop.mp4"
              poster="/screens/s13-device.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-hidden
              className="absolute inset-0 size-full object-cover"
            />
            {/* края растворяются в фон со всех сторон, слева — мягче, чтобы кадр не упирался в край окна */}
            <span aria-hidden className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-[var(--bg-deep)] to-transparent" />
            <span aria-hidden className="absolute inset-x-0 -bottom-[2px] h-[40%] bg-gradient-to-t from-[var(--bg-deep)] via-[rgb(5_16_38/0.6)] to-transparent" />
            <span aria-hidden className="absolute inset-y-0 left-0 w-[12%] bg-gradient-to-r from-[var(--bg-deep)] to-transparent" />
            <span aria-hidden className="absolute inset-y-0 right-0 w-[40%] bg-gradient-to-l from-[var(--bg-deep)] to-transparent" />
          </div>
        </div>

        <div
          data-rv="right"
          className="rounded-[var(--radius-card)] bg-[var(--bg-elevated)] p-[clamp(20px,2.6vw,44px)] [--d:140ms]"
        >
          <LeadForm kind="contact" id="contact" />
        </div>
      </div>
    </section>
  );
}
