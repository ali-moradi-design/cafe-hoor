import categoriesData from "@content/categories.json";
import itemsData from "@content/menu.json";
import pricingData from "@content/pricing.json";
import { z } from "zod";

import {
  menuCategorySchema,
  menuItemSchema,
  pricingSchema,
  type MenuCategory,
  type MenuItem,
  type Pricing,
} from "../model/schema";

const categories = z.array(menuCategorySchema).parse(categoriesData);
const items = z.array(menuItemSchema).parse(itemsData);
const pricing = pricingSchema.parse(pricingData);

const categoryIds = new Set(categories.map((category) => category.id));
for (const item of items) {
  if (!categoryIds.has(item.category)) {
    throw new Error(`Menu item "${item.id}" uses unknown category "${item.category}".`);
  }
}

export function getMenu(): { categories: MenuCategory[]; items: MenuItem[] } {
  return { categories, items };
}

export function getSignatureItems(): MenuItem[] {
  return items.filter((item) => item.signature);
}

export function getPricing(): Pricing {
  return pricing;
}
