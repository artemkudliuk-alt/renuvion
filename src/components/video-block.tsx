"use client";

import { useRef, useState } from "react";

/*
 * Кадр с роликом. До нажатия — беззвучная петля-миниатюра (или неподвижный
 * постер, если петли нет) и надпись поверх. По нажатию на том же месте
 * появляется полное видео со звуком и управлением.
 *
 * Внешняя рамка не пересоздаётся при переключении: на ней висит data-rv, и
 * класс is-in, которым модуль движения открывает блок, должен на ней остаться.
 * Если менять сам элемент, новый узел приходит без is-in и остаётся невидимым.
 *
 * Полный ролик грузится только после нажатия — до этого его src нет в разметке,
 * поэтому страница не тянет десятки мегабайт заранее.
 */
export function VideoBlock({
  src,
  loop,
  poster,
  className,
  children,
  ...rest
}: {
  src: string;
  loop?: string;
  poster: string;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const [playing, setPlaying] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // ролик, уехавший с экрана, замолкает: звук из-за кадра сбивает с толку
  const watch = (v: HTMLVideoElement | null) => {
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
  };

  return (
    <div ref={box} className={className} {...rest}>
      {playing ? (
        <video
          ref={watch}
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          onEnded={() => setPlaying(false)}
          className="absolute inset-0 size-full bg-black object-contain"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 block size-full">
          {loop ? (
            <video
              src={loop}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-hidden
              className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-[var(--ease)] group-hover:scale-[1.03]"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={poster}
              alt=""
              aria-hidden
              className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-[var(--ease)] group-hover:scale-[1.03]"
            />
          )}
          {/*
            Затемнение. Под живой петлёй оно плотнее: кадр яркий и подвижный,
            подпись поверх иначе не читается. Под готовым постером хватает лёгкого.
          */}
          <span
            aria-hidden
            className={`absolute inset-0 transition-colors duration-[620ms] ease-[var(--ease)] ${
              loop
                ? "bg-[rgb(5_16_38/0.38)] group-hover:bg-[rgb(5_16_38/0.52)]"
                : "bg-[rgb(5_16_38/0.16)] group-hover:bg-[rgb(5_16_38/0.3)]"
            }`}
          />
          {children}
        </button>
      )}
    </div>
  );
}
