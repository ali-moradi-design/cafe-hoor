import type { Locale } from "@/shared/i18n";
import { seededRandom } from "@/shared/lib";

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

/** Fractions of the free space a line may be pushed in by (from the reference site). */
const indentations = [0.222, 0.417, 0.583, 0.722, 0.833, 0.917, 0.972];

/**
 * Start margins (percent of the item's width) for a list of lines: every other line
 * starts at the edge, the rest are pushed in by a random part of the space their
 * neighbours leave. Seeded, so an item keeps its shape between builds.
 * `charsPerLine` is how many characters fill one line of the item.
 */
export function lineIndents(lines: string[], seed: string, charsPerLine: number): number[] {
  const random = seededRandom(seed);
  const widths = lines.map((line) => Math.min(100, (line.length / charsPerLine) * 100));
  return widths.map((width, index) => {
    if (index % 2 === 0 || width >= 100) return 0;
    const previous = widths[index - 1] ?? 100;
    const next = widths[index + 1] ?? 100;
    const pick = indentations[Math.floor(random() * indentations.length)];
    const fits = width + previous <= 100 || width + next <= 100;
    const room = fits ? Math.min(previous, next) : 100 - width;
    return Math.round(Math.min(100 - width, room * pick));
  });
}
