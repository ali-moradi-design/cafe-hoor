"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/shared/i18n";

/** Links to the same page in the other language: `/fa/menu/` ↔ `/en/menu/`. */
export function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const target = locales.find((candidate) => candidate !== locale) ?? locale;
  const href = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${target}`);

  return (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      className="rounded-full border border-cream/40 px-3 py-1 text-sm font-bold transition-colors hover:bg-cream hover:text-forest focus-visible:outline-2 focus-visible:outline-gold"
    >
      {label}
    </Link>
  );
}
