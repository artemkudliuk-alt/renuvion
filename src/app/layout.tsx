import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
});

// SEO — формулировки из ТЗ, раздел 4. Домен — Renuvion.com.ua из ТЗ.
const TITLE = "Renuvion Україна — Апарат для хірургічної підтяжки шкіри та ліпосакції | Купити Renuvion";
const DESCRIPTION =
  "Офіційний сайт Renuvion (Apyx Medical) в Україні. Інноваційна гелієва плазма + RF для контурингу тіла та підтяжки шкіри після ліпосакції. Ціна, клінічні дослідження, тест-драйв.";

export const metadata: Metadata = {
  metadataBase: new URL("https://renuvion.com.ua"),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Renuvion Україна",
    "Renuvion дистриб’ютор",
    "Renuvion купити",
    "Renuvion ціна",
    "Renuvion для пластичної хірургії",
    "Renuvion для ліпосакції",
    "Renuvion body contouring",
    "гелієва плазма пластична хірургія",
    "helium plasma RF",
    "скорочення шкіри після ліпосакції",
    "хірургічний ліфтинг",
    "J Plasma",
    "Джей Плазма",
    "Ренувіон",
    "Ренувион",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "/",
    siteName: "Renuvion Україна",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/hero/scene.png", alt: "Апарат Renuvion від Apyx Medical" }],
  },
  robots: { index: true, follow: true },
};

/*
 * Класс rv включает скрытое состояние блоков до появления. Ставится до первой
 * отрисовки, чтобы не было вспышки видимого контента. Если модуль движения
 * почему-то не поднялся за 4 секунды, класс снимается и страница видна целиком.
 */
const revealBootstrap = `(function(){
  if('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  if(window.location.hash) {
    try {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch(e) {}
  }
  window.scrollTo(0, 0);
  window.addEventListener('beforeunload', function(){ window.scrollTo(0, 0); });
  window.addEventListener('pagehide', function(){ window.scrollTo(0, 0); });
  window.addEventListener('pageshow', function(){ window.scrollTo(0, 0); });

  var r=document.documentElement;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  r.classList.add('rv');
  r.classList.add('is-loading');
  setTimeout(function(){ if(r.dataset.motion!=='on') r.classList.remove('rv'); },4000);
  // прелоадер (preloader.tsx) сам снимает класс; это страховка, если скрипты не поднялись
  setTimeout(function(){ r.classList.remove('is-loading'); },14000);
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" className={`${onest.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
      </head>
      <body className="min-h-svh bg-[var(--bg-deep)] text-[var(--text)]">{children}</body>
    </html>
  );
}
