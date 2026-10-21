import type { Locale } from "@/shared/i18n";

import type { MenuItem } from "../model/schema";

/** Menu legend: ◊ breakfast, ∆ food, ○ cafe (cakes and drinks). */
const food = new Set(["starters", "iranian", "pizza", "burgers-sandwiches", "pasta"]);

export function menuSymbol(category: string): string {
  if (category === "breakfast") return "◊";
  return food.has(category) ? "∆" : "○";
}

/** The dish as a list: its name, then each ingredient on its own line. */
export function menuLines(item: MenuItem, locale: Locale): string[] {
  const parts = item.description[locale]
    .split(/\s*[,،]\s*|\s+(?:and|with|و)\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return [item.name[locale], ...parts];
}
