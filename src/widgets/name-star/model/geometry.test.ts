import { describe, expect, it } from "vitest";

import { letterFractions, letterTops } from "./geometry";

describe("letterFractions", () => {
  it("runs from the outer end (0) to the inner end (1)", () => {
    const fractions = letterFractions(10);
    expect(fractions[0]).toBe(0);
    expect(fractions.at(-1)).toBe(1);
  });

  it("leaves the biggest gap after the first letter and the smallest before the last", () => {
    const fractions = letterFractions(10);
    const gaps = fractions.slice(1).map((value, index) => value - fractions[index]);
    expect(gaps[0]).toBeGreaterThan(gaps.at(-1)!);
    expect([...gaps].sort((a, b) => b - a)).toEqual(gaps);
  });
});

describe("letterTops", () => {
  it("keeps the letters of a word together and opens the gap between words", () => {
    const tops = letterTops([0, 0, 0, 0, 1, 1, 1], 26, 200);
    const gaps = tops.slice(1).map((top, index) => top - tops[index]);
    expect(gaps).toEqual([26, 26, 26, 226, 26, 26]);
  });

  it("stacks edge to edge before any spread", () => {
    expect(letterTops([0, 1, 2], 14, 0)).toEqual([0, 14, 28]);
  });
});
