import { z } from "zod";

const localized = z.object({ en: z.string().min(1), fa: z.string().min(1) });
const localizedOptional = z.object({ en: z.string(), fa: z.string() });

export const menuCategorySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: localized,
});

export const menuItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  category: z.string(),
  name: localized,
  /** Empty when the cafe's menu gives no details. */
  description: localizedOptional,
  /** Toman, as an integer. `null` until the price is confirmed with the cafe. */
  price: z.number().int().positive().nullable(),
  signature: z.boolean().default(false),
  /** Photo id from `content/photos.json`. */
  photo: z.string().optional(),
});

export const pricingSchema = z.object({
  currency: z.literal("TOMAN"),
  vatPercent: z.number().nonnegative(),
  /** The English site shows approximate dollar prices; the bill is always in toman. */
  usd: z.object({
    tomanPerUsd: z.number().int().positive(),
    date: z.iso.date(),
    source: z.string(),
  }),
});

export type MenuCategory = z.infer<typeof menuCategorySchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type Pricing = z.infer<typeof pricingSchema>;
