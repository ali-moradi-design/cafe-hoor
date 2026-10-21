import { formatHours, type Cafe } from "@/entities/cafe";
import type { Dictionary, Locale } from "@/shared/i18n";
import { localizeDigits } from "@/shared/lib";
import { ClockIcon, Container, InstagramIcon, PhoneIcon, PinIcon } from "@/shared/ui";

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
    <footer className="mt-auto bg-forest-deep text-cream/85">
      <Container className="grid gap-6 py-10 sm:grid-cols-3">
        <div>
          <p className="text-xl font-extrabold text-cream">{cafe.name[locale]}</p>
          <p className="mt-2 flex gap-2">
            <PinIcon className="mt-1 shrink-0" />
            {cafe.address[locale]}
          </p>
        </div>
        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <ClockIcon />
            {dict.common.everyDay}
            {dict.common.comma}
            {formatHours(cafe.hours, locale)}
          </p>
          <a
            href={`tel:${cafe.phone}`}
            className="flex items-center gap-2 hover:text-cream"
            dir="ltr"
          >
            <PhoneIcon />
            {localizeDigits(cafe.phoneDisplay, locale)}
          </a>
        </div>
        <div>
          <a
            href={cafe.instagram}
            className="inline-flex items-center gap-2 hover:text-cream"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon className="text-xl" />
            {dict.common.instagram}
          </a>
        </div>
      </Container>
      <div className="border-t border-white/10 py-4 text-center text-sm">
        © {year} {cafe.name[locale]}. {dict.footer.rights}
      </div>
    </footer>
  );
}
