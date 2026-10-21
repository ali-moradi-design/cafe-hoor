import type { Locale } from "@/shared/i18n";
import { formatNumber } from "@/shared/lib";

import type { Pricing } from "../model/schema";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** Toman price → dollars at the stored rate, rounded to the nearest 5 cents. */
export function tomanToUsd(toman: number, tomanPerUsd: number): number {
  return Math.max(0.05, Math.round((toman / tomanPerUsd) * 20) / 20);
}

/**
 * `۲۵۳٬۰۰۰ تومان` on the Persian site, `$0.95` on the English site;
 * `null` when the price is not known yet.
 */
export function formatPrice(price: number | null, locale: Locale, pricing: Pricing): string | null {
  if (price === null) return null;
  if (locale === "en") return usd.format(tomanToUsd(price, pricing.usd.tomanPerUsd));
  return `${formatNumber(price, locale)} تومان`;
}
