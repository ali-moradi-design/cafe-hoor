import type { Locale } from "../i18n";
import { cn } from "../lib";
import { photoSrcSet, photoWidths, type Photo as PhotoData } from "../photos";

/**
 * A content photo as `<picture>`: AVIF, then WebP, then JPEG, each in several widths.
 * `sizes` tells the browser how wide the photo is drawn, so it picks the right file.
 */
export function Photo({
  photo,
  locale,
  sizes,
  className,
  priority = false,
}: {
  photo: PhotoData;
  locale: Locale;
  sizes: string;
  className?: string;
  /** Above the fold: load at once instead of lazily. */
  priority?: boolean;
}) {
  const fallback = photoWidths(photo).at(1) ?? photoWidths(photo)[0];
  return (
    <picture>
      <source type="image/avif" srcSet={photoSrcSet(photo, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={photoSrcSet(photo, "webp")} sizes={sizes} />
      {}
      <img
        src={`/photos/${photo.id}-${fallback}.jpg`}
        srcSet={photoSrcSet(photo, "jpg")}
        sizes={sizes}
        alt={photo.alt[locale]}
        width={photo.width}
        height={photo.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={cn("h-full w-full object-cover", className)}
      />
    </picture>
  );
}
