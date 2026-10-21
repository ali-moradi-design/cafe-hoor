import { describe, expect, it } from "vitest";

import { localePath } from "./paths";

describe("localePath", () => {
  it("builds trailing-slash paths", () => {
    expect(localePath("fa")).toBe("/fa/");
    expect(localePath("en", "menu")).toBe("/en/menu/");
    expect(localePath("en", "/menu/")).toBe("/en/menu/");
  });
});
