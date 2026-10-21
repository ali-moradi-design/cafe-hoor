import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";

import { getCafe } from "@/entities/cafe";
import { getDictionary, isLocale, localeDirection, locales } from "@/shared/i18n";
import { SiteFooter } from "@/widgets/site-footer";
import { SiteHeader } from "@/widgets/site-header";

import "../globals.css";

const vazirmatn = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-vazirmatn" });

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

export const viewport: Viewport = { themeColor: "#4a5a37" };

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const cafe = getCafe();

  return (
    <html lang={locale} dir={localeDirection[locale]} className={vazirmatn.variable}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-gold px-4 py-2 font-bold text-ink focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {dict.common.skipToContent}
        </a>
        <SiteHeader locale={locale} dict={dict} cafe={cafe} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} dict={dict} cafe={cafe} />
      </body>
    </html>
  );
}
