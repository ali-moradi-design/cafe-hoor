import Link from "next/link";

import { formatHours, type Cafe } from "@/entities/cafe";
import { localePath, type Dictionary, type Locale } from "@/shared/i18n";
import { localizeDigits } from "@/shared/lib";

/** Quiet footer: name, address, hours, phone and a few links, centred. */
export function SiteFooter({
  locale,
  dict,
  cafe,
}: {
  locale: Locale;
  dict: Dictionary;
  cafe: Cafe;
}) {
  const year = localizeDigits(String(new Date().getFullYear()), locale);
  return (
    <footer className="no-print border-t border-mint bg-white py-12 text-center text-red">
      <p className="font-display text-3xl uppercase">{cafe.name[locale]}</p>
      <p className="mt-3">{cafe.address[locale]}</p>
      <p className="mt-1">
        {dict.common.everyDay}
        {dict.common.comma}
        {formatHours(cafe.hours, locale)}
        {" · "}
        <a href={`tel:${cafe.phone}`} dir="ltr" className="hover:underline">
          {localizeDigits(cafe.phoneDisplay, locale)}
        </a>
      </p>
      <ul className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 font-display text-lg">
        {(["menu", "gallery", "about", "contact"] as const).map((key) => (
          <li key={key}>
            <Link href={localePath(locale, key)} className="hover:underline">
              {dict.nav[key]}
            </Link>
          </li>
        ))}
        <li>
          <a
            href={cafe.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {dict.common.instagram}
          </a>
        </li>
      </ul>
      <p className="mt-8 text-sm text-ink">
        © {year} {cafe.name[locale]}. {dict.footer.rights}
      </p>
    </footer>
  );
}
