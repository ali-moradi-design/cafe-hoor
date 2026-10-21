import type { Locale } from "@/shared/i18n";

import { formatPrice } from "../lib/format-price";
import type { MenuItem, Pricing } from "../model/schema";

/** One line of a printed menu: bold name, contents, price. Centred. */
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
    <article className="text-center">
      <h3 className="text-lg leading-snug font-bold text-pine">
        {item.name[locale]}
        {item.signature ? (
          <span className="ms-2 align-middle text-xs font-medium text-red-deep">
            ★ {labels.signature}
          </span>
        ) : null}
      </h3>
      <p className="text-base leading-relaxed text-ink">
        {item.description[locale] ? <>{item.description[locale]} </> : null}
        <span
          className="font-medium whitespace-nowrap text-pine"
          dir={locale === "fa" ? "rtl" : "ltr"}
        >
          {price ?? labels.priceSoon}
        </span>
      </p>
    </article>
  );
}
