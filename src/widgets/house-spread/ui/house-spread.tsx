import Link from "next/link";

import { formatHours, type Cafe } from "@/entities/cafe";
import { localePath, type Dictionary, type Locale } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import type { Photo as PhotoData } from "@/shared/photos";
import { Letters, Parallax, Photo, RepelField } from "@/shared/ui";

import { DateDial } from "./date-dial";

/** Small photos of the house with their captions, in two staggered columns. */
function Moments({ photos, locale }: { photos: PhotoData[]; locale: Locale }) {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-16 sm:gap-x-10">
      {photos.map((photo, index) => (
        <li key={photo.id} className={cn(index % 2 === 1 && "mt-20")}>
          <Parallax>
            <div className="aspect-[4/5] w-full overflow-hidden">
              <Photo
                photo={photo}
                locale={locale}
                sizes="(min-width: 768px) 160px, 40vw"
                className="h-full"
              />
            </div>
            <p className="mt-3 text-[12px] leading-[1.6] text-dim">{photo.alt[locale]}</p>
          </Parallax>
        </li>
      ))}
    </ul>
  );
}

/**
 * The home page's house spread, laid out like the reference's menu block: a tall
 * photo in the middle, the hours, the story and the links beside it, the date dial
 * on the other side, then moments of the house in staggered columns and a closing
 * photo.
 */
export function HouseSpread({
  locale,
  dict,
  cafe,
  photos,
}: {
  locale: Locale;
  dict: Dictionary;
  cafe: Cafe;
  photos: { top: PhotoData; bottom: PhotoData; moments: PhotoData[] };
}) {
  const half = Math.ceil(photos.moments.length / 2);

  return (
    <RepelField className="relative mx-auto max-w-[780px] px-11 sm:px-20 md:px-0">
      <h2 className="sr-only">{dict.home.storyTitle}</h2>

      <Parallax className="mx-auto aspect-[2/3] w-full max-w-[345px] md:absolute md:start-[28%] md:top-0 md:w-[44%] md:max-w-none">
        <Photo
          photo={photos.top}
          locale={locale}
          sizes="(min-width: 768px) 345px, 80vw"
          className="h-full"
        />
      </Parallax>

      <DateDial
        locale={locale}
        className="mx-auto mt-10 md:absolute md:end-0 md:top-[250px] md:mt-0"
      />

      <div className="md:flex md:justify-between">
        <div className="md:w-[44%] md:pt-[210px]">
          <div className="mt-14 max-w-[11.5rem] text-[14px] leading-[1.75] md:mt-0">
            <p data-repel className="w-fit rtl:font-display rtl:text-lg rtl:leading-[2.2]">
              {dict.home.services}
            </p>
            <p data-repel className="mt-5 w-fit">
              {dict.common.everyDay}
              <br />
              {formatHours(cafe.hours, locale)}
            </p>
            <p data-repel className="mt-5">
              {dict.home.storyText}
            </p>
            <p className="mt-8 flex flex-col items-start gap-2 uppercase">
              <Link
                data-repel
                href={localePath(locale, "menu")}
                className="underline underline-offset-4"
              >
                <Letters text={dict.home.fullMenu} />
              </Link>
              <a data-repel href={`tel:${cafe.phone}`} className="underline underline-offset-4">
                <Letters text={dict.common.call} />
              </a>
            </p>
          </div>
          <div className="mt-24 md:mt-28">
            <Moments photos={photos.moments.slice(0, half)} locale={locale} />
          </div>
        </div>
        <div className="mt-16 md:mt-0 md:w-[44%] md:pt-[815px]">
          <p data-repel className="mb-16 max-w-[16rem] text-[14px] leading-[1.75]">
            {dict.home.welcome}
          </p>
          <Moments photos={photos.moments.slice(half)} locale={locale} />
        </div>
      </div>

      <Parallax className="mx-auto mt-28 aspect-[2/3] w-full max-w-[345px] md:w-[44%]" extra={500}>
        <Photo
          photo={photos.bottom}
          locale={locale}
          sizes="(min-width: 768px) 345px, 80vw"
          className="h-full"
        />
      </Parallax>
    </RepelField>
  );
}
