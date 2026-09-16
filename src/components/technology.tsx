import Image from "next/image";
import { VideoBlock } from "./video-block";

const LEAD =
  "Renuvion безпечно нагріває тканини до рівня, недоступного іншим технологіям. За долю секунди колагенові волокна розігріваються до 60–85 °С і максимально стягуються. Поверхня шкіри при цьому не нагрівається вище 41 °С. Ризик опіку повністю відсутній.";

const PATHS = ["Прямий контакт з плазмою гелію", "Джоулеве RF-нагрівання"];

/** Кнопка воспроизведения: белый круг с пульсирующим кольцом */
function PlayButton({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "size-[clamp(40px,3.4vw,48px)]" : "size-[clamp(56px,6.1vw,88px)]";
  const glyph = size === "sm" ? "size-[14px]" : "size-[clamp(18px,1.9vw,28px)]";
  return (
    <span className={`pulse-ring relative flex shrink-0 items-center justify-center rounded-full bg-white ${box}`}>
      <svg viewBox="0 0 24 24" className={`${glyph} translate-x-[1px] text-[var(--bg-deep)]`} fill="currentColor" aria-hidden>
        <path d="M8 5.2v13.6L19 12z" />
      </svg>
    </span>
  );
}

export function Technology() {
  return (
    <section id="technology" className="section relative">
      <div className="container-site flex flex-col gap-[clamp(32px,4.5vw,72px)]">
        <h2 data-rv className="max-w-[16ch] text-[length:var(--fs-h2)] font-medium leading-[1.02] tracking-[-0.026em] text-[var(--text)]">
          Що таке Renuvion:
          <br />
          гелієва плазма&nbsp;+&nbsp;RF
        </h2>

        {/* Главный ролик: постер на всю ширину колонки */}
        <VideoBlock
          src="/video/tech-full.mp4"
          loop="/video/tech-thumb.mp4"
          poster="/video/tech-thumb.jpg"
          data-rv="scene"
          className="relative block aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-card)] border border-white/12"
        >
          <span className="absolute inset-x-[clamp(16px,3vw,48px)] bottom-[clamp(16px,3vw,48px)] flex items-center gap-[clamp(12px,1.7vw,24px)] text-left sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:justify-center">
            <PlayButton />
            <span className="flex flex-col gap-[6px]">
              <span className="text-[length:var(--fs-btn)] leading-[1.3] text-white">Дивитися відео технології</span>
              <span className="text-[length:var(--fs-body)] leading-[1.3] text-white/70">
                Принцип роботи Renuvion&nbsp;/&nbsp;2:22
              </span>
            </span>
          </span>
        </VideoBlock>

        {/* Текст с температурами слева, второй ролик справа */}
        <div className="grid gap-[clamp(32px,4vw,64px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)] lg:items-start">
          <div className="flex flex-col gap-[clamp(28px,3.4vw,52px)]">
            <p data-rv className="max-w-[52ch] text-[length:var(--fs-lead)] leading-[1.45] text-[var(--text-muted)]">{LEAD}</p>

            <div data-rv="stagger" className="grid grid-cols-2 items-end gap-4 [--step:140ms] sm:flex sm:flex-wrap sm:gap-[clamp(24px,4vw,64px)]">
              <div className="flex flex-col gap-2">
                <p data-count className="whitespace-nowrap text-[32px] font-medium leading-[0.94] tracking-[-0.03em] sm:text-[length:var(--fs-num)] text-[var(--accent)]">
                  60–85&nbsp;°С
                </p>
                <p className="text-[length:var(--fs-body)] leading-[1.45] text-[var(--text-faint)]">
                  колаген, за&nbsp;долю секунди
                </p>
              </div>
              <div className="flex flex-col gap-2 border-l border-[var(--hairline)] pl-4 sm:pl-[clamp(16px,2.6vw,40px)]">
                <p data-count className="whitespace-nowrap text-[32px] font-medium leading-[0.94] tracking-[-0.03em] sm:text-[length:var(--fs-num)] text-[var(--text)]">
                  41&nbsp;°С
                </p>
                <p className="text-[length:var(--fs-body)] leading-[1.45] text-[var(--text-faint)]">
                  максимум на&nbsp;поверхні шкіри
                </p>
              </div>
            </div>
          </div>

          <div data-rv="stagger" className="flex flex-col gap-[clamp(16px,1.6vw,22px)] [--step:120ms]">
            <VideoBlock
              src="/video/clinical.mp4"
              poster="/screens/s03-video2-poster.png"
              className="relative block aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-card)] border border-white/12"
            >
              <span className="absolute inset-[clamp(14px,1.8vw,26px)] flex flex-col justify-center gap-[clamp(8px,1vw,14px)] text-left">
                <Image
                  src="/svg/renuvion-logo.svg"
                  alt="Renuvion"
                  width={112}
                  height={20}
                  unoptimized
                  className="h-auto w-[clamp(84px,7vw,112px)]"
                />
                <span className="max-w-[16ch] text-[length:var(--fs-h3)] leading-[1.1] text-white">
                  Миттєве скорочення тканин
                </span>
                <span className="mt-1 flex items-center gap-[clamp(10px,1vw,14px)]">
                  <PlayButton size="sm" />
                  <span className="text-[length:var(--fs-body)] leading-[1.3] text-white/70">
                    Клінічне відео&nbsp;/&nbsp;0:26
                  </span>
                </span>
              </span>
            </VideoBlock>

            <a
              href="#contact"
              className="btn inline-flex w-full items-center justify-between gap-3 rounded-[var(--radius-pill)] border border-white/16 py-[clamp(13px,1.25vw,18px)] pl-[clamp(20px,2.2vw,32px)] pr-[clamp(18px,1.8vw,28px)] text-left transition-colors duration-[500ms] ease-[var(--ease)] hover:border-white/40 hover:bg-white/8 lg:w-fit"
            >
              <span className="text-[length:var(--fs-body)] font-medium text-[var(--text)]">
                Миттєве скорочення тканин — як&nbsp;це працює
              </span>
              <Image src="/svg/icon-arrow.svg" alt="" width={20} height={20} unoptimized aria-hidden className="shrink-0" />
            </a>
          </div>
        </div>

        {/* Два пути передачи энергии */}
        <div className="flex flex-col gap-[clamp(16px,2vw,32px)] pt-[clamp(24px,3vw,44px)] lg:flex-row lg:items-center lg:gap-[clamp(32px,4vw,64px)]">
          <p className="max-w-[34ch] text-[length:var(--fs-body)] leading-[1.5] text-[var(--text-muted)] lg:text-[length:var(--fs-lead)]">
            Унікальна передача енергії здійснюється одночасно двома шляхами, забезпечуючи миттєву коагуляцію
            і&nbsp;ліфтинг.
          </p>
          {/* каждая «дорога» — одной строкой: в макете они не переносятся */}
          <div data-rv="stagger" className="flex flex-col gap-[clamp(12px,1.4vw,20px)] [--step:140ms] lg:flex-row lg:gap-[clamp(24px,3.4vw,56px)]">
            {PATHS.map((path) => (
              <p key={path} className="flex items-center gap-[clamp(10px,1.1vw,16px)]">
                <span className="size-[10px] shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                <span className="text-[length:var(--fs-lead)] leading-[1.15] tracking-[-0.02em] text-[var(--text)] lg:whitespace-nowrap">
                  {path}
                </span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
