import type { Locale } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { getPhoto } from "@/shared/photos";
import { Photo } from "@/shared/ui";

import { formatPrice } from "../lib/format-price";
import { menuLines, menuSymbol } from "../lib/menu-lines";
import type { MenuItem, Pricing } from "../model/schema";

/**
 * One dish: the legend symbol and the name, the ingredients on one calm line
 * below, then the price; its Instagram photo beside it when it has one. The
 * lines are `[data-repel]` targets for `RepelField`.
 */
export function MenuItemLines({
  item,
  locale,
  pricing,
  labels,
  className,
}: {
  item: MenuItem;
  locale: Locale;
  pricing: Pricing;
  labels: { priceSoon: string; signature: string };
  className?: string;
}) {
  const [name, ...ingredients] = menuLines(item, locale);
  const price = formatPrice(item.price, locale, pricing) ?? labels.priceSoon;
  const separator = locale === "fa" ? "، " : ", ";

  return (
    <article className={cn("flex gap-4 text-[13px] leading-[1.8]", className)}>
      {item.photo ? (
        <div className="aspect-[4/5] w-24 shrink-0 self-start overflow-hidden sm:w-28">
          <Photo
            photo={getPhoto(item.photo)}
            locale={locale}
            sizes="112px"
            className="h-full transition-transform duration-700 hover:scale-105 motion-reduce:transition-none"
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <h3 data-repel className="flex items-baseline gap-2 font-normal">
          <span aria-hidden className="shrink-0 text-[12px] text-dim">
            {menuSymbol(item.category)}
          </span>
          <span className="text-[14px] font-bold rtl:font-display rtl:text-[17px] rtl:leading-[2.3] rtl:font-normal">
            {name}
          </span>
          {item.signature ? (
            <span className="shrink-0 text-[11px] text-mint">
              ★<span className="sr-only"> {labels.signature}</span>
            </span>
          ) : null}
        </h3>
        {ingredients.length ? (
          <p data-repel className="mt-1 text-white/80">
            {ingredients.join(separator)}
          </p>
        ) : null}
        <p data-repel className="mt-2 text-dim" dir={locale === "fa" ? "rtl" : "ltr"}>
          {price}
        </p>
      </div>
    </article>
  );
}
