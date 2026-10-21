import type { Locale } from "@/shared/i18n";

/**
 * The vertical name, as the cafe calls itself on Instagram, one letter per line.
 * English: `HOORFAMILY`, every letter drifting apart as the page scrolls. Persian:
 * «خانه هور» in Nastaliq; the letters of each word stay together and the two
 * words drift only a little apart. `groups` gives each letter its word; `size` is the
 * height of one letter's box in pixels.
 */
export type NameStyle = {
  letters: string[];
  groups: number[];
  size: number;
  /** Gap between words even before any spread, in pixels. */
  wordGap: number;
  /** Most the words may drift apart, in pixels (none: they fill the whole ray). */
  maxSpread?: number;
  className: string;
};

export const NAMES: Record<Locale, NameStyle> = {
  en: {
    letters: Array.from("HOORFAMILY"),
    groups: Array.from("HOORFAMILY", (_, index) => index),
    size: 14,
    wordGap: 0,
    className: "text-[14px] leading-[14px]",
  },
  fa: {
    letters: Array.from("خانههور"),
    groups: [0, 0, 0, 0, 1, 1, 1],
    size: 21,
    wordGap: 14,
    maxSpread: 18,
    className: "font-display text-[21px] leading-[21px]",
  },
};

/**
 * Where each letter's spread offset sits, as a fraction of the free length: the
 * gaps fall only between groups, and the gap after group `g` is proportional to
 * `n - 1 - g` (see `letterFractions`).
 */
export function groupFractions(groups: number[]): number[] {
  const fractions = letterFractions(Math.max(...groups) + 1);
  return groups.map((group) => fractions[group]);
}

/** Top of each letter, in pixels, once `spread` free pixels are shared out. */
export function letterTops(groups: number[], size: number, spread: number, wordGap = 0): number[] {
  return groupFractions(groups).map(
    (fraction, index) => index * size + groups[index] * wordGap + spread * fraction,
  );
}

/** Length of the name with no spread: the letters plus the resting word gaps. */
export function restLength({ letters, groups, size, wordGap }: NameStyle): number {
  return letters.length * size + Math.max(...groups) * wordGap;
}

/** Empty space between the star's centre and the inner end of each ray. */
export const CORE = 80;

/** Rays of the star: one every 10°. */
export const RAYS = 36;

/**
 * Where each letter sits along a fully spread name, as a fraction of the free
 * length: the gap after letter `i` is proportional to `n - 1 - i`, so the outer
 * letters spread most and the inner ones stay close.
 */
export function letterFractions(count: number): number[] {
  const total = (count * (count - 1)) / 2;
  let sum = 0;
  return Array.from({ length: count }, (_, index) => {
    const fraction = total ? sum / total : 0;
    sum += count - 1 - index;
    return fraction;
  });
}
