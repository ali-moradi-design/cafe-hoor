import Link from "next/link";
import { Fragment } from "react";

import type { Cafe } from "@/entities/cafe";
import { localePath, type Dictionary, type Locale } from "@/shared/i18n";
import { localizeDigits } from "@/shared/lib";

/** One row of tiny links split by bars, as on the reference site. */
export function SiteFooter({
  locale,
  dict,
  cafe,
}: {
  locale: Locale;
  dict: Dictionary;
  cafe: Cafe;
}) {
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;
  const links = [
    { href: cafe.instagram, label: dict.common.instagram, ...external },
    { href: `tel:${cafe.phone}`, label: dict.common.call },
    { href: cafe.mapUrl, label: dict.common.openMap, ...external },
    { href: localePath(locale, "about"), label: dict.nav.about, internal: true },
    { href: localePath(locale, "contact"), label: dict.nav.contact, internal: true },
  ];
  const year = localizeDigits(String(new Date().getFullYear()), locale);

  return (
    <footer className="no-print px-14 pt-10 pb-12 text-center text-[11px] tracking-[0.08em] uppercase">
      <ul className="flex flex-wrap items-center justify-center gap-y-2">
        {links.map(({ internal, label, ...link }, index) => (
          <Fragment key={link.href}>
            {index > 0 ? (
              <li aria-hidden className="px-3 sm:px-5">
                |
              </li>
            ) : null}
            <li>
              {internal ? (
                <Link href={link.href} className="underline-offset-4 hover:underline">
                  {label}
                </Link>
              ) : (
                <a {...link} className="underline-offset-4 hover:underline">
                  {label}
                </a>
              )}
            </li>
          </Fragment>
        ))}
      </ul>
      <p className="mt-6 text-dim normal-case">
        © {year} {cafe.name[locale]}
      </p>
    </footer>
  );
}
