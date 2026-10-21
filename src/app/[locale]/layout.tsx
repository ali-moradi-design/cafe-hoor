import type { Metadata, Viewport } from "next";
import { Lalezar, Oswald, Roboto, Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";

import { getCafe } from "@/entities/cafe";
import { getDictionary, isLocale, localeDirection, localePath, locales } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { RevealObserver } from "@/shared/ui";
import { FloatingActions } from "@/widgets/floating-actions";
import { SideTabs } from "@/widgets/side-tabs";
import { SiteFooter } from "@/widgets/site-footer";
import { SiteHeader } from "@/widgets/site-header";

import "../globals.css";

// English: Oswald (display) + Roboto Light; Persian: Lalezar (display) + Vazirmatn.
// Only the pair of the page's language is put on <html>, so the browser downloads two.
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-oswald",
  preload: false,
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  preload: false,
});
const lalezar = Lalezar({
  subsets: ["arabic", "latin"],
  weight: "400",
  variable: "--font-lalezar",
  preload: false,
});
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-vazirmatn",
  preload: false,
});

// Runs before paint: marks JavaScript as available (for scroll reveals) and skips the
// splash after the first page of a visit.
const bootScript = `(() => {
  const d = document.documentElement;
  d.dataset.js = "";
  try { if (sessionStorage.getItem("hoor-splash")) d.dataset.splashSeen = ""; sessionStorage.setItem("hoor-splash", "1"); } catch {}
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

export const viewport: Viewport = { themeColor: "#ffffff" };

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const cafe = getCafe();
  const fonts = locale === "fa" ? [lalezar, vazirmatn] : [oswald, roboto];

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={cn(...fonts.map((font) => font.variable))}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <div
          aria-hidden
          className="splash no-print pointer-events-none fixed inset-0 z-[60] grid place-items-center bg-white [html[data-splash-seen]_&]:hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized logo */}
          <img
            src="/brand/logo-128.webp"
            alt=""
            width={112}
            height={112}
            className="size-28 rounded-full"
          />
        </div>
        <a
          href="#main"
          className="sr-only z-[70] bg-red px-4 py-2 text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {dict.common.skipToContent}
        </a>
        <SiteHeader locale={locale} dict={dict} cafe={cafe} />
        <SideTabs
          label={dict.common.sections}
          tabs={[
            { href: localePath(locale, "about"), label: dict.nav.about, tone: "white" },
            { href: localePath(locale, "menu"), label: dict.nav.menu, tone: "mint" },
            { href: localePath(locale, "gallery"), label: dict.nav.gallery, tone: "sage" },
          ]}
        />
        <div className="flex flex-1 flex-col pt-16 lg:pe-28 lg:pt-24">
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter locale={locale} dict={dict} cafe={cafe} />
        </div>
        <FloatingActions locale={locale} dict={dict} cafe={cafe} />
        <RevealObserver />
      </body>
    </html>
  );
}
