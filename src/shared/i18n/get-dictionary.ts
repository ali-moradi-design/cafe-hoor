import type { Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { fa } from "./dictionaries/fa";

const dictionaries: Record<Locale, Dictionary> = { en, fa };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
