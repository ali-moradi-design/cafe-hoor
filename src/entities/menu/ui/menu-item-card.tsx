import type { Locale } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { getPhoto } from "@/shared/photos";
import { Photo } from "@/shared/ui";

import { formatPrice } from "../lib/format-price";
import type { MenuItem, Pricing } from "../model/schema";

export function MenuItemCard({
  item,
  locale,
  pricing,
  labels,
}: {
  item: MenuItem;
  locale: Locale;
  pricing: Pricing;
  labels: { priceSoon: string; signature: string };
}) {
  const price = formatPrice(item.price, locale, pricing);
  return (
    <article
      className={cn(
        "flex gap-4 rounded-2xl border border-sand bg-white/75 shadow-sm",
        item.photo ? "p-3" : "px-4 py-3.5",
      )}
    >
      {item.photo ? (
        <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-sand sm:size-28">
          <Photo photo={getPhoto(item.photo)} locale={locale} sizes="112px" />
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg leading-snug font-bold text-forest">{item.name[locale]}</h3>
          {item.signature ? (
            <span className="shrink-0 rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-bold text-gold-deep">
              {labels.signature}
            </span>
          ) : null}
        </div>
        {item.description[locale] ? (
          <p className="mt-1 text-sm leading-relaxed text-ink/70">{item.description[locale]}</p>
        ) : null}
        <p className="mt-auto pt-2 font-bold" dir={locale === "fa" ? "rtl" : "ltr"}>
          {price ?? <span className="text-sm font-medium text-ink/45">{labels.priceSoon}</span>}
        </p>
      </div>
    </article>
  );
}
