import { Hero } from "@/components/hero";
import { ProblemSolution } from "@/components/problem-solution";
import { Technology } from "@/components/technology";
import { SevenReasons } from "@/components/seven-reasons";
import { Generator } from "@/components/generator";
import { Applications } from "@/components/applications";
import { Liposuction } from "@/components/liposuction";
import { HowItWorks } from "@/components/how-it-works";
import { Comparison } from "@/components/comparison";
import { Calculator } from "@/components/calculator";
import { Studies } from "@/components/studies";
import { Club } from "@/components/club";
import { BeforeAfter } from "@/components/before-after";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { SiteMotion } from "@/components/site-motion";
import { LeadModal } from "@/components/lead-modal";
import { MobileCta } from "@/components/mobile-cta";
import { ScrollChrome } from "@/components/scroll-chrome";
import { BokehField } from "@/components/bokeh-field";
import { Preloader } from "@/components/preloader";

const SITE = "https://renuvion.com.ua";

/*
 * Микроразметка Schema.org из ТЗ (раздел 4): аппарат, дистрибьютор, два ролика.
 * FAQPage не добавлена — блока частых вопросов на странице нет, а разметка без видимого
 * контента нарушает правила Google. Адрес и email дистрибьютора появятся, когда их даст клиент.
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "Renuvion Ukraine",
      url: SITE,
      logo: `${SITE}/svg/renuvion-logo.svg`,
      telephone: "+380503584109",
      email: "lamb@lanmedica.com.ua",
      address: {
        "@type": "PostalAddress",
        streetAddress: "вул. Менделєєва, буд. 12, оф. 94/1",
        addressLocality: "Київ",
        postalCode: "01103",
        addressCountry: "UA",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+380503584109",
        email: "lamb@lanmedica.com.ua",
        contactType: "sales",
        areaServed: "UA",
        availableLanguage: "uk",
      },
    },
    {
      "@type": "MedicalDevice",
      name: "Renuvion",
      description:
        "Хірургічна система гелієвої плазми та радіочастотної енергії (RF) для контурування тіла і скорочення м’яких тканин.",
      manufacturer: { "@type": "Organization", name: "Apyx Medical Corporation" },
      image: `${SITE}/hero/scene.png`,
    },
    {
      "@type": "VideoObject",
      name: "Принцип роботи Renuvion",
      description: "Анімація механізму дії гелієвої плазми та RF-енергії Renuvion.",
      thumbnailUrl: `${SITE}/video/tech-thumb.jpg`,
      contentUrl: `${SITE}/video/tech-full.mp4`,
      duration: "PT2M22S",
      uploadDate: "2026-09-16",
    },
    {
      "@type": "VideoObject",
      name: "Миттєве скорочення тканин — клінічне відео",
      description: "Застосування Renuvion на тканинах живота.",
      thumbnailUrl: `${SITE}/video/clinical.jpg`,
      contentUrl: `${SITE}/video/clinical.mp4`,
      duration: "PT26S",
      uploadDate: "2026-09-16",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }} />
      <BokehField />
      <main>
        <Hero />
        <ProblemSolution />
        <Technology />
        <SevenReasons />
        <Generator />
        <Applications />
        <Liposuction />
        <HowItWorks />
        <Comparison />
        <Calculator />
        <Studies />
        <Club />
        <BeforeAfter />
        <Contact />
      </main>
      <Footer />
      <MobileCta />
      <ScrollChrome />
      <LeadModal />
      <SiteMotion />
      <Preloader />
    </>
  );
}
