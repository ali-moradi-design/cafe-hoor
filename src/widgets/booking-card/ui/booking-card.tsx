import { formatHours, type Cafe } from "@/entities/cafe";
import type { Dictionary, Locale } from "@/shared/i18n";
import { localizeDigits } from "@/shared/lib";
import type { Photo as PhotoData } from "@/shared/photos";
import { Photo } from "@/shared/ui";

/**
 * Booking block: light red text on one side, and a small white card on a mint
 * square with a flat red shadow on the other, with a photo and a call button.
 */
export function BookingCard({
  locale,
  dict,
  cafe,
  photo,
  headingLevel: Heading = "h2",
}: {
  locale: Locale;
  dict: Dictionary;
  cafe: Cafe;
  photo: PhotoData;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <div className="grid items-center gap-14 md:grid-cols-2">
      <div className="space-y-6 text-lg text-red" data-reveal>
        <p>{dict.home.bookText}</p>
        <p>
          <span className="block font-normal">{dict.contact.hours}</span>
          {dict.common.everyDay}
          {dict.common.comma}
          {formatHours(cafe.hours, locale)}
        </p>
        <p>
          <span className="block font-normal">{dict.contact.address}</span>
          {cafe.address[locale]}
        </p>
      </div>
      <div className="relative mx-auto w-full max-w-sm" data-reveal>
        <div className="bg-mint p-8 offset-red sm:p-12">
          <div className="border border-red bg-white p-3 text-center">
            <Heading className="mb-3 font-display text-3xl text-red">{dict.home.bookTitle}</Heading>
            <div className="aspect-4/3 overflow-hidden bg-mint-soft">
              <Photo photo={photo} locale={locale} sizes="320px" />
            </div>
            <a
              href={`tel:${cafe.phone}`}
              className="mt-4 block bg-red px-4 py-3 text-lg font-normal text-white transition-colors hover:bg-red-deep"
            >
              {dict.common.call} <span dir="ltr">{localizeDigits(cafe.phoneDisplay, locale)}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
