import { describe, expect, it } from "vitest";

import { formatNumber, localizeDigits } from "./digits";

describe("localizeDigits", () => {
  it("uses Persian digits for fa only", () => {
    expect(localizeDigits("09:00", "fa")).toBe("۰۹:۰۰");
    expect(localizeDigits("09:00", "en")).toBe("09:00");
  });
});

describe("formatNumber", () => {
  it("groups thousands per locale", () => {
    expect(formatNumber(266000, "en")).toBe("266,000");
    expect(formatNumber(266000, "fa")).toBe("۲۶۶٬۰۰۰");
  });
});
