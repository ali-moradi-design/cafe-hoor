import type { MenuItem } from "@/entities/menu";
import type { Locale } from "@/shared/i18n";

/** Folds Arabic letter forms, half-spaces and case so `کیک` matches `كيك` and `Latte` matches `latte`. */
export function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\u064b-\u065f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function filterMenuItems(items: MenuItem[], query: string, locale: Locale): MenuItem[] {
  const needle = normalizeSearch(query);
  if (!needle) return items;
  return items.filter((item) =>
    normalizeSearch(`${item.name[locale]} ${item.description[locale]} ${item.name.en}`).includes(
      needle,
    ),
  );
}
