import { describe, expect, it } from "vitest";

import type { MenuItem } from "@/entities/menu";

import { filterMenuItems, normalizeSearch } from "./filter-items";

const item = (id: string, fa: string, en: string): MenuItem => ({
  id,
  category: "coffee",
  name: { fa, en },
  description: { fa: "", en: "" },
  price: 100000,
  signature: false,
});

const items = [item("latte", "لاته", "Latte"), item("cake", "کیک شکلاتی", "Chocolate cake")];

describe("normalizeSearch", () => {
  it("folds Arabic letters, half-spaces and case", () => {
    expect(normalizeSearch("كيك")).toBe("کیک");
    expect(normalizeSearch("پیش\u200cغذا")).toBe("پیشغذا");
    expect(normalizeSearch("  LATTE ")).toBe("latte");
  });
});

describe("filterMenuItems", () => {
  it("returns everything for an empty query", () => {
    expect(filterMenuItems(items, " ", "fa")).toHaveLength(2);
  });

  it("matches Arabic-keyboard input against Persian names", () => {
    expect(filterMenuItems(items, "كيك", "fa").map((i) => i.id)).toEqual(["cake"]);
  });

  it("matches the English name on the Persian site too", () => {
    expect(filterMenuItems(items, "latte", "fa").map((i) => i.id)).toEqual(["latte"]);
  });
});
