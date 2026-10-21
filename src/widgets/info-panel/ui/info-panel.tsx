import { formatHours, type Cafe } from "@/entities/cafe";
import type { Dictionary, Locale } from "@/shared/i18n";
import { localizeDigits } from "@/shared/lib";
import type { Photo as PhotoData } from "@/shared/photos";
import { Letters, Parallax, Photo, RepelField } from "@/shared/ui";

import { OpeningClock } from "./opening-clock";

/**
 * Hours and contact, laid out like the reference's info block: the clock and the
 * hours in the start column, a photo in the middle, the address at the far end.
 */
export function InfoPanel({
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
  headingLevel?: "h1" | "h2";
}) {
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <RepelField className="relative mx-auto max-w-[780px] px-11 sm:px-20 md:px-0">
      <Heading className="sr-only">{dict.contact.title}</Heading>

      <div className="md:w-[33%]">
        <OpeningClock locale={locale} opens={cafe.hours.opens} />
        <div className="mt-6 text-[14px] leading-[1.45] md:max-w-[12.5rem]">
          <p data-repel className="w-fit rtl:font-display rtl:text-lg rtl:leading-[2.2]">
            {dict.home.services}
          </p>
          <p data-repel className="mt-4 w-fit">
            <span className="sr-only">{dict.contact.hours}: </span>
            {dict.common.everyDay}
            {dict.common.comma}
            {formatHours(cafe.hours, locale)}
          </p>
          <p data-repel className="mt-4">
            {dict.about.paragraphs[1]}
          </p>
          <p data-repel className="mt-12 w-fit">
            <span className="sr-only">{dict.contact.phone}: </span>
            <a href={`tel:${cafe.phone}`} dir="ltr" className="underline-offset-4 hover:underline">
              {localizeDigits(cafe.phoneDisplay, locale)}
            </a>
          </p>
          <p data-repel className="mt-3 w-fit uppercase">
            <a href={cafe.instagram} {...external} className="underline underline-offset-4">
              <Letters text={`${dict.common.instagram} @hoorfamily`} />
            </a>
          </p>
        </div>
      </div>

      <Parallax
        className="mx-auto mt-16 aspect-[2/3] w-full max-w-[345px] md:absolute md:start-[28%] md:top-[190px] md:mt-0 md:w-[44%]"
        extra={500}
      >
        <Photo
          photo={photo}
          locale={locale}
          sizes="(min-width: 768px) 345px, 80vw"
          className="h-full"
        />
      </Parallax>

      <address className="mt-16 text-[14px] leading-[1.6] not-italic md:ms-auto md:mt-40 md:w-[33%] md:ps-10">
        <span className="sr-only">{dict.contact.address}: </span>
        {cafe.address[locale].split(/[،,]\s*/).map((line) => (
          <span key={line} data-repel className="block w-fit">
            {line}
          </span>
        ))}
        <a
          data-repel
          href={cafe.mapUrl}
          {...external}
          className="mt-4 inline-block uppercase underline underline-offset-4"
        >
          <Letters text={dict.common.openMap} />
        </a>
      </address>
    </RepelField>
  );
}
