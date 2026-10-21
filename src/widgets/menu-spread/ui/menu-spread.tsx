import Link from "next/link";

import { formatHours, type Cafe } from "@/entities/cafe";
import { MenuItemLines, type MenuItem, type Pricing } from "@/entities/menu";
import { localePath, type Dictionary, type Locale } from "@/shared/i18n";
import type { Photo as PhotoData } from "@/shared/photos";
import { Letters, Parallax, Photo, RepelField } from "@/shared/ui";

import { DateDial } from "./date-dial";

/** Dishes in two staggered columns: every second dish sits lower. */
function ItemColumns({
  items,
  locale,
  pricing,
  labels,
}: {
  items: MenuItem[];
  locale: Locale;
  pricing: Pricing;
  labels: Dictionary["menu"];
}) {
  return (
    <div className="grid grid-cols-2 justify-items-start gap-x-4 gap-y-16 sm:gap-x-10">
      {items.map((item, index) => (
        <MenuItemLines
          key={item.id}
          item={item}
          locale={locale}
          pricing={pricing}
          labels={labels}
          className={index % 2 === 1 ? "mt-12" : undefined}
        />
      ))}
    </div>
  );
}

/**
 * The home page's menu, laid out like the reference: a tall photo in the middle,
 * the hours and links beside it, a date dial on the other side, then the dishes
 * written as lists of ingredients in staggered columns, and a closing photo.
 */
export function MenuSpread({
  items,
  locale,
  pricing,
  dict,
  cafe,
  photos,
}: {
  items: MenuItem[];
  locale: Locale;
  pricing: Pricing;
  dict: Dictionary;
  cafe: Cafe;
  photos: { top: PhotoData; bottom: PhotoData };
}) {
  const half = Math.ceil(items.length / 2);
  const legend = dict.home.legend;

  return (
    <RepelField className="relative mx-auto max-w-[780px] px-11 sm:px-20 md:px-0">
      <h2 className="sr-only">{dict.home.menuTitle}</h2>

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
            <p data-repel className="mt-4 w-fit text-[11px]">
              {dict.home.subjectToChange}
            </p>
            <p data-repel className="mt-4 text-[12px] text-dim">
              ◊ {legend.breakfast} · ∆ {legend.food} · ○ {legend.cafe} · ★ {legend.favourite}
            </p>
            <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 uppercase">
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
            <ItemColumns
              items={items.slice(0, half)}
              locale={locale}
              pricing={pricing}
              labels={dict.menu}
            />
          </div>
        </div>
        <div className="mt-16 md:mt-0 md:w-[44%] md:pt-[815px]">
          <ItemColumns
            items={items.slice(half)}
            locale={locale}
            pricing={pricing}
            labels={dict.menu}
          />
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
