import { describe, expect, it } from "vitest";

import type { MenuItem } from "../model/schema";
import { lineIndents, menuLines, menuSymbol } from "./menu-lines";

const item: MenuItem = {
  id: "fried-eggs",
  category: "breakfast",
  signature: false,
  name: { en: "Fried eggs", fa: "نیمرو" },
  description: {
    en: "Two eggs with tandoor bread and Lahijan black tea",
    fa: "دو عدد تخم مرغ، نان تنوری، چای سیاه لاهیجان",
  },
  price: 353000,
};

describe("menuLines", () => {
  it("puts the name first, then one ingredient per line", () => {
    expect(menuLines(item, "fa")).toEqual([
      "نیمرو",
      "دو عدد تخم مرغ",
      "نان تنوری",
      "چای سیاه لاهیجان",
    ]);
    expect(menuLines(item, "en")).toEqual([
      "Fried eggs",
      "Two eggs",
      "tandoor bread",
      "Lahijan black tea",
    ]);
  });

  it("gives just the name when there is no description", () => {
    expect(menuLines({ ...item, description: { en: "", fa: "" } }, "fa")).toEqual(["نیمرو"]);
  });
});

describe("lineIndents", () => {
  it("keeps every other line at the edge and stays inside the item", () => {
    const lines = ["◊", "Fried eggs", "Two eggs", "tandoor bread", "Lahijan black tea"];
    const indents = lineIndents(lines, "fried-eggs", 17);
    expect(indents).toHaveLength(lines.length);
    expect(indents[0]).toBe(0);
    expect(indents[2]).toBe(0);
    lines.forEach((line, index) => {
      const width = Math.min(100, (line.length / 17) * 100);
      expect(indents[index] + width).toBeLessThanOrEqual(100.5);
    });
  });

  it("is the same for the same seed", () => {
    const lines = ["a", "bb", "ccc", "dddd"];
    expect(lineIndents(lines, "x", 10)).toEqual(lineIndents(lines, "x", 10));
  });
});

describe("menuSymbol", () => {
  it("marks breakfast, food and the cafe", () => {
    expect(menuSymbol("breakfast")).toBe("◊");
    expect(menuSymbol("pizza")).toBe("∆");
    expect(menuSymbol("coffee")).toBe("○");
  });
});
