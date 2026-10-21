import { z } from "zod";

const localized = z.object({ en: z.string().min(1), fa: z.string().min(1) });
const time = z.string().regex(/^\d{2}:\d{2}$/);

export const cafeSchema = z.object({
  name: localized,
  shortName: localized,
  address: localized,
  phone: z.string().regex(/^\+\d+$/),
  phoneDisplay: z.string(),
  hours: z.object({ opens: time, closes: time }),
  instagram: z.url(),
  mapUrl: z.url(),
  /** The Google Maps place behind `mapUrl` (the snapp-store page has wrong coordinates). */
  geo: z.object({ lat: z.number(), lng: z.number() }),
});

export type Cafe = z.infer<typeof cafeSchema>;
