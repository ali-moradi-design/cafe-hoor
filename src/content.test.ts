import { existsSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { getCafe } from "@/entities/cafe";
import { getMenu, getPricing } from "@/entities/menu";
import { getGalleryPhotos, getPhoto } from "@/shared/photos";

// The content files are parsed with Zod when imported; these tests add the cross-file rules.
describe("content", () => {
  const { categories, items } = getMenu();

  it("has no hookah on the menu", () => {
    const text = JSON.stringify(items);
    expect(text).not.toMatch(/قلیان|hookah|shisha/i);
  });

  it("gives every item a price and every category at least one item", () => {
    expect(items.every((item) => item.price !== null)).toBe(true);
    for (const category of categories) {
      expect(
        items.some((item) => item.category === category.id),
        category.id,
      ).toBe(true);
    }
  });

  it("uses unique item ids", () => {
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
  });

  it("points menu photos at existing photo files", () => {
    for (const item of items.filter((i) => i.photo)) {
      const photo = getPhoto(item.photo!);
      expect(existsSync(`assets/photos/${photo.id}.jpg`), photo.id).toBe(true);
    }
  });

  it("only uses full-size photos in the gallery", () => {
    for (const photo of getGalleryPhotos()) {
      expect(photo.width, photo.id).toBeGreaterThanOrEqual(1000);
      expect(existsSync(`assets/photos/${photo.id}.jpg`), photo.id).toBe(true);
    }
  });

  it("has a current dollar rate and the cafe location in Tehran", () => {
    expect(getPricing().usd.tomanPerUsd).toBeGreaterThan(1000);
    const { lat, lng } = getCafe().geo;
    expect(lat).toBeCloseTo(35.7, 0);
    expect(lng).toBeCloseTo(51.4, 0);
  });
});
