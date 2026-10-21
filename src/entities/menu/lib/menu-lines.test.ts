import { describe, expect, it } from "vitest";

import type { MenuItem } from "../model/schema";
import { menuLines, menuSymbol } from "./menu-lines";

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

describe("menuSymbol", () => {
  it("marks breakfast, food and the cafe", () => {
    expect(menuSymbol("breakfast")).toBe("◊");
    expect(menuSymbol("pizza")).toBe("∆");
    expect(menuSymbol("coffee")).toBe("○");
  });
});
