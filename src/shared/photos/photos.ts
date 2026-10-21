import data from "@content/photos.json";
import { z } from "zod";

/** Widths made by `scripts/build-photos.mjs`; keep the two lists in sync. */
export const PHOTO_WIDTHS = [480, 960, 1600] as const;

const photoSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  source: z.string().optional(),
  alt: z.object({ en: z.string().min(1), fa: z.string().min(1) }),
  gallery: z.boolean(),
  /**
   * Set for a free stock photo (Pexels licence) standing in for a dish the cafe has
   * not posted; the site marks it as a sample. `url` is the photo's Pexels page.
   */
  stock: z.object({ url: z.url() }).optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export type Photo = z.infer<typeof photoSchema>;

const photos = z.array(photoSchema).parse(data);
const byId = new Map(photos.map((photo) => [photo.id, photo]));

export function getPhoto(id: string): Photo {
  const photo = byId.get(id);
  if (!photo) throw new Error(`Unknown photo "${id}" (see content/photos.json).`);
  return photo;
}

export function getGalleryPhotos(): Photo[] {
  return photos.filter((photo) => photo.gallery);
}

/** Widths that exist for this photo (never upscaled). */
export function photoWidths(photo: Photo): number[] {
  const widths = PHOTO_WIDTHS.filter((width) => width <= photo.width);
  return widths.length ? widths : [PHOTO_WIDTHS[0]];
}

export function photoSrcSet(photo: Photo, format: "avif" | "webp" | "jpg"): string {
  return photoWidths(photo)
    .map((width) => `/photos/${photo.id}-${width}.${format} ${width}w`)
    .join(", ");
}

/** The largest variant, for the lightbox. */
export function photoLargest(photo: Photo): { src: string; width: number; height: number } {
  const width = photoWidths(photo).at(-1)!;
  return {
    src: `/photos/${photo.id}-${width}.webp`,
    width,
    height: Math.round((photo.height / photo.width) * width),
  };
}
