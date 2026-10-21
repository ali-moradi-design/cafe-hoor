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
      className="border border-red bg-white px-3 py-1 font-display text-lg text-red offset-mint transition-colors hover:bg-red hover:text-white"
    >
      {label}
    </Link>
  );
}
