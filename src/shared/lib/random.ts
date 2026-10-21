/**
 * A small seeded random generator (mulberry32 over a string hash). The same seed
 * always gives the same sequence, so a layout built from it is stable between
 * builds and between the server and the browser.
 */
export function seededRandom(seed: string): () => number {
  let state = 2166136261;
  for (let index = 0; index < seed.length; index++) {
    state = Math.imul(state ^ seed.charCodeAt(index), 16777619);
  }
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** Maps `value` from the range `[from0, from1]` to `[to0, to1]`, without clamping. */
export function mapRange(
  value: number,
  from0: number,
  from1: number,
  to0: number,
  to1: number,
): number {
  return to0 + ((to1 - to0) * (value - from0)) / (from1 - from0);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
