import type { Locale } from "@/shared/i18n";
import { cn } from "@/shared/lib";

import { formatPrice } from "../lib/format-price";
import { lineIndents, menuLines, menuSymbol } from "../lib/menu-lines";
import type { MenuItem, Pricing } from "../model/schema";

/** Characters that fill one line of a 8.5rem item at 13px (mono Latin, proportional Persian). */
const charsPerLine: Record<Locale, number> = { en: 17, fa: 22 };

/**
 * One dish written like a list of ingredients: the legend symbol, the name, each
 * ingredient on its own line pushed in by a seeded random amount, then the price.
 * Every line is a `[data-repel]` target for `RepelField`.
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
  const comma = locale === "fa" ? "،" : ",";
  const symbol = menuSymbol(item.category) + (item.signature ? " ★" : "");
  const lines = [symbol, name, ...ingredients, price];
  const indents = lineIndents(lines, item.id, charsPerLine[locale]);
  const indent = (index: number) =>
    indents[index] ? { marginInlineStart: `${indents[index]}%` } : undefined;

  return (
    <article className={cn("w-[8rem] text-[13px] leading-[1.5] sm:w-[8.5rem]", className)}>
      <span data-repel aria-hidden className="block w-fit">
        {symbol}
      </span>
      {item.signature ? <span className="sr-only">{labels.signature}</span> : null}
      <h3
        data-repel
        className="block w-fit font-normal rtl:font-display rtl:text-[15px] rtl:leading-[2.1]"
        style={indent(1)}
      >
        {name}
        {comma}
      </h3>
      {ingredients.map((line, index) => (
        <span key={index} data-repel className="mt-1.5 block w-fit" style={indent(index + 2)}>
          {line}
          {comma}
        </span>
      ))}
      <span
        data-repel
        className="mt-1.5 block w-fit text-dim"
        style={indent(lines.length - 1)}
        dir={locale === "fa" ? "rtl" : "ltr"}
      >
        {price}
      </span>
    </article>
  );
}
