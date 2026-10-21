import type { Locale } from "@/shared/i18n";
import { localizeDigits } from "@/shared/lib";

import type { Cafe } from "../model/schema";

/** `09:00–23:30` in English, `۰۹:۰۰ تا ۲۳:۳۰` in Persian. */
export function formatHours(hours: Cafe["hours"], locale: Locale): string {
  const separator = locale === "fa" ? " تا " : "–";
  return localizeDigits(`${hours.opens}${separator}${hours.closes}`, locale);
}
