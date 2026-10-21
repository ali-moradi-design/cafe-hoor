import { describe, expect, it } from "vitest";

import { clamp, mapRange, seededRandom } from "./random";

describe("seededRandom", () => {
  it("repeats the same sequence for the same seed", () => {
    const a = seededRandom("hoor");
    const b = seededRandom("hoor");
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("gives different sequences for different seeds, always in [0, 1)", () => {
    const a = seededRandom("menu");
    const b = seededRandom("gallery");
    const values = Array.from({ length: 50 }, () => a());
    expect(values[0]).not.toBe(b());
    expect(values.every((value) => value >= 0 && value < 1)).toBe(true);
  });
});

describe("mapRange and clamp", () => {
  it("maps linearly and keeps going past the ends", () => {
    expect(mapRange(5, 0, 10, 0.3, 1)).toBeCloseTo(0.65);
    expect(mapRange(20, 0, 10, 100, 0)).toBe(-100);
  });

  it("clamps", () => {
    expect(clamp(-1, 0, 1)).toBe(0);
    expect(clamp(2, 0, 1)).toBe(1);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });
});
