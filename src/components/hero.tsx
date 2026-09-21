import Image from "next/image";
import { SiteHeader } from "./site-header";

const FDA = [
  "Єдиний апарат, схвалений FDA для використання після ліпосакції",
  "Єдиний апарат, схвалений FDA для підтягування провисаючої шкіри на шиї та підборідді",
  "Єдиний апарат, схвалений FDA для скорочення підшкірних м’яких тканин на всіх ділянках тіла",
];

/** зелёная галочка в круге — тот же значок, что в таблице сравнения */
function Check() {
  return (
    <svg viewBox="0 0 24 24" className="size-[clamp(26px,2.2vw,32px)] shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#34D399" fillOpacity=".14" stroke="#34D399" strokeWidth="1.5" />
      <path d="m7.5 12.4 3 3 6-6.4" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Первый экран.
 * Три слоя: размытая подложка во всю ширину окна, сцена с аппаратом справа,
 * поверх — содержимое в колонке. Высота равна окну, но не режет контент:
 * если столбец не помещается, секция вырастает, а не обрезает плитки.
 */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden">
      {/*
        Фон. Ширина кадра = min(ширина окна, высота окна x 16/9), прижат вправо и вниз.
        Так кадр никогда не оказывается выше окна: на 1440 он занимает всю ширину,
        на широком мониторе упирается в высоту и не раздувается, а аппарат в обоих
        случаях виден целиком и не наезжает ни на текст, ни на шапку.
        Слева кадр растворяется в фон страницы — там он и так почти одного тона.
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        <div data-rv="scene" className="hero-scene absolute bottom-[-7%] right-0 w-[min(100%,177.78vh)]">
          {/*
            Фоновая петля: 8,4 с, склеена «туда-обратно», поэтому шов не виден.
            poster — тот же кадр, с которого ролик сгенерирован: до загрузки видео
            экран выглядит ровно так же. Видео декоративное, поэтому без звука
            и с отключённым управлением.
          */}
          <video
            src="/hero/scene-loop.mp4"
            poster="/hero/scene.png"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden
            className="h-auto w-full"
          />
        </div>
      </div>

      {/* Слой 3 — смягчение верха и низа, чтобы текст читался без плашки поверх фото */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-[18%] bg-gradient-to-b from-[var(--bg-deep)] to-transparent lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[40%] bg-gradient-to-b from-transparent via-[rgb(5_16_38/0.45)] to-[rgb(5_16_38/0.88)] lg:block"
      />

      <SiteHeader />

      {/* Содержимое: середина забирает свободную высоту, плитки уходят к нижнему краю */}
      <div className="container-site hero-content relative z-10 flex flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-center gap-[clamp(14px,2.4vh,32px)] py-[clamp(12px,2.4vh,34px)]">
          <div
            data-rv="stagger"
            className="relative z-10 flex max-w-[900px] flex-col items-center text-center lg:items-start lg:text-left gap-[clamp(14px,1.7vw,24px)] [--d:260ms] [--step:140ms]"
          >
            {/*
              Плашка под надзаголовком: заливка без рамки — рамка поверх заливки
              читается как элемент интерфейса, а не как акцент в наборе.
              Скруглени небольшое, форма остаётся близкой к прямоугольной.
            */}
            <p className="inline-flex rounded-[10px] bg-[rgb(1_6_16/0.86)] px-[clamp(12px,1.1vw,18px)] py-[clamp(7px,0.6vw,10px)] text-[length:var(--fs-label)] uppercase leading-[1.45] tracking-[0.14em] text-[var(--accent)] backdrop-blur-[10px] text-center lg:text-left lg:leading-[1.5]">
              Технологія експертного рівня для контурування тіла
            </p>

            <h1 className="text-[length:var(--fs-h1)] font-medium leading-[1.2] tracking-[-0.012em] text-[var(--text)] text-center lg:text-left lg:leading-[1.08] lg:tracking-[-0.012em]">
              <span className="block">Для хірургічного</span>
              <span className="block">підтягування шкіри,</span>
              <span className="block">інцизії та&nbsp;коагуляції</span>
            </h1>
          </div>

          {/*
            Сцена на телефоне — та же видеопетля, что на компьютере.
            Кадр 16:9 по высоте блока; аппарат в нём стоит на 73% ширины, поэтому сдвиг −73%
            ставит его ровно в центр экрана. Блок заходит под заголовок и подзаголовок
            (отрицательные поля). Верх и низ растворяет маска на самом видео, а не градиент поверх:
            у градиента на дробной высоте оставался светлый ряд пикселей — линия под подзаголовком.
          */}
          <div className="pointer-events-none relative -mx-[var(--pad)] -my-[clamp(40px,7vh,72px)] h-[clamp(360px,56vh,520px)] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,#000_30%,#000_64%,transparent_100%)] lg:hidden">
            <div data-rv="scene" className="absolute inset-0">
              <video
                src="/hero/scene-loop.mp4"
                poster="/hero/scene.png"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-hidden
                className="absolute left-1/2 top-0 aspect-video h-full max-w-none -translate-x-[73%] object-cover"
              />
            </div>
          </div>

          <div data-rv="stagger" className="relative z-10 flex flex-col items-start gap-[clamp(14px,2.2vh,26px)] [--d:620ms] [--step:120ms]">
            <p className="max-w-[34ch] text-pretty text-[length:var(--fs-lead)] leading-[1.35] text-[var(--text-muted)] lg:max-w-none">
              Революційний комбінований метод контрольованого
              <br className="hidden lg:inline" />
              &#32;і&nbsp;безпечного скорочення шкірного лоскуту
            </p>

            <a
              href="#contact"
              data-lead="materials"
              className="btn inline-flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-[var(--radius-pill)] bg-white px-[clamp(16px,2.2vw,32px)] py-[clamp(14px,1.25vw,18px)] text-[length:var(--fs-btn)] font-medium text-[var(--on-accent)] shadow-[0_8px_32px_rgb(0_163_224/0.45)] hover:shadow-[0_14px_48px_rgb(0_163_224/0.7)] sm:w-auto"
            >
              <Image src="/svg/icon-file-pdf.svg" alt="" width={22} height={22} unoptimized aria-hidden />
              Отримати презентацію
            </a>
          </div>
        </div>

        {/* Одобрения FDA */}
        <ul
          data-rv="stagger-left"
          className="grid grid-cols-1 gap-2 pb-[clamp(20px,4.3vh,48px)] sm:gap-3 [--d:1100ms] [--dur:1100ms] [--step:260ms] sm:grid-cols-3 lg:max-w-[900px]"
        >
          {FDA.map((text) => (
            <li
              key={text}
              className="fda-tile group flex items-center gap-3 rounded-[var(--radius-field)] border border-white/12 bg-[rgb(255_255_255/0.06)] px-3 py-2.5 backdrop-blur-[16px] sm:gap-[clamp(10px,1.1vw,14px)] sm:p-[clamp(14px,1.3vw,18px)] hover:border-[rgb(52_211_153/0.45)] hover:bg-[rgb(255_255_255/0.1)]"
            >
              <Check />
              <p className="text-[length:var(--fs-body)] leading-[1.35] tracking-[-0.01em] text-[var(--text)]">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
