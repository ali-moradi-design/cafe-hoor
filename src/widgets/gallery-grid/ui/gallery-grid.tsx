import type { Locale } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { photoLargest, type Photo as PhotoData } from "@/shared/photos";
import { Parallax, Photo } from "@/shared/ui";

import { GalleryLightbox } from "./gallery-lightbox";

/**
 * Every photo in three loose columns; the middle column starts lower, and each
 * photo drifts in like the photos on the home page. A photo opens full size in
 * the lightbox.
 */
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
      <ul className="mx-auto grid max-w-[880px] grid-cols-2 gap-x-6 gap-y-16 sm:grid-cols-3 sm:gap-x-12 sm:gap-y-24">
        {photos.map((photo, index) => {
          const large = photoLargest(photo);
          return (
            <li
              key={photo.id}
              className={cn(index % 3 === 1 && "sm:mt-40", index % 2 === 1 && "max-sm:mt-20")}
            >
              <Parallax>
                <a
                  href={large.src}
                  data-pswp-width={large.width}
                  data-pswp-height={large.height}
                  className="block aspect-[2/3] overflow-hidden"
                >
                  <Photo
                    photo={photo}
                    locale={locale}
                    sizes="(min-width: 640px) 260px, 45vw"
                    priority={index < 3}
                    className="h-full transition-transform duration-700 hover:scale-105 motion-reduce:transition-none"
                  />
                </a>
              </Parallax>
            </li>
          );
        })}
      </ul>
    </GalleryLightbox>
  );
}
