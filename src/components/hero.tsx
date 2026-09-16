import Image from "next/image";
import { SiteHeader } from "./site-header";

const FDA = [
  { icon: "/svg/fda-lipo.svg", text: "Використання після ліпосакції" },
  { icon: "/svg/fda-neck.svg", text: "Підтягування шкіри шиї та підборіддя" },
  { icon: "/svg/fda-thighs.svg", text: "Зменшення целюліту на стегнах і сідницях" },
];

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
            className="relative z-10 flex max-w-[820px] flex-col items-center text-center lg:items-start lg:text-left gap-[clamp(14px,1.7vw,24px)] [--d:260ms] [--step:140ms]"
          >
            <p className="text-[length:var(--fs-label)] uppercase leading-[1.45] tracking-[0.14em] text-[var(--accent)] lg:leading-[1.8] text-center lg:text-left">
              Технологія експертного рівня для контурування тіла
            </p>

            <h1 className="text-[length:var(--fs-h1)] font-medium leading-[1.18] tracking-[-0.03em] text-[var(--text)] text-center lg:text-left lg:leading-[0.9] lg:tracking-[-0.032em]">
              <span className="block">Революційний підхід до</span>
              <span className="block">усунення провисання шкіри</span>
              <span className="block">на&nbsp;першопричинному рівні</span>
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
            <p className="max-w-[30ch] text-pretty text-[length:var(--fs-lead)] leading-[1.35] text-[var(--text-muted)] lg:max-w-none">
              Підтягування шкіри, інцизія, коагуляція
              <br className="hidden lg:inline" />
              &#32;та&nbsp;абляція м&rsquo;яких тканин
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
          className="grid grid-cols-1 gap-2 pb-[clamp(14px,2.6vh,32px)] sm:gap-3 [--d:1100ms] [--dur:1100ms] [--step:260ms] sm:grid-cols-3 lg:max-w-[760px]"
        >
          {FDA.map((item) => (
            <li
              key={item.text}
              className="fda-tile group flex items-center gap-3 rounded-[var(--radius-field)] border border-white/12 bg-[rgb(5_16_38/0.62)] px-3 py-2.5 sm:flex-col sm:items-start sm:gap-[clamp(10px,1.1vw,14px)] sm:p-[clamp(14px,1.3vw,18px)] backdrop-blur-[12px] hover:border-[rgb(0_163_224/0.55)] hover:bg-[rgb(5_16_38/0.8)]"
            >
              <Image
                src={item.icon}
                alt=""
                width={56}
                height={56}
                unoptimized
                aria-hidden
                className="size-9 shrink-0 sm:h-[clamp(38px,3.6vw,50px)] sm:w-[clamp(38px,3.6vw,50px)] transition-transform duration-[520ms] ease-[var(--ease)] group-hover:scale-105"
              />
              <p className="text-[length:var(--fs-body)] leading-[1.35] tracking-[-0.02em] text-[var(--text)]">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
