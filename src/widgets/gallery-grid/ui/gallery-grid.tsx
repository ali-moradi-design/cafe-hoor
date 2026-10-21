import type { Locale } from "@/shared/i18n";
import { photoLargest, type Photo as PhotoData } from "@/shared/photos";
import { Photo } from "@/shared/ui";

import { GalleryLightbox } from "./gallery-lightbox";

/** Masonry-style photo grid; each photo opens full size in the lightbox. */
export function GalleryGrid({
  photos,
  locale,
  labels,
}: {
  photos: PhotoData[];
  locale: Locale;
  labels: { close: string; next: string; prev: string };
}) {
  return (
    <GalleryLightbox labels={labels}>
      <ul className="columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4">
        {photos.map((photo, index) => {
          const large = photoLargest(photo);
          return (
            <li key={photo.id} className="mb-2 break-inside-avoid sm:mb-3">
              <a
                href={large.src}
                data-pswp-width={large.width}
                data-pswp-height={large.height}
                className="block overflow-hidden rounded-xl bg-sand focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Photo
                  photo={photo}
                  locale={locale}
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
                  priority={index < 4}
                  className="transition-transform duration-500 hover:scale-105 motion-reduce:transition-none"
                />
              </a>
            </li>
          );
        })}
      </ul>
    </GalleryLightbox>
  );
}
