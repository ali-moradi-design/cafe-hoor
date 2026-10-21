"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/shared/i18n";
import { cn } from "@/shared/lib";

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
      className={cn(
        "inline-flex min-h-6 items-center underline-offset-4 hover:underline",
        // «فارسی» in Nastaliq; «English» in the page's text face.
        target === "fa"
          ? "font-[family-name:var(--font-nastaliq)] text-[17px] leading-[2.2]"
          : "text-xs tracking-[0.08em] uppercase",
      )}
    >
      {label}
    </Link>
  );
}
