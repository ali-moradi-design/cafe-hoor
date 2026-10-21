/** The vertical name, as on the cafe's Instagram. */
export const NAME = Array.from("HOORFAMILY");

/** Letter box height in pixels (14px type on a 14px line). */
export const LETTER = 14;

/** Empty space between the star's centre and the inner end of each ray. */
export const CORE = 80;

/** Rays of the star: one every 10°. */
export const RAYS = 36;

/**
 * Where each letter sits along a fully spread name, as a fraction of the free
 * length: the gap after letter `i` is proportional to `n - 1 - i`, so the outer
 * letters spread most and the inner ones stay close.
 */
export function letterFractions(count = NAME.length): number[] {
  const total = (count * (count - 1)) / 2;
  let sum = 0;
  return Array.from({ length: count }, (_, index) => {
    const fraction = total ? sum / total : 0;
    sum += count - 1 - index;
    return fraction;
  });
}
