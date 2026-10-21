import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Noto_Nastaliq_Urdu, Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";

import { getCafe } from "@/entities/cafe";
import { getDictionary, isLocale, localeDirection, locales } from "@/shared/i18n";
import { MotionDriver } from "@/shared/ui";
import { SiteFooter } from "@/widgets/site-footer";
import { SiteNav } from "@/widgets/site-nav";

import "../globals.css";

// English: IBM Plex Mono. Persian: Vazirmatn for text (Persian has no good monospace
// face) and Nastaliq for titles, names and the side navigation.
// Only the faces of the page's language are put on <html>.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-plex-mono",
  preload: false,
});
const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-nastaliq",
  preload: false,
});
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-vazirmatn",
  preload: false,
});

// Runs before paint. `data-motion` turns on the full scroll choreography: a fine
// pointer, a screen wider than a phone and no reduced-motion wish.
const bootScript = `(() => {
  const d = document.documentElement;
  d.dataset.js = "";
  if (matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine) and (min-width: 641px)").matches) d.dataset.motion = "";
})();`;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const name = getCafe().name[locale];
  return { title: { default: name, template: `%s | ${name}` } };
}

export const viewport: Viewport = { themeColor: "#232323", colorScheme: "dark" };

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const cafe = getCafe();
  const fonts = locale === "fa" ? [vazirmatn, nastaliq] : [plexMono];

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={fonts.map((font) => font.variable).join(" ")}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="relative flex min-h-dvh flex-col">
        <SiteNav locale={locale} dict={dict} />
        <main id="main" className="flex-1 overflow-x-clip">
          {children}
        </main>
        <SiteFooter locale={locale} dict={dict} cafe={cafe} />
        <MotionDriver />
      </body>
    </html>
  );
}
