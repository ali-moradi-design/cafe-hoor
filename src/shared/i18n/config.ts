export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fa";

export const localeDirection: Record<Locale, "rtl" | "ltr"> = { fa: "rtl", en: "ltr" };
export const intlLocale: Record<Locale, string> = { fa: "fa-IR", en: "en-US" };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Text stored in both languages, as in `content/*.json`. */
export type Localized<T = string> = Record<Locale, T>;
