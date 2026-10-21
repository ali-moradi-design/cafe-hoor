import { describe, expect, it } from "vitest";

import type { Pricing } from "../model/schema";
import { formatPrice, tomanToUsd } from "./format-price";

const pricing: Pricing = {
  currency: "TOMAN",
  vatPercent: 10,
  usd: { tomanPerUsd: 266000, date: "2026-10-21", source: "test" },
};

describe("tomanToUsd", () => {
  it("rounds to the nearest 5 cents", () => {
    expect(tomanToUsd(253000, 266000)).toBe(0.95);
    expect(tomanToUsd(997000, 266000)).toBe(3.75);
  });

  it("never shows a free item", () => {
    expect(tomanToUsd(1000, 266000)).toBe(0.05);
  });
});

describe("formatPrice", () => {
  it("shows toman with Persian digits on the Persian site", () => {
    expect(formatPrice(253000, "fa", pricing)).toBe("۲۵۳٬۰۰۰ تومان");
  });

  it("shows dollars on the English site", () => {
    expect(formatPrice(1093500, "en", pricing)).toBe("$4.10");
  });

  it("returns null for an unknown price", () => {
    expect(formatPrice(null, "en", pricing)).toBeNull();
  });
});
