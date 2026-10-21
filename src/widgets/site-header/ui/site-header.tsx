import Link from "next/link";

import type { Cafe } from "@/entities/cafe";
import { LocaleSwitch } from "@/features/switch-locale";
import { localePath, type Dictionary, type Locale } from "@/shared/i18n";

import { MobileNav } from "./mobile-nav";

const linkClass = "hover:underline hover:underline-offset-8";

/**
 * Fixed white header: logo at the start, a few thin red links in the middle,
 * language at the end. The page links live in the side strips on wide screens
 * and in the drop-down on phones and tablets.
 */
export function SiteHeader({
  locale,
  dict,
  cafe,
}: {
  locale: Locale;
  dict: Dictionary;
  cafe: Cafe;
}) {
  const pages = (["home", "menu", "gallery", "about", "contact"] as const).map((key) => ({
    href: localePath(locale, key === "home" ? "/" : key),
    label: dict.nav[key],
  }));

  return (
    <header className="no-print fixed inset-x-0 top-0 z-40 bg-white/92 backdrop-blur-sm lg:pe-28">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-8 lg:h-24">
        <Link href={localePath(locale)} className="flex shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized logo */}
          <img
            src="/brand/logo-128.webp"
            alt={cafe.name[locale]}
            width={56}
            height={56}
            className="size-11 rounded-full lg:size-14"
          />
        </Link>

        <nav aria-label="Main" className="mx-auto hidden md:block">
          <ul className="flex items-center gap-10 text-lg font-light text-red lg:gap-16">
            <li>
              <a href={`tel:${cafe.phone}`} className={linkClass}>
                {dict.common.book}
              </a>
            </li>
            <li>
              <Link href={localePath(locale, "contact")} className={linkClass}>
                {dict.nav.contact}
              </Link>
            </li>
            <li>
              <a
                href={cafe.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {dict.common.instagram}
              </a>
            </li>
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          <LocaleSwitch locale={locale} label={dict.common.otherLanguage} />
          <MobileNav
            links={pages}
            labels={{ open: dict.common.openNav, close: dict.common.closeNav }}
          />
        </div>
      </div>
    </header>
  );
}
