import { intlLocale, type Locale } from "../i18n";

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

/** Replaces Latin digits with Persian ones for `fa`; keeps the text as is for `en`. */
export function localizeDigits(text: string, locale: Locale): string {
  if (locale !== "fa") return text;
  return text.replace(/\d/g, (digit) => persianDigits[Number(digit)]);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale]).format(value);
}
