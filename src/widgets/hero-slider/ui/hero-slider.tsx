"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import type { Photo as PhotoData } from "@/shared/photos";
import { Photo } from "@/shared/ui";

const INTERVAL = 5500;

/**
 * Full-width photo slider: photos cross-fade, a thin timeline with one dot per
 * photo runs along the bottom. Pauses on hover and focus; no autoplay when the
 * visitor prefers reduced motion.
 */
export function HeroSlider({
  photos,
  locale,
  labels,
}: {
  photos: PhotoData[];
  locale: Locale;
  labels: { slide: string };
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(
      () => setCurrent((index) => (index + 1) % photos.length),
      INTERVAL,
    );
    return () => window.clearTimeout(id);
  }, [current, paused, photos.length]);

  return (
    <section
      aria-roledescription="carousel"
      className="relative h-[78svh] min-h-96 overflow-hidden bg-pine lg:h-[calc(100svh-6rem)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          aria-hidden={index !== current}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none",
            index === current ? "opacity-100" : "opacity-0",
          )}
        >
          <Photo photo={photo} locale={locale} sizes="100vw" priority={index === 0} />
        </div>
      ))}

      <div className="absolute inset-x-[6%] bottom-8 flex items-center justify-between">
        <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-white/90" />
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={labels.slide.replace("{n}", String(index + 1))}
            aria-current={index === current ? "true" : undefined}
            className="relative grid size-6 place-items-center"
          >
            <span
              className={cn(
                "block rounded-full transition-all",
                index === current ? "size-3.5 border-2 border-red bg-white" : "size-2 bg-red",
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
