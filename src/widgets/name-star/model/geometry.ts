import type { Locale } from "@/shared/i18n";

/**
 * The vertical name, as the cafe calls itself on Instagram: `HOORFAMILY` in
 * English, «خانه هور» in Nastaliq in Persian (one letter per line; ه، و and ر
 * hardly join forward, so the stacked letters still read). `size` is the height
 * of one letter's box in pixels.
 */
export const NAMES: Record<Locale, { letters: string[]; size: number; className: string }> = {
  en: { letters: Array.from("HOORFAMILY"), size: 14, className: "text-[14px] leading-[14px]" },
  fa: {
    letters: Array.from("خانههور"),
    size: 26,
    className: "font-display text-[21px] leading-[26px]",
  },
};

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
