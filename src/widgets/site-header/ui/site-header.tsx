import Link from "next/link";

import type { Cafe } from "@/entities/cafe";
import { LocaleSwitch } from "@/features/switch-locale";
import { localePath, type Dictionary, type Locale } from "@/shared/i18n";
import { Container } from "@/shared/ui";

import { NavLinks } from "./nav-links";

export function SiteHeader({
  locale,
  dict,
  cafe,
}: {
  locale: Locale;
  dict: Dictionary;
  cafe: Cafe;
}) {
  const links = (["home", "menu", "gallery", "about", "contact"] as const).map((key) => ({
    href: localePath(locale, key === "home" ? "/" : key),
    label: dict.nav[key],
  }));

  return (
    <header className="bg-forest text-cream">
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-3 py-3">
        <Link href={localePath(locale)} className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized logo */}
          <img
            src="/brand/logo-128.webp"
            alt=""
            width={44}
            height={44}
            className="size-11 rounded-full border-2 border-gold"
          />
          <span className="text-lg font-extrabold">{cafe.name[locale]}</span>
        </Link>
        <div className="ms-auto sm:order-last">
          <LocaleSwitch locale={locale} label={dict.common.otherLanguage} />
        </div>
        <nav aria-label="Main" className="w-full sm:ms-auto sm:w-auto">
          <NavLinks links={links} />
        </nav>
      </Container>
    </header>
  );
}
